# Make sure this file is in c:\Users\hp\YUVA\api.py
# and you run: python -m uvicorn api:app --reload from c:\Users\hp\YUVA

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import requests
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

# Hugging Face translation imports
from transformers import MarianMTModel, MarianTokenizer

# Ensure backend.model1 is importable regardless of how the app is started
sys.path.append(os.path.join(os.path.dirname(__file__), "backend"))
from model1 import predict_disease

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend URL
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

@app.post("/translate", response_model=TranslateResponse)
def translate(req: TranslateRequest):
    # LibreTranslate public API endpoint
    url = "https://libretranslate.de/translate"
    payload = {
        "q": req.text,
        "source": req.src_lang,
        "target": req.tgt_lang,
        "format": "text"
    }
    try:
        resp = requests.post(url, json=payload, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        return TranslateResponse(translation=data.get("translatedText", ""))
    except Exception as e:
        return TranslateResponse(translation=f"Translation error: {str(e)}")