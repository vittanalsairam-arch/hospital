const { spawn } = require('child_process');
const path = require('path');

console.log('======================================================');
console.log('🚀 Starting MediOP Application (Backend + Frontend)...');
console.log('======================================================');

// 1. Start Backend Server
const backend = spawn('node', ['server.js'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

backend.on('error', (err) => {
  console.error('Backend process error:', err);
});

// 2. Start Frontend Dev Server
const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

const frontend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'inherit',
  shell: true
});

frontend.on('error', (err) => {
  console.error('Frontend process error:', err);
});

// 3. Open Browser after 3 seconds
setTimeout(() => {
  const openCmd = isWindows ? 'start http://localhost:8080' : 'open http://localhost:8080';
  spawn(openCmd, { shell: true });
}, 3000);

process.on('SIGINT', () => {
  console.log('\nShutting down MediOP servers...');
  backend.kill();
  frontend.kill();
  process.exit();
});
