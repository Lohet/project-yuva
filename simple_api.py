#!/usr/bin/env python3
"""
Simple YUVA Medical Platform API
A lightweight version that focuses on core functionality
"""

import json
import sys
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.parse
import urllib.request

# Add backend directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), "backend"))

# Import the model function
try:
    from model1 import predict_disease
    MODEL_AVAILABLE = True
except ImportError as e:
    print(f"Warning: Model not available: {e}")
    MODEL_AVAILABLE = False

class YUVAHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        """Handle POST requests"""
        if self.path == '/predict':
            self.handle_predict()
        elif self.path == '/translate':
            self.handle_translate()
        elif self.path == '/hospitals':
            self.handle_hospitals()
        else:
            self.send_error(404, "Not Found")

    def handle_predict(self):
        """Handle disease prediction requests"""
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            symptoms = data.get('symptoms', [])
            
            if not MODEL_AVAILABLE:
                prediction = "Model not available - please check backend setup"
            else:
                prediction = predict_disease(symptoms)
            
            response = {"prediction": prediction}
            self.send_json_response(response)
            
        except Exception as e:
            error_response = {"prediction": f"Error: {str(e)}"}
            self.send_json_response(error_response, status=500)

    def handle_translate(self):
        """Handle translation requests"""
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            text = data.get('text', '')
            src_lang = data.get('src_lang', 'en')
            tgt_lang = data.get('tgt_lang', 'es')
            
            # Local medical translations
            medical_translations = {
                "en": {
                    "es": {
                        "hello": "hola",
                        "i have a headache": "tengo dolor de cabeza",
                        "i have a fever": "tengo fiebre",
                        "i have chest pain": "tengo dolor en el pecho",
                        "where does it hurt": "dónde duele",
                        "take this medicine": "tome esta medicina",
                        "twice daily": "dos veces al día",
                        "i feel sick": "me siento enfermo",
                        "i have nausea": "tengo náuseas",
                        "i have a cough": "tengo tos",
                        "i have a cold": "tengo un resfriado",
                        "i have joint pain": "tengo dolor en las articulaciones",
                        "i have back pain": "tengo dolor de espalda",
                        "i have stomach pain": "tengo dolor de estómago"
                    },
                    "fr": {
                        "hello": "bonjour",
                        "i have a headache": "j'ai mal à la tête",
                        "i have a fever": "j'ai de la fièvre",
                        "i have chest pain": "j'ai mal à la poitrine",
                        "where does it hurt": "où est-ce que ça fait mal",
                        "take this medicine": "prenez ce médicament",
                        "twice daily": "deux fois par jour",
                        "i feel sick": "je me sens malade",
                        "i have nausea": "j'ai des nausées",
                        "i have a cough": "j'ai une toux"
                    },
                    "hi": {
                        "hello": "नमस्ते",
                        "i have a headache": "मुझे सिरदर्द है",
                        "i have a fever": "मुझे बुखार है",
                        "i have chest pain": "मुझे छाती में दर्द है",
                        "where does it hurt": "कहाँ दर्द हो रहा है",
                        "take this medicine": "यह दवा लें",
                        "twice daily": "दिन में दो बार",
                        "i feel sick": "मैं बीमार महसूस कर रहा हूँ",
                        "i have nausea": "मुझे मतली आ रही है",
                        "i have a cough": "मुझे खांसी है"
                    }
                }
            }
            
            # Try local translation first
            text_lower = text.lower().strip()
            translation = ""
            
            if src_lang in medical_translations and tgt_lang in medical_translations[src_lang]:
                translation = medical_translations[src_lang][tgt_lang].get(text_lower, "")
            
            # If no local translation, try LibreTranslate
            if not translation:
                translation = self.translate_with_libretranslate(text, src_lang, tgt_lang)
            
            # If still no translation, return helpful message
            if not translation:
                translation = f"Translation not available for '{text}'. Try common medical phrases like 'I have a headache' or 'Where does it hurt?'"
            
            response = {"translation": translation}
            self.send_json_response(response)
            
        except Exception as e:
            error_response = {"translation": f"Translation error: {str(e)}"}
            self.send_json_response(error_response, status=500)

    def translate_with_libretranslate(self, text, src_lang, tgt_lang):
        """Try LibreTranslate API"""
        try:
            url = "https://libretranslate.de/translate"
            data = {
                "q": text,
                "source": src_lang,
                "target": tgt_lang,
                "format": "text"
            }
            
            req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'))
            req.add_header('Content-Type', 'application/json')
            req.add_header('User-Agent', 'YUVA-Medical-Platform/1.0')
            
            with urllib.request.urlopen(req, timeout=10) as response:
                result = json.loads(response.read().decode('utf-8'))
                return result.get('translatedText', '')
        except Exception as e:
            print(f"LibreTranslate error: {e}")
            return ""

    def handle_hospitals(self):
        """Handle hospital location requests"""
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            # Mock hospital data for Chennai
            hospitals = [
                {
                    "name": "Apollo Hospital",
                    "address": "Perumbakkam, Chennai",
                    "latitude": 12.9126,
                    "longitude": 80.2270,
                    "distance_km": 8.3
                },
                {
                    "name": "Chettinad Hospital",
                    "address": "Kelambakkam, Chennai",
                    "latitude": 12.7852,
                    "longitude": 80.2296,
                    "distance_km": 7.5
                },
                {
                    "name": "VIT University Health Centre",
                    "address": "VIT Chennai, Vandalur-Kelambakkam Road",
                    "latitude": 12.8400,
                    "longitude": 80.1557,
                    "distance_km": 0.2
                }
            ]
            
            self.send_json_response(hospitals)
            
        except Exception as e:
            error_response = {"error": f"Hospital lookup error: {str(e)}"}
            self.send_json_response(error_response, status=500)

    def send_json_response(self, data, status=200):
        """Send JSON response"""
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        response_json = json.dumps(data, ensure_ascii=False)
        self.wfile.write(response_json.encode('utf-8'))

def run_server(port=5000):
    """Run the HTTP server"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, YUVAHandler)
    print(f"YUVA Medical Platform API running on port {port}")
    print(f"Available endpoints:")
    print(f"  POST /predict - Disease prediction")
    print(f"  POST /translate - Medical translation")
    print(f"  POST /hospitals - Hospital locations")
    print(f"  Access at: http://localhost:{port}")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.shutdown()

if __name__ == "__main__":
    run_server()
