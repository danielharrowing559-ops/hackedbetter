import os
from flask import Flask, request, jsonify
from supabase import create_client, Client
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)


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


if __name__ == "__main__":
    app.run(debug=True)
