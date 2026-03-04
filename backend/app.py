import os
import uuid
from flask import Flask, request, jsonify, session

from supabase import create_client, Client
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = os.environ.get("SECRET_env")
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_PUBLISHABLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise Exception("Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY in .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


@app.route("/signup", methods=["POST"])
def sign_up():
    data = request.get_json() or {}
    name = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    try:
        # Check if email exists
        email_check = (
            supabase.table("users")
            .select("email")
            .eq("email", email)
            .execute()
        )

        if email_check.data:
            return jsonify({"error": "Email already exists"}), 400

        # Create session token
        session_token = str(uuid.uuid4())

        # Insert user
        supabase.table("users").insert({"email": email,
            "password": password,
            "name": name
        }).execute()
        id = supabase.table("users").select("id").eq("email", email).execute()
        session["id"] = id.data[0]["id"]
        return jsonify({}), 200

        return jsonify({"error": "Signup failed"}), 400

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 400



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



@app.route("/selectpet", methods=["POST"])
def select_pet():
    data = request.get_json() or {}
    session = data.get("session")
    pet_id = data.get("pet_id")

    if not session or not pet_id:
        return jsonify({"error": "session and pet_id required"}), 400

    try:

        supabase.table("users") .update({"pet_id": pet_id}).eq("id", session["id"]) .execute()
        return jsonify({}), 200

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)
