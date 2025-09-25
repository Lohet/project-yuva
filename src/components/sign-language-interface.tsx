import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Hand, Play, Pause, Volume2 } from 'lucide-react';

export function SignLanguageInterface() {
  const [inputText, setInputText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Sign Language Support</h2>
        <p className="text-muted-foreground">
          Convert speech and text to sign language animations for accessible communication.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hand className="h-5 w-5" />
            Text to Sign Language
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Enter text to convert</label>
            <textarea
              className="w-full h-24 p-3 border rounded-md resize-none"
              placeholder="Enter medical text to convert to sign language..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline">
              <Volume2 className="h-4 w-4 mr-2" />
              Voice Input
            </Button>
            <Button>
              Convert to Signs
            </Button>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center">
              <Hand className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Sign language animation will appear here</p>
              {inputText && (
                <Button 
                  onClick={handlePlay} 
                  className="mt-4"
                  variant="outline"
                >
                  {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isPlaying ? 'Pause' : 'Play'} Animation
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}