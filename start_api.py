#!/usr/bin/env python3
"""
YUVA API Server Starter
A wrapper script that ensures the API server starts properly
"""

import subprocess
import sys
import time
import os
import signal
import threading
from pathlib import Path

def check_python():
    """Check if Python is available"""
    try:
        result = subprocess.run([sys.executable, '--version'], 
                              capture_output=True, text=True, timeout=5)
        if result.returncode == 0:
            print(f"✓ Python found: {result.stdout.strip()}")
            return True
    except Exception as e:
        print(f"❌ Python check failed: {e}")
    return False

def check_dependencies():
    """Check if required Python packages are available"""
    required_packages = ['urllib', 'json', 'http.server']
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print(f"❌ Missing required packages: {', '.join(missing_packages)}")
        return False
    
    print("✓ All required packages available")
    return True

def start_api_server():
    """Start the API server"""
    try:
        # Check if simple_api.py exists
        if not os.path.exists('simple_api.py'):
            print("❌ simple_api.py not found in current directory")
            return False
        
        print("🚀 Starting YUVA API Server...")
        print("📍 API will be available at: http://localhost:5000")
        print("🔄 Press Ctrl+C to stop the server")
        print("-" * 50)
        
        # Start the server
        process = subprocess.Popen([sys.executable, 'simple_api.py'], 
                                 stdout=subprocess.PIPE, 
                                 stderr=subprocess.STDOUT,
                                 universal_newlines=True,
                                 bufsize=1)
        
        # Stream output in real-time
        for line in iter(process.stdout.readline, ''):
            print(line.rstrip())
        
        process.wait()
        return process.returncode == 0
        
    except KeyboardInterrupt:
        print("\n🛑 Stopping API server...")
        if 'process' in locals():
            process.terminate()
        return True
    except Exception as e:
        print(f"❌ Failed to start API server: {e}")
        return False

def main():
    """Main function"""
    print("=" * 50)
    print("🎯 YUVA API Server Starter")
    print("=" * 50)
    
    # Check prerequisites
    if not check_python():
        print("❌ Python is not available or not working properly")
        sys.exit(1)
    
    if not check_dependencies():
        print("❌ Missing required dependencies")
        sys.exit(1)
    
    # Start the server
    success = start_api_server()
    
    if success:
        print("✅ API server stopped gracefully")
    else:
        print("❌ API server encountered an error")
        sys.exit(1)

if __name__ == "__main__":
    main()
