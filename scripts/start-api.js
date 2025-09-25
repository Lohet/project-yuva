#!/usr/bin/env node
/**
 * YUVA API Server Starter (Node.js)
 * Cross-platform solution for starting the Python API server
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class APIServer {
  constructor() {
    this.process = null;
    this.isRunning = false;
  }

  start() {
    return new Promise((resolve, reject) => {
      // Check if Python is available
      const pythonCheck = spawn('python', ['--version'], { stdio: 'pipe' });
      
      pythonCheck.on('error', (error) => {
        reject(new Error(`Python not found: ${error.message}`));
      });

      pythonCheck.on('close', (code) => {
        if (code !== 0) {
          reject(new Error('Python not available'));
          return;
        }

        // Check if simple_api.py exists
        const apiPath = path.join(process.cwd(), 'simple_api.py');
        if (!fs.existsSync(apiPath)) {
          reject(new Error('simple_api.py not found'));
          return;
        }

        console.log('🚀 Starting YUVA API Server...');
        console.log('📍 API will be available at: http://localhost:5000');
        
        // Start the Python API server
        this.process = spawn('python', ['simple_api.py'], {
          stdio: 'inherit',
          cwd: process.cwd()
        });

        this.process.on('error', (error) => {
          reject(new Error(`Failed to start API server: ${error.message}`));
        });

        this.process.on('exit', (code) => {
          this.isRunning = false;
          if (code !== 0) {
            console.log(`❌ API server exited with code ${code}`);
          } else {
            console.log('✅ API server stopped gracefully');
          }
        });

        // Give the server a moment to start
        setTimeout(() => {
          this.isRunning = true;
          resolve();
        }, 2000);
      });
    });
  }

  stop() {
    if (this.process && this.isRunning) {
      console.log('🛑 Stopping API server...');
      this.process.kill('SIGTERM');
      this.isRunning = false;
    }
  }

  isServerRunning() {
    return this.isRunning;
  }
}

// If this script is run directly
if (require.main === module) {
  const apiServer = new APIServer();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down...');
    apiServer.stop();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    apiServer.stop();
    process.exit(0);
  });

  // Start the server
  apiServer.start()
    .then(() => {
      console.log('✅ API server started successfully');
    })
    .catch((error) => {
      console.error('❌ Failed to start API server:', error.message);
      process.exit(1);
    });
}

module.exports = APIServer;
