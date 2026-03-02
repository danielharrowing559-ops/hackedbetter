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

if __name__ == "__main__":
        
        app.run(debug=True)
