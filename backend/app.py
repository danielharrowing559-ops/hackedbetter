import os
from flask import Flask, request, jsonify
from supabase import create_client, Client
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)


SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_PUBLISHABLE_KEY") 


if not SUPABASE_URL or not SUPABASE_KEY:
    raise Exception("Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY in .env")


supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


@app.route("/signin")
def sign_in():
    try:
        result = supabase.auth.sign_in_with_oauth(
            provider="github",
            options={"redirectTo": "http://localhost:3000/signin/callback"},
        )
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/signout")
def sign_out():
    try:
        supabase.auth.sign_out()
        return jsonify({"message": "Signed out successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/signin/callback")
def sign_in_callback():
    return jsonify({"message": "Sign in successful"})


@app.route("/signup", methods=["POST"])
def sign_up():
    data = request.get_json() or {}
    name = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    try:
        # Check if email already exists
        email_check = (
            supabase.table("users")
            .select("email")
            .eq("email", email)
            .execute()
        )

        if email_check.data:
            return jsonify({"error": "Email already exists"}), 400

        # Insert new user
        result = (
            supabase.table("users")
            .insert({"email": email, "password": password, "name": name})
            .execute()
        )

        if result.data:
            return jsonify({"message": "Signup successful", "data": result.data}), 200

        return jsonify({"error": "Signup failed"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/")
def index():
    try:
        response = supabase.table("instruments").select("*").execute()
        return jsonify({"instruments": response.data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
