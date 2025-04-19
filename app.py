from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configure Gemini API
try:
    GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
    if not GOOGLE_API_KEY:
        raise ValueError("GOOGLE_API_KEY not found in environment variables")
    
    print(f"API Key found: {GOOGLE_API_KEY[:5]}...")  # Print first 5 chars for verification
    genai.configure(api_key=GOOGLE_API_KEY)
    
    # Initialize the model with the correct name
    model = genai.GenerativeModel('gemini-2.0-flash')
    print("Gemini model initialized successfully")
except Exception as e:
    print(f"Error configuring Gemini API: {str(e)}")
    raise

# Smart home context for the model
SMART_HOME_CONTEXT = """
You are AIVA an AI Smart Home Assistant. Your role is to help users with their smart home automation needs.
You can help with:
1. Lighting control and automation
2. Temperature and climate control
3. Security system management
4. Entertainment system control
5. General smart home advice

Always respond in a helpful, friendly, and professional manner.
Keep responses concise and focused on smart home automation.
If asked about topics outside smart home automation, politely redirect to relevant smart home features.
"""

@app.route('/api/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No JSON data received'}), 400
            
        user_message = data.get('message', '')
        print(f"Received message: {user_message}")  # Log received message
        
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400

        # Create the conversation with context
        conversation = [
            {"role": "user", "parts": [SMART_HOME_CONTEXT]},
            {"role": "model", "parts": ["I understand my role as a Smart Home Assistant. How can I help you today?"]},
            {"role": "user", "parts": [user_message]}
        ]

        # Generate response
        print("Generating response from Gemini...")
        response = model.generate_content(conversation)
        print("Response generated successfully")
        
        return jsonify({
            'response': response.text
        })

    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")  # Add detailed error logging
        return jsonify({'error': str(e)}), 500

@app.route('/api/status', methods=['GET'])
def get_status():
    try:
        return jsonify({
            'status': 'online',
            'services': ['lights', 'temperature', 'security', 'entertainment']
        })
    except Exception as e:
        print(f"Error in status endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')