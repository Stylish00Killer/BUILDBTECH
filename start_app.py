import os
import sys
import subprocess
import webbrowser
import time
from pathlib import Path

def main():
    """Start the Flask application"""
    print("Welcome to BUILDBTECH App!")
    
    try:
        print("Starting Flask server...")
        # Using the existing Flask app
        subprocess.run(['python', 'app.py'])
    except KeyboardInterrupt:
        print("\nApplication shutdown requested.")
        sys.exit(0)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
