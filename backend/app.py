import os 
from flask import Flask, request, jsonify
from supabase import create_client, Client
from dotenv import load_dotenv
load_dotenv()
app = Flask(__name__)
supabase: Client = create_client(
    os.environ.get("SUPABASE_URL"),
    os.environ.get("SUPABASE_PUBLISHABLE_KEY")
)

@app.route("/signin")
def sign_in():
    return supabase.auth.sign_in_with_oauth(
        provider="github",
        options={"redirectTo": "http://localhost:3000/signin/callback"},
    )

@app.route("/signout")
def sign_out():
    supabase.auth.sign_out()
    return {"message": "Signed out successfully"}

@app.route("/signup/callback")
def sign_out_callback():
    return {"message": "Sign out successful"}

@app.route("/signup", methods=["POST"])
def sign_up():
    data = request.get_json()
    name= data.get("username")
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400
    try:
        email_check = supabase.table("users").select("email").eq("email", email).execute()
        if email_check.data:
            return jsonify({"error": "Email already exists"}), 400
        result = supabase.table("users").insert(
            email=email,
            password=password,
            name=name
        )
        if result.user:
            return jsonify({"message": "Signup successful"}), 200
        else:
            return jsonify({"error": "Signup failed"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/')
def index():
    response = supabase.table('instruments').select("*").execute()
    instruments = response.data
    return {"instruments": instruments}

if __name__ == "__main__":
    app.run(debug=True)