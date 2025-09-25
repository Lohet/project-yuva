import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { 
  Languages, 
  Activity, 
  Stethoscope, 
  Hand, 
  FileText, 
  Globe, 
  Shield, 
  Heart,
  Users,
  Award,
  Zap,
  Volume2
} from 'lucide-react';
import { TranslationInterface } from './components/translation-interface';
import { VoiceTranslation } from './components/voice-translation';
import { DiseasePrediction } from './components/disease-prediction';
import { DoctorRecommendations } from './components/doctor-recommendations';
import { SignLanguageInterface } from './components/sign-language-interface';
import { PatientHistory } from './components/patient-history';
import { HospitalLocations } from './components/hospital-locations';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { LocationProvider } from './contexts/LocationContext';

function LandingPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl lg:text-4xl">MediBridge Platform</h1>
        </div>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Breaking language barriers in healthcare with AI-powered translation, 
          disease prediction, and comprehensive patient care management.
        </p>
        
        <div className="flex flex-wrap justify-center gap-3">
          <Badge variant="secondary" className="text-sm px-3 py-1">
            <Globe className="h-4 w-4 mr-2" />
            Real-time Translation
          </Badge>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            <Activity className="h-4 w-4 mr-2" />
            AI Disease Prediction
          </Badge>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            <Hand className="h-4 w-4 mr-2" />
            Sign Language Support
          </Badge>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            <Shield className="h-4 w-4 mr-2" />
            Secure Records
          </Badge>
        </div>
        
        <div className="mt-8">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1758691462858-f1286e5daf40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwaGVhbHRoY2FyZSUyMGRvY3RvciUyMHBhdGllbnR8ZW58MXx8fHwxNzU4NzA5OTc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Healthcare professionals"
            className="w-full max-w-2xl mx-auto rounded-xl shadow-lg"
          />
        </div>
      </div>
      
      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardHeader>
            <Languages className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <CardTitle className="text-lg">Real-Time Translation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Instantly translate medical conversations between 8+ languages with 
              specialized medical terminology support.
            </p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardHeader>
            <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <CardTitle className="text-lg">AI Disease Prediction</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Advanced AI analysis of symptoms and patient data to predict 
              possible conditions and suggest appropriate care.
            </p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardHeader>
            <Stethoscope className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <CardTitle className="text-lg">Doctor Matching</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Find qualified specialists based on symptoms, location, 
              language preferences, and availability.
            </p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardHeader>
            <Hand className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <CardTitle className="text-lg">Sign Language</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Convert speech and text to sign language animations for 
              deaf and hard-of-hearing patients.
            </p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardHeader>
            <FileText className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <CardTitle className="text-lg">Patient Records</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Secure digital storage of patient history, prescriptions, 
              and lab results with multilingual support.
            </p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardHeader>
            <Zap className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <CardTitle className="text-lg">Emergency Ready</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Quick access to critical patient information and emergency 
              translation for urgent medical situations.
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Stats Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl mb-1">8+</div>
              <div className="text-sm text-muted-foreground">Languages Supported</div>
            </div>
            <div>
              <div className="text-2xl mb-1">95%</div>
              <div className="text-sm text-muted-foreground">Translation Accuracy</div>
            </div>
            <div>
              <div className="text-2xl mb-1">&lt;2s</div>
              <div className="text-sm text-muted-foreground">Response Time</div>
            </div>
            <div>
              <div className="text-2xl mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">Available</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');

  // Translation function for voice component
  const handleVoiceTranslate = async (text: string, srcLang: string, tgtLang: string): Promise<string> => {
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
              text,
              src_lang: srcLang,
              tgt_lang: tgtLang,
            }),
          });
          
          if (resp.ok) {
            const data = await resp.json();
            return data.translation || 'No translation available';
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
      throw new Error(e.message || 'Translation service unavailable. Please ensure the backend server is running.');
    }
  };

  return (
    <LocationProvider>
      <div className="min-h-screen bg-background">
        <header className="border-b bg-white sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl">MediBridge</span>
              </div>
              
              <nav className="hidden md:flex items-center gap-6">
                <Button 
                  variant={activeTab === 'overview' ? 'default' : 'ghost'} 
                  onClick={() => setActiveTab('overview')}
                  size="sm"
                >
                  Overview
                </Button>
                <Button 
                  variant={activeTab === 'translate' ? 'default' : 'ghost'} 
                  onClick={() => setActiveTab('translate')}
                  size="sm"
                >
                  <Languages className="h-4 w-4 mr-2" />
                  Translate
                </Button>
                <Button 
                  variant={activeTab === 'voice' ? 'default' : 'ghost'} 
                  onClick={() => setActiveTab('voice')}
                  size="sm"
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  Voice
                </Button>
                <Button 
                  variant={activeTab === 'predict' ? 'default' : 'ghost'} 
                  onClick={() => setActiveTab('predict')}
                  size="sm"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  AI Diagnosis
                </Button>
                <Button 
                  variant={activeTab === 'doctors' ? 'default' : 'ghost'} 
                  onClick={() => setActiveTab('doctors')}
                  size="sm"
                >
                  <Stethoscope className="h-4 w-4 mr-2" />
                  Find Doctors
                </Button>
                <Button 
                  variant={activeTab === 'signs' ? 'default' : 'ghost'} 
                  onClick={() => setActiveTab('signs')}
                  size="sm"
                >
                  <Hand className="h-4 w-4 mr-2" />
                  Sign Language
                </Button>
                <Button 
                  variant={activeTab === 'history' ? 'default' : 'ghost'} 
                  onClick={() => setActiveTab('history')}
                  size="sm"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Records
                </Button>
              </nav>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  HIPAA Compliant
                </Badge>
              </div>
            </div>
            
            {/* Mobile Navigation */}
            <div className="md:hidden mt-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview" className="text-xs">
              <Heart className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="translate" className="text-xs">
              <Languages className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="voice" className="text-xs">
              <Volume2 className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="predict" className="text-xs">
              <Activity className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="doctors" className="text-xs">
              <Stethoscope className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="signs" className="text-xs">
              <Hand className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs">
              <FileText className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="hospitals" className="text-xs">
              <Globe className="h-4 w-4" />
            </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && <LandingPage />}
        {activeTab === 'translate' && <TranslationInterface />}
        {activeTab === 'voice' && <VoiceTranslation onTranslate={handleVoiceTranslate} />}
        {activeTab === 'predict' && <DiseasePrediction />}
        {activeTab === 'doctors' && <DoctorRecommendations />}
        {activeTab === 'signs' && <SignLanguageInterface />}
        {activeTab === 'history' && <PatientHistory />}
        {activeTab === 'hospitals' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Hospital Locations</h2>
            <p className="text-muted-foreground">
              Find specialist hospitals near you with our location-based search powered by the YUVA location API.
            </p>
            <HospitalLocations />
          </div>
        )}
      </main>

      <footer className="border-t bg-muted/30 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <Heart className="h-3 w-3 text-white" />
                </div>
                <span>MediBridge</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Breaking language barriers in healthcare through technology.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Real-time Translation</li>
                <li>AI Disease Prediction</li>
                <li>Doctor Recommendations</li>
                <li>Sign Language Support</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm mb-4">Languages</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>English, Spanish, French</li>
                <li>Chinese, Arabic, Hindi</li>
                <li>Portuguese, Russian</li>
                <li>+ More coming soon</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm mb-4">Security</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>HIPAA Compliant</li>
                <li>End-to-end Encryption</li>
                <li>Secure Data Storage</li>
                <li>Privacy Protected</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 MediBridge Platform. All rights reserved.</p>
            <p className="mt-2">
              <strong>Disclaimer:</strong> This platform is for informational purposes only and should not replace professional medical advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
    </LocationProvider>
  );
}