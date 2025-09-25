/**
 * Vite Plugin for YUVA API Server
 * Automatically starts the Python API server when Vite starts
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let apiProcess = null;

export default function vitePluginAPI() {
  return {
    name: 'yuva-api-server',
    configureServer(server) {
      // Start API server when Vite starts
      server.middlewares.use('/api', (req, res, next) => {
        // Proxy API requests to Python server
        if (req.url.startsWith('/api/')) {
          const apiUrl = `http://localhost:5000${req.url.replace('/api', '')}`;
          // Forward request to Python server
          next();
        } else {
          next();
        }
      });

      // Start Python API server
      const startAPIServer = () => {
        if (apiProcess) {
          console.log('🔄 API server already running');
          return;
        }

        console.log('🚀 Starting YUVA API Server...');
        apiProcess = spawn('python', ['simple_api.py'], {
          stdio: 'pipe',
          cwd: process.cwd()
        });

        apiProcess.stdout.on('data', (data) => {
          console.log(`[API] ${data.toString().trim()}`);
        });

        apiProcess.stderr.on('data', (data) => {
          console.error(`[API Error] ${data.toString().trim()}`);
        });

        apiProcess.on('close', (code) => {
          console.log(`[API] Server stopped with code ${code}`);
          apiProcess = null;
        });

        apiProcess.on('error', (error) => {
          console.error(`[API] Failed to start: ${error.message}`);
          apiProcess = null;
        });
      };

      // Start API server after a short delay
      setTimeout(startAPIServer, 1000);

      // Cleanup on server close
      server.httpServer?.on('close', () => {
        if (apiProcess) {
          console.log('🛑 Stopping API server...');
          apiProcess.kill('SIGTERM');
          apiProcess = null;
        }
      });
    }
  };
}
