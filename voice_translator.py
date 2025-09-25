#!/usr/bin/env python3
"""
Voice Medical Translator
A standalone voice translation tool for medical conversations
"""

import traceback
import json
import requests
import speech_recognition as sr
import pyttsx3
from deep_translator import GoogleTranslator
import sys
import os

# Add backend directory to path for model access
sys.path.append(os.path.join(os.path.dirname(__file__), "backend"))

class VoiceMedicalTranslator:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.engine = pyttsx3.init()
        self.last_translated = ""
        self.backend_url = "http://localhost:5000"
        
        # Configure TTS
        self.engine.setProperty('rate', 150)  # Speed of speech
        self.engine.setProperty('volume', 0.9)  # Volume level (0.0 to 1.0)
        
        # Available voices
        voices = self.engine.getProperty('voices')
        if voices:
            self.engine.setProperty('voice', voices[0].id)  # Use first available voice

    def speak(self, text):
        """Convert text to speech"""
        if not text:
            return
        try:
            self.engine.say(text)
            self.engine.runAndWait()
        except Exception as e:
            print(f"TTS error: {e}")

    def translate_with_backend(self, text, src_lang, tgt_lang):
        """Try to translate using the YUVA backend API"""
        try:
            response = requests.post(
                f"{self.backend_url}/translate",
                json={
                    "text": text,
                    "src_lang": src_lang,
                    "tgt_lang": tgt_lang
                },
                timeout=5
            )
            if response.status_code == 200:
                data = response.json()
                return data.get("translation", "")
        except Exception as e:
            print(f"Backend translation failed: {e}")
        return ""

    def translate_with_google(self, text, src_lang, tgt_lang):
        """Fallback translation using Google Translate"""
        try:
            translator = GoogleTranslator(source=src_lang, target=tgt_lang)
            return translator.translate(text)
        except Exception as e:
            print(f"Google translation failed: {e}")
        return ""

    def translate_text(self, text, src_lang, tgt_lang):
        """Translate text using available services"""
        if src_lang == tgt_lang:
            return text
            
        # Try backend first
        translation = self.translate_with_backend(text, src_lang, tgt_lang)
        
        # Fallback to Google Translate
        if not translation:
            translation = self.translate_with_google(text, src_lang, tgt_lang)
        
        return translation or f"Translation not available for: {text}"

    def record_and_translate(self, src_lang='en', tgt_lang='es'):
        """Record speech and translate it"""
        print(f"\n🎤 Listening for {src_lang} speech...")
        print("Speak clearly into your microphone (timeout: 5 seconds)")
        
        try:
            with sr.Microphone() as source:
                # Reduce ambient noise
                self.recognizer.adjust_for_ambient_noise(source, duration=0.5)
                print("Listening... (speak now)")
                
                # Listen for audio
                audio = self.recognizer.listen(source, timeout=5, phrase_time_limit=12)

            print("🔍 Recognizing speech...")
            try:
                # Recognize speech using Google
                spoken_text = self.recognizer.recognize_google(audio, language=src_lang)
                print(f"📝 Heard: {spoken_text}")
                
            except sr.UnknownValueError:
                print("❌ Could not understand the audio. Please try again.")
                return
            except sr.RequestError as e:
                print(f"❌ Speech recognition service error: {e}")
                return

            print("🌐 Translating...")
            translated = self.translate_text(spoken_text, src_lang, tgt_lang)
            print(f"📖 Translation: {translated}")
            
            self.last_translated = translated
            
            print("🔊 Speaking translation...")
            self.speak(translated)
            print("✅ Translation complete!")
            
        except sr.WaitTimeoutError:
            print("⏰ No speech detected (timeout). Try again and speak clearly.")
        except OSError as e:
            print(f"❌ Audio device error: {e}")
            print("Make sure a microphone is connected and allowed.")
        except Exception as e:
            print(f"❌ Error: {e}")
            print(traceback.format_exc())

    def replay_translation(self):
        """Replay the last translation"""
        if not self.last_translated:
            print("❌ No translated text available. Record something first.")
            return
        print(f"🔊 Replaying: {self.last_translated}")
        self.speak(self.last_translated)

    def interactive_mode(self):
        """Run in interactive mode"""
        languages = {
            "1": ("en", "English"),
            "2": ("es", "Spanish"), 
            "3": ("fr", "French"),
            "4": ("de", "German"),
            "5": ("it", "Italian"),
            "6": ("pt", "Portuguese"),
            "7": ("ru", "Russian"),
            "8": ("zh", "Chinese"),
            "9": ("ja", "Japanese"),
            "10": ("hi", "Hindi"),
            "11": ("ar", "Arabic")
        }
        
        print("\n" + "="*50)
        print("🎙️  YUVA Voice Medical Translator")
        print("="*50)
        print("Available languages:")
        for key, (code, name) in languages.items():
            print(f"  {key}. {name} ({code})")
        
        try:
            src_choice = input("\nSelect source language (1-11): ").strip()
            tgt_choice = input("Select target language (1-11): ").strip()
            
            if src_choice not in languages or tgt_choice not in languages:
                print("❌ Invalid language selection")
                return
                
            src_lang, src_name = languages[src_choice]
            tgt_lang, tgt_name = languages[tgt_choice]
            
            print(f"\n🔄 Translating from {src_name} to {tgt_name}")
            
            while True:
                print("\nOptions:")
                print("1. Record and translate")
                print("2. Replay last translation")
                print("3. Change languages")
                print("4. Exit")
                
                choice = input("\nSelect option (1-4): ").strip()
                
                if choice == "1":
                    self.record_and_translate(src_lang, tgt_lang)
                elif choice == "2":
                    self.replay_translation()
                elif choice == "3":
                    return self.interactive_mode()  # Restart with new languages
                elif choice == "4":
                    print("👋 Goodbye!")
                    break
                else:
                    print("❌ Invalid option")
                    
        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
        except Exception as e:
            print(f"❌ Error: {e}")

def main():
    """Main function"""
    try:
        translator = VoiceMedicalTranslator()
        
        # Check if backend is running
        try:
            response = requests.get(f"{translator.backend_url}/", timeout=2)
            print("✅ YUVA backend detected - using enhanced translation")
        except:
            print("⚠️  YUVA backend not running - using Google Translate only")
        
        translator.interactive_mode()
        
    except Exception as e:
        print(f"❌ Failed to initialize translator: {e}")
        print("Make sure you have the required packages installed:")
        print("pip install speechrecognition pyttsx3 deep-translator requests")

if __name__ == "__main__":
    main()
