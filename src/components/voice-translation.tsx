import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Languages, Volume2, Mic, MicOff, Copy, RotateCcw } from 'lucide-react';

interface VoiceTranslationProps {
  onTranslate: (text: string, srcLang: string, tgtLang: string) => Promise<string>;
}

export function VoiceTranslation({ onTranslate }: VoiceTranslationProps) {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [fromLang, setFromLang] = useState('en');
  const [toLang, setToLang] = useState('es');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastTranslated, setLastTranslated] = useState('');
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

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

  // Initialize speech recognition
  const initSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      throw new Error('Speech recognition not supported in this browser');
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = fromLang;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setIsListening(false);
      
      // Auto-translate after speech recognition
      handleTranslate(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return recognition;
  };

  // Initialize text-to-speech
  const initTTS = () => {
    if (!('speechSynthesis' in window)) {
      throw new Error('Text-to-speech not supported in this browser');
    }
    return window.speechSynthesis;
  };

  // Start voice recording
  const startListening = () => {
    try {
      setError(null);
      setInputText('');
      setTranslatedText('');
      
      recognitionRef.current = initSpeechRecognition();
      recognitionRef.current.start();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Stop voice recording
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Handle translation
  const handleTranslate = async (text?: string) => {
    const textToTranslate = text || inputText;
    
    if (!textToTranslate.trim()) {
      setError('Please enter text to translate or use voice input');
      return;
    }

    setLoading(true);
    setError(null);
    setTranslatedText('');

    try {
      const translation = await onTranslate(textToTranslate, fromLang, toLang);
      setTranslatedText(translation);
      setLastTranslated(translation);
    } catch (err: any) {
      setError(err.message || 'Translation failed');
    } finally {
      setLoading(false);
    }
  };

  // Speak translated text
  const speakTranslation = () => {
    const textToSpeak = translatedText || lastTranslated;
    
    if (!textToSpeak) {
      setError('No translated text to speak');
      return;
    }

    try {
      synthRef.current = initTTS();
      
      // Stop any ongoing speech
      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = toLang;
      utterance.rate = 0.8;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        console.error('TTS error:', event);
        setError('Text-to-speech error');
        setIsSpeaking(false);
      };
      
      synthRef.current.speak(utterance);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Stop speaking
  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Copy translated text
  const copyTranslation = () => {
    if (translatedText) {
      navigator.clipboard.writeText(translatedText);
    }
  };

  // Clear all text
  const clearAll = () => {
    setInputText('');
    setTranslatedText('');
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Voice Medical Translation</h2>
        <p className="text-muted-foreground">
          Speak medical phrases and get instant translations with voice output
        </p>
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Voice Input</span>
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Voice Output</span>
          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Medical Focused</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            Voice Translation Interface
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Language Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">From Language</label>
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
              <label className="text-sm font-medium mb-2 block">To Language</label>
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

          {/* Voice Controls */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              onClick={isListening ? stopListening : startListening}
              variant={isListening ? "destructive" : "default"}
              className="flex items-center gap-2"
              disabled={loading}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              {isListening ? 'Stop Listening' : 'Start Voice Input'}
            </Button>
            
            <Button
              onClick={speakTranslation}
              variant="outline"
              className="flex items-center gap-2"
              disabled={!translatedText && !lastTranslated}
            >
              {isSpeaking ? <MicOff className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              {isSpeaking ? 'Stop Speaking' : 'Speak Translation'}
            </Button>
            
            <Button
              onClick={() => handleTranslate()}
              variant="secondary"
              disabled={loading || !inputText.trim()}
            >
              {loading ? 'Translating...' : 'Translate Text'}
            </Button>
            
            <Button
              onClick={clearAll}
              variant="outline"
              size="sm"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>

          {/* Text Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Input Text</label>
              <textarea
                className="w-full h-32 p-3 border rounded-md resize-none"
                placeholder="Enter medical text or use voice input..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <div className="text-xs text-muted-foreground mt-1">
                💡 <strong>Voice Examples:</strong> "I have a headache" | "Where does it hurt?" | "Take this medicine twice daily"
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
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyTranslation}
                  disabled={!translatedText}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="text-center">
            {isListening && (
              <div className="text-blue-600 font-medium">
                🎤 Listening... Speak clearly into your microphone
              </div>
            )}
            {isSpeaking && (
              <div className="text-green-600 font-medium">
                🔊 Speaking translation...
              </div>
            )}
            {loading && !isListening && (
              <div className="text-yellow-600 font-medium">
                ⏳ Translating...
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
