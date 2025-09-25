
# YUVA Medical Platform

A comprehensive multilingual medical platform that breaks language barriers in healthcare with AI-powered translation, disease prediction, and patient care management.

## 🚀 Quick Start

### Option 1: Automated Development (Recommended)

**Simply run:**
```bash
npm run dev
```

This will automatically:
- Start the Python API server (port 5000)
- Start the Vite frontend server (port 3000)
- Both servers run simultaneously
- API endpoints are immediately available

### Option 2: One-Click Launch

1. **Double-click `start_yuva_fixed.bat`** - This will automatically:
   - Install all dependencies
   - Start the lightweight backend API server (port 5000)
   - Start the frontend development server (port 3000/3001)
   - Open the application in your browser

**Note:** If you experience "failed to fetch" errors, use `start_yuva_fixed.bat` which uses a more reliable backend server.

### Option 3: Manual Setup

#### Prerequisites
- **Python 3.8+** - [Download here](https://python.org/)
- **Node.js 16+** - [Download here](https://nodejs.org/)

#### Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Start the backend API server
python simple_api.py
```

#### Frontend Setup
```bash
# Install Node.js dependencies
npm install

# Start the frontend development server
npm run dev:frontend
```

#### Alternative: Concurrent Setup
```bash
# Start both servers simultaneously
npm run dev:concurrent
```

## 🌟 Features

- 🤖 **AI Disease Prediction** - Advanced ML model for symptom analysis
- 🌐 **Real-time Medical Translation** - Translate between 15+ languages
- 🎙️ **Voice Translation** - Speak medical phrases and get instant voice translations
- 👨‍⚕️ **Doctor Recommendations** - Find specialists by location and specialty
- 🤟 **Sign Language Support** - Convert speech/text to sign language
- 📋 **Patient Records** - Secure medical history management
- 🏥 **Hospital Locations** - Find nearby hospitals with GPS

## 🔧 API Endpoints

### Backend API (Port 5000)

- `POST /predict` - AI disease prediction
  ```json
  {
    "symptoms": ["fever", "headache", "nausea"]
  }
  ```

- `POST /translate` - Medical text translation
  ```json
  {
    "text": "I have a headache",
    "src_lang": "en",
    "tgt_lang": "es"
  }
  ```

- `POST /hospitals` - Find nearby hospitals
  ```json
  {
    "latitude": 12.9716,
    "longitude": 77.5946
  }
  ```

## 🧪 Testing

Run the API test script to verify all endpoints:
```bash
test_api.bat
```

## 📁 Project Structure

```
YUVA/
├── src/                          # React frontend
│   ├── components/              # UI components
│   │   ├── disease-prediction.tsx
│   │   ├── doctor-recommendations.tsx
│   │   ├── translation-interface.tsx
│   │   └── ...
│   └── ...
├── backend/                     # Backend models and data
│   ├── model_rf.pkl            # Trained ML model
│   ├── symptom_columns.txt     # Symptom definitions
│   └── ...
├── api.py                      # FastAPI backend server
├── requirements.txt            # Python dependencies
├── package.json               # Node.js dependencies
├── start_yuva.bat            # One-click launcher
├── test_api.bat              # API testing script
└── README.md                 # This file
```

## 🛠️ Technologies

### Frontend
- **React 18** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Radix UI** - Components

### Backend
- **FastAPI** - Python web framework
- **scikit-learn** - Machine learning
- **pandas** - Data processing
- **LibreTranslate API** - Translation services

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use**
   - Backend: Change port in `api.py` (line 156)
   - Frontend: Change port in `vite.config.ts` (line 57)

2. **Dependencies not found**
   - Run `pip install -r requirements.txt`
   - Run `npm install`

3. **Model not found**
   - Ensure `backend/model_rf.pkl` exists
   - Check file permissions

### Getting Help

1. Check console for error messages
2. Verify both servers are running on correct ports
3. Test API endpoints with `test_api.bat`
4. Check browser developer tools for network errors

## 📝 Usage Guide

### Disease Prediction
1. Go to "AI Diagnosis" tab
2. Enter symptoms (use exact names from dataset)
3. Click "Predict Disease (AI)"

### Medical Translation
1. Go to "Translate" tab
2. Select source and target languages
3. Enter text and click "Translate"

### Voice Translation
1. Go to "Voice" tab
2. Select source and target languages
3. Click "Start Voice Input" and speak clearly
4. The system will automatically translate and speak the result
5. Use "Speak Translation" to replay the last translation

### Find Doctors
1. Go to "Find Doctors" tab
2. Use filters for specialty, location, language
3. View profiles and book appointments

## ⚠️ Medical Disclaimer

This platform is for informational purposes only and should not replace professional medical advice. Always consult qualified healthcare providers for proper diagnosis and treatment.

## 📄 License

Educational and research purposes only. Ensure compliance with medical data regulations in production use.
  