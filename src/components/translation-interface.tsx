import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Languages, Volume2, Copy } from 'lucide-react';

export function TranslationInterface() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [fromLang, setFromLang] = useState('en');
  const [toLang, setToLang] = useState('es');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    { code: 'bn', name: 'Bengali' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
  ];

  const handleTranslate = async () => {
    setLoading(true);
    setError(null);
    setTranslatedText('');
    
    if (!inputText.trim()) {
      setError('Please enter text to translate');
      setLoading(false);
      return;
    }
    
    try {
      // Try multiple ports in case server is running on different port
      const ports = [5000, 5001, 8000];
      let lastError = null;
      
      for (const port of ports) {
        try {
          const resp = await fetch(`http://localhost:${port}/translate`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              text: inputText,
              src_lang: fromLang,
              tgt_lang: toLang,
            }),
          });
          
          if (resp.ok) {
            const data = await resp.json();
            setTranslatedText(data.translation || 'No translation available');
            setLoading(false);
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
      throw new Error(`Translation service unavailable. Last error: ${lastError}`);
      
    } catch (e: any) {
      setError(e.message || 'Translation service unavailable. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Medical Translation</h2>
        <p className="text-muted-foreground">
          Translate medical conversations in real-time with specialized terminology support using LibreTranslate API.
        </p>
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Powered by LibreTranslate</span>
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">15+ Languages</span>
          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Medical Terminology</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            Real-Time Medical Translation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">From</label>
              <Select value={fromLang} onValueChange={setFromLang}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">To</label>
              <Select value={toLang} onValueChange={setToLang}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Input Text</label>
              <textarea
                className="w-full h-32 p-3 border rounded-md resize-none"
                placeholder="Enter medical text to translate... (e.g., 'I have a headache and fever')"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <div className="text-xs text-muted-foreground mt-1">
                💡 <strong>Examples:</strong> "I have chest pain" | "Where does it hurt?" | "Take this medicine twice daily"
              </div>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline">
                  <Volume2 className="h-4 w-4 mr-1" />
                  Listen
                </Button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Translation</label>
              <div className="w-full h-32 p-3 border rounded-md bg-muted/30">
                {loading
                  ? 'Translating...'
                  : error
                  ? <span className="text-red-600">{error}</span>
                  : translatedText || 'Translation will appear here...'}
              </div>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline">
                  <Volume2 className="h-4 w-4 mr-1" />
                  Speak
                </Button>
                <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(translatedText)}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
            </div>
          </div>

          <Button onClick={handleTranslate} className="w-full" disabled={loading || !inputText}>
            Translate
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}