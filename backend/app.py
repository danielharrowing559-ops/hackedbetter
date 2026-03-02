import os 
from flask import Flask
from supabase import create_client, Client
from dotenv import load_dotenv
load_dotenv()
app = Flask(__name__)
supabase: Client = create_client(
    os.environ.get("SUPABASE_URL"),
    os.environ.get("SUPABASE_PUBLISHABLE_KEY")
)

@app.route("/SignIn")
def sign_in():
    return supabase.auth.sign_in_with_oauth(
        provider="github",
        options={"redirectTo": "http://localhost:3000/SignInCallback"},
    )

@app.route("/SignOut")
def sign_out():
    supabase.auth.sign_out()
    return {"message": "Signed out successfully"}

@app.route("/SignOutCallback")
def sign_out_callback():
    return {"message": "Sign out successful"}

@app.route("/SignUp")
def sign_up():
    return supabase.auth.sign_up_with_email(
        email="user@example.com",
        password="password",
        options={"redirectTo": "http://localhost:3000/SignUpCallback"},
    )

@app.route('/')
def index():
    response = supabase.table('instruments').select("*").execute()
    instruments = response.data
    return {"instruments": instruments}

if __name__ == "__main__":
    app.run(debug=True)
