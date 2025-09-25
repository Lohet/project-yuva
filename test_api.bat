@echo off
echo Testing YUVA API Endpoints...
echo.

echo Testing Disease Prediction API...
curl -X POST "http://localhost:5000/predict" -H "Content-Type: application/json" -d "{\"symptoms\": [\"fever\", \"headache\"]}" 2>nul
echo.
echo.

echo Testing Translation API...
curl -X POST "http://localhost:5000/translate" -H "Content-Type: application/json" -d "{\"text\": \"I have a headache\", \"src_lang\": \"en\", \"tgt_lang\": \"es\"}" 2>nul
echo.
echo.

echo Testing Hospital API...
curl -X POST "http://localhost:5000/hospitals" -H "Content-Type: application/json" -d "{\"latitude\": 12.9716, \"longitude\": 77.5946}" 2>nul
echo.
echo.

echo API testing complete!
pause
