import os
import sys
import subprocess
import webbrowser
import time
from pathlib import Path

def check_nodejs():
    try:
        subprocess.run(['node', '--version'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return True
    except FileNotFoundError:
        return False

def install_dependencies():
    print("Installing project dependencies...")
    subprocess.run(['npm', 'install'], check=True)

def start_server():
    print("Starting development server...")
    # Start the Vite dev server
    server_process = subprocess.Popen(
        ['npx', 'vite', '--port', '5000', '--host', '0.0.0.0'],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    
    # Wait for server to start
    time.sleep(3)
    
    # Open browser
    webbrowser.open('http://localhost:5000')
    
    try:
        # Keep the server running until Ctrl+C
        server_process.wait()
    except KeyboardInterrupt:
        server_process.terminate()
        print("\nShutting down server...")

def main():
    # Change to the directory containing the script
    os.chdir(Path(__file__).parent)
    
    print("Welcome to BUILDBTECH App!")
    
    # Check if Node.js is installed
    if not check_nodejs():
        print("Error: Node.js is not installed. Please install Node.js to run this application.")
        sys.exit(1)
    
    try:
        install_dependencies()
        start_server()
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\nApplication shutdown requested.")
        sys.exit(0)

if __name__ == "__main__":
    main()
