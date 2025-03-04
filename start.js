const { exec } = require('child_process');
const http = require('http');
const open = require('open');

console.log('Welcome to BUILDBTECH App!');

function checkNpm() {
  return new Promise((resolve, reject) => {
    exec('npm --version', (error) => {
      if (error) {
        console.error('\x1b[31m%s\x1b[0m', 'Error: Node.js and npm are required but not installed.');
        console.error('\x1b[36m%s\x1b[0m', 'Please install Node.js from https://nodejs.org');
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

function installDependencies() {
  console.log('\x1b[33m%s\x1b[0m', 'Installing dependencies...');
  return new Promise((resolve, reject) => {
    exec('npm install', (error, stdout) => {
      if (error) {
        console.error('\x1b[31m%s\x1b[0m', 'Failed to install dependencies:', error.message);
        reject(error);
      } else {
        console.log(stdout);
        resolve();
      }
    });
  });
}

function waitForServer(port) {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      http.get(`http://localhost:${port}`, (res) => {
        clearInterval(interval);
        resolve();
      }).on('error', () => {});
    }, 1000);
  });
}

function startServer() {
  console.log('\x1b[33m%s\x1b[0m', 'Starting development server...');
  const server = exec('npx vite --port 5000 --host 0.0.0.0');

  server.stdout.on('data', (data) => console.log(data));
  server.stderr.on('data', (data) => console.error('\x1b[31m%s\x1b[0m', data));

  server.on('close', (code) => {
    if (code !== 0) {
      console.error('\x1b[31m%s\x1b[0m', 'Server stopped unexpectedly');
      process.exit(1);
    }
  });

  return waitForServer(5000);
}

async function main() {
  try {
    await checkNpm();
    await installDependencies();
    await startServer();

    console.log('\x1b[32m%s\x1b[0m', 'Opening browser...');
    await open('http://localhost:5000');

    console.log('\x1b[32m%s\x1b[0m', '\nApplication is ready!');
    console.log('\x1b[36m%s\x1b[0m', 'Press Ctrl+C to stop the server');
  } catch (error) {
    console.error('\n\x1b[31m%s\x1b[0m', 'Error:', error.message);
    console.log('\n\x1b[33m%s\x1b[0m', 'Press any key to exit...');
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
  }
}

main();