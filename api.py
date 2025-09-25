# Make sure this file is in c:\Users\hp\YUVA\api.py
# and you run: python -m uvicorn api:app --reload from c:\Users\hp\YUVA

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import requests
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

# Ensure backend.model1 is importable regardless of how the app is started
sys.path.append(os.path.join(os.path.dirname(__file__), "backend"))
from model1 import predict_disease

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictRequest(BaseModel):
    symptoms: List[str]

class PredictResponse(BaseModel):
    prediction: str

@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    try:
        prediction = predict_disease(req.symptoms)
        return PredictResponse(prediction=prediction)
    except Exception as e:
        # Return a clear error for debugging
        return PredictResponse(prediction=f"Error: {str(e)}")

class LocationRequest(BaseModel):
    latitude: float
    longitude: float

class Hospital(BaseModel):
    name: str
    address: str
    latitude: float
    longitude: float
    distance_km: float

@app.post("/hospitals", response_model=List[Hospital])
def get_nearby_hospitals(location: LocationRequest):
    delta = 0.4
    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": "hospital",
        "format": "json",
        "limit": 30,
        "extratags": 1,
        "addressdetails": 1,
        "bounded": 1,
        "viewbox": f"{location.longitude-delta},{location.latitude+delta},{location.longitude+delta},{location.latitude-delta}"
    }
    response = requests.get(url, params=params, headers={"User-Agent": "hospital-finder-app"})
    hospitals_data = response.json()
    print("Nominatim API response:", hospitals_data)  # <-- Add this line

    from math import radians, cos, sin, asin, sqrt

    def haversine(lat1, lon1, lat2, lon2):
        R = 6371
        dlat = radians(lat2 - lat1)
        dlon = radians(lon2 - lon1)
        a = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)**2
        c = 2 * asin(sqrt(a))
        return R * c

    result = []
    for h in hospitals_data:
        try:
            lat = float(h["lat"])
            lon = float(h["lon"])
            dist = haversine(location.latitude, location.longitude, lat, lon)
            if dist <= 20:
                result.append(Hospital(
                    name=h.get("display_name", "Unknown Hospital").split(",")[0],
                    address=h.get("display_name", ""),
                    latitude=lat,
                    longitude=lon,
                    distance_km=round(dist, 2)
                ))
        except Exception:
            continue
    
    # If result is empty after OpenStreetMap API, add some hardcoded hospitals for testing
    if len(result) == 0:
        # Add hardcoded hospitals near VIT Chennai
        hardcoded_hospitals = [
            {
                "name": "VIT University Health Centre",
                "address": "VIT Chennai, Vandalur-Kelambakkam Road, Chennai",
                "latitude": 12.8400,
                "longitude": 80.1557,
                "distance_km": 0.2
            },
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
            }
        ]
        
        for h in hardcoded_hospitals:
            result.append(Hospital(**h))
    
    return result

class TranslateRequest(BaseModel):
    text: str
    src_lang: str
    tgt_lang: str

class TranslateResponse(BaseModel):
    translation: str

def translate_with_libretranslate(text: str, src_lang: str, tgt_lang: str) -> str:
    """Translate using LibreTranslate API"""
    url = "https://libretranslate.de/translate"
    payload = {
        "q": text,
        "source": src_lang,
        "target": tgt_lang,
        "format": "text"
    }
    
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "YUVA-Medical-Platform/1.0"
    }
    
    try:
        resp = requests.post(url, json=payload, headers=headers, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        return data.get("translatedText", "")
    except Exception as e:
        print(f"LibreTranslate error: {e}")
        return ""

def translate_with_google(text: str, src_lang: str, tgt_lang: str) -> str:
    """Fallback translation using Google Translate (simple approach)"""
    try:
        # Simple Google Translate URL approach
        url = "https://translate.googleapis.com/translate_a/single"
        params = {
            "client": "gtx",
            "sl": src_lang,
            "tl": tgt_lang,
            "dt": "t",
            "q": text
        }
        
        resp = requests.get(url, params=params, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        
        if data and len(data) > 0 and len(data[0]) > 0:
            return data[0][0][0]
        return ""
    except Exception as e:
        print(f"Google Translate error: {e}")
        return ""

def translate_with_local(text: str, src_lang: str, tgt_lang: str) -> str:
    """Local fallback translation for common medical terms"""
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
                "i have a cough": "tengo tos"
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
    
    try:
        text_lower = text.lower().strip()
        if src_lang in medical_translations and tgt_lang in medical_translations[src_lang]:
            return medical_translations[src_lang][tgt_lang].get(text_lower, "")
        return ""
    except Exception as e:
        print(f"Local translation error: {e}")
        return ""

@app.post("/translate", response_model=TranslateResponse)
def translate(req: TranslateRequest):
    print(f"Translating: '{req.text}' from {req.src_lang} to {req.tgt_lang}")
    
    # If source and target languages are the same, return original text
    if req.src_lang == req.tgt_lang:
        return TranslateResponse(translation=req.text)
    
    # Try local medical translations first (fastest)
    translation = translate_with_local(req.text, req.src_lang, req.tgt_lang)
    if translation:
        print(f"Local translation found: '{translation}'")
        return TranslateResponse(translation=translation)
    
    # Try LibreTranslate
    print("Trying LibreTranslate...")
    translation = translate_with_libretranslate(req.text, req.src_lang, req.tgt_lang)
    if translation:
        print(f"LibreTranslate successful: '{translation}'")
        return TranslateResponse(translation=translation)
    
    # Try Google Translate as fallback
    print("LibreTranslate failed, trying Google Translate...")
    translation = translate_with_google(req.text, req.src_lang, req.tgt_lang)
    if translation:
        print(f"Google Translate successful: '{translation}'")
        return TranslateResponse(translation=translation)
    
    # If all fail, return helpful error message
    return TranslateResponse(translation="Translation service temporarily unavailable. Please try common medical phrases like 'I have a headache' or 'Where does it hurt?'")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)