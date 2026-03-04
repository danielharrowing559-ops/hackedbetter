import os
from flask import Flask, request, jsonify, session
from supabase import create_client, Client
from dotenv import load_dotenv
from flask_cors import CORS
import bcrypt

load_dotenv()

# Initialize Flask app and Supabase client. 

app = Flask(__name__) 
CORS(app, supports_credentials=True)
secret_key = os.environ.get("SECRET_env")
app.secret_key = secret_key

supabase: Client = create_client(
    os.environ.get("SUPABASE_URL"),
    os.environ.get("SUPABASE_PUBLISHABLE_KEY")
)

@app.route("/signup", methods=["POST"])
def sign_up():
    data = request.get_json() or {}
    name = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"})

    try:
        # Check if the email is actually existing in the database before inserting the user. 
       
        email_check = (
            supabase.table("users")
            .select("email")
            .eq("email", email)
            .execute()
        )

        if email_check.data:
            return jsonify({"error": "Email already exists"}), 400

        # Hash the password with bcrypt before inserting
       
        pw_bytes = (password+secret_key).encode("utf-8")
        salt = bcrypt.gensalt()
        hashed_pw = bcrypt.hashpw(pw_bytes, salt).decode("utf-8")

        # Insert the user (store hashed password, not plaintext)
        
        supabase.table("users").insert({"email": email,
            "password": hashed_pw,
            "name": name
        }).execute()
        
        id = supabase.table("users").select("id").eq("email", email).execute()
        session["id"] = id.data[0]["id"]
        return jsonify({}), 200

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 400


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    try:
        # Check if the email is actually existing in the database before inserting the user. 
       
        email_check = (
            supabase.table("users")
            .select("email")
            .eq("email", email)
            .execute()
        )

        if not email_check.data:
            return jsonify({"error": "Email doesn't exists"}), 400
        
        # Check hashed password

        db_password = (supabase.table("users").select("password").eq("email", email))
        pw_bytes = (password+secret_key).encode("utf-8")
        salt = bcrypt.gensalt()
        hashed_pw = bcrypt.hashpw(pw_bytes, salt).decode("utf-8")
        result = bcrypt.checkpw(hashed_pw, db_password)
        if result:
            id = supabase.table("users").select("id").eq("email", email).execute()
            session["id"] = id.data[0]["id"]
            return jsonify({}), 200
        else:
            return jsonify({"error": "Incorrect credentials"}), 400

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 400

# This is the endpoint that will be called when the user wants to get the list of pets. 

@app.route("/getpets", methods=["GET"])
def get_pets():
    try:
        result = (
            supabase
            .table("pets")
            .select("*")
            .execute()
        )
        return jsonify({"pets": result.data}), 200

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 400


# This is the endpoint that will be called when the user selects a pet. 
@app.route("/selectpet", methods=["POST"])
def select_pet():
    data = request.get_json() or {}
    pet_id = data.get("pet_id")
    print("pet_id", pet_id)

    if not pet_id:
        return jsonify({"error": "session and pet_id required"}), 400
    try:
        supabase.table("users") .update({"pet_id": pet_id}).eq("id", session["id"]) .execute()
        return jsonify({}), 200

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)
