from http.server import BaseHTTPRequestHandler
import json
import os
from google import genai
from google.genai import types

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        req_body = json.loads(post_data.decode('utf-8'))
        user_message = req_body.get('message', '')

        # Vercel Environment Variables se API key lena
        api_key = os.environ.get("GEMINI_API_KEY")
        client = genai.Client(api_key=api_key)

        # Meculius ke rules aur creator identity
        SYSTEM_INSTRUCTION = """
        Tumhara naam Meculius hai. Tum ek highly advanced aur friendly tech AI ho. 
        Tumhara kaam users ko computer, software aur latest technology ke baare me accurate jankari dena hai.
        IMPORTANT RULES:
        1. Agar koi puche 'Who is your creator?', 'Tumhe kisne banaya?', ya creator ke baare me puche, toh proudly kaho: 'Mujhe Devansh Tripathi ne banaya hai.'
        2. Hamesha latest web research ke hisaab se sahi aur fast jawab do.
        """

        try:
            response = client.models.generate_content(
                model='gemini-3.8-flash',
                contents=user_message,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_INSTRUCTION,
                    temperature=0.7,
                    tools=[{"google_search": {}}]
                )
            )
            reply_text = response.text
        except Exception as e:
            reply_text = f"Internal Error: {str(e)}"

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({"reply": reply_text}).encode('utf-8'))
        
