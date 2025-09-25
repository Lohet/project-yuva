import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Activity, AlertTriangle, CheckCircle } from 'lucide-react';

export function DiseasePrediction() {
  const [symptomInput, setSymptomInput] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [apiResult, setApiResult] = useState<any | null>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Add symptom from input
  // Common symptoms mapping for user-friendly input
  const symptomMapping: { [key: string]: string } = {
    'fever': 'high_fever',
    'mild fever': 'mild_fever',
    'cold': 'chills',
    'sneezing': 'continuous_sneezing',
    'cough': 'cough',
    'headache': 'headache',
    'nausea': 'nausea',
    'vomiting': 'vomiting',
    'diarrhea': 'diarrhoea',
    'constipation': 'constipation',
    'fatigue': 'fatigue',
    'weakness': 'lethargy',
    'joint pain': 'joint_pain',
    'muscle pain': 'muscle_pain',
    'chest pain': 'chest_pain',
    'abdominal pain': 'abdominal_pain',
    'back pain': 'back_pain',
    'stomach pain': 'stomach_pain',
    'skin rash': 'skin_rash',
    'itching': 'itching',
    'dizziness': 'dizziness',
    'anxiety': 'anxiety',
    'depression': 'depression',
    'weight loss': 'weight_loss',
    'weight gain': 'weight_gain'
  };

  const addSymptom = () => {
    const s = symptomInput.trim().toLowerCase();
    if (s && !symptoms.includes(s)) {
      // Map user input to model's expected symptom names
      const mappedSymptom = symptomMapping[s] || s;
      setSymptoms([...symptoms, mappedSymptom]);
      setSymptomInput('');
    }
  };

  // Remove a symptom
  const removeSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter(s => s !== symptom));
  };

  // API integration: Call backend at /predict
  const predictWithAPI = async () => {
    setApiLoading(true);
    setApiError(null);
    setApiResult(null);
    
    if (symptoms.length === 0) {
      setApiError("Please add at least one symptom");
      setApiLoading(false);
      return;
    }
    
    try {
      // Try multiple ports in case server is running on different port
      const ports = [5000, 5001, 8000];
      let lastError = null;
      
      for (const port of ports) {
        try {
          const resp = await fetch(`http://localhost:${port}/predict`, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({ symptoms }),
          });
          
          if (resp.ok) {
            const data = await resp.json();
            setApiResult(data);
            setApiLoading(false);
            return;
          } else {
            lastError = `Server responded with status ${resp.status}`;
          }
        } catch (e: any) {
          lastError = e.message;
          continue; // Try next port
        }
      }
      
      // If all ports failed
      throw new Error(`Prediction service unavailable. Last error: ${lastError}`);
      
    } catch (e: any) {
      setApiError(e.message || "Prediction service unavailable. Please ensure the backend server is running.");
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">AI Disease Prediction</h2>
        <p className="text-muted-foreground">
          Enter your symptoms (as in the dataset) to get an AI-powered diagnosis.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Symptom Entry
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-3 block">
              Enter symptoms (one at a time, as in the dataset columns):
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className="border rounded px-2 py-1 flex-1"
                placeholder="e.g. fever, cold, headache, joint pain"
                value={symptomInput}
                onChange={e => setSymptomInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addSymptom(); }}
              />
              <Button onClick={addSymptom} disabled={!symptomInput.trim()}>
                Add
              </Button>
            </div>
            <div className="text-xs text-muted-foreground mb-2">
              💡 <strong>Tip:</strong> Use common terms like "fever", "cold", "headache" - they'll be automatically mapped to the correct medical terms.
            </div>
            <div className="flex flex-wrap gap-2">
              {symptoms.map(symptom => (
                <Badge key={symptom} variant="secondary" className="flex items-center gap-1">
                  {symptom}
                  <button
                    className="ml-1 text-xs text-red-500"
                    onClick={() => removeSymptom(symptom)}
                    aria-label="Remove"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <Button
            onClick={predictWithAPI}
            disabled={symptoms.length === 0 || apiLoading}
            className="w-full"
          >
            {apiLoading ? "Predicting..." : "Predict Disease (AI)"}
          </Button>

          {apiResult && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
              <strong>Predicted Disease:</strong>{" "}
              {apiResult.prediction || JSON.stringify(apiResult)}
            </div>
          )}
          {apiError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
              {apiError}
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">Medical Disclaimer</p>
                <p className="text-yellow-700">
                  This AI analysis is for informational purposes only and should not replace professional medical advice.
                  Please consult with a healthcare provider for proper diagnosis and treatment.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}