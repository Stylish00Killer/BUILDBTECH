
#!/usr/bin/env python3

import subprocess
import webbrowser
import os
import time
import sys
import threading
from pathlib import Path

def open_browser():
    """Open the browser after a short delay to ensure server is running."""
    time.sleep(2)
    webbrowser.open('http://localhost:5000')

def check_dependencies():
    """Check if required dependencies are installed."""
    required_packages = ['flask', 'flask-login', 'flask-sqlalchemy', 'werkzeug', 'requests']
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print("Installing missing dependencies...")
        for package in missing_packages:
            subprocess.run([sys.executable, "-m", "pip", "install", package], check=True)

def create_offline_data_dirs():
    """Create directories for offline data storage."""
    offline_dirs = [
        'offline_data',
        'offline_data/lab_templates',
        'offline_data/project_ideas',
        'offline_data/exam_materials',
        'offline_data/resume_templates'
    ]
    
    for directory in offline_dirs:
        Path(directory).mkdir(parents=True, exist_ok=True)

def main():
    print("Starting BUILDBTECH App...")
    
    # Check and install dependencies
    check_dependencies()
    
    # Create offline data directories
    create_offline_data_dirs()
    
    # Start browser in background
    browser_thread = threading.Thread(target=open_browser)
    browser_thread.daemon = True
    browser_thread.start()
    
    # Run the Flask application
    app_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "app.py")
    subprocess.run([sys.executable, app_path])

if __name__ == "__main__":
    main()
