
import os
import sys
import subprocess
import shutil
import zipfile
from datetime import datetime

print("BUILDBTECH App - Executable Builder")
print("==================================")

# Make sure required packages are installed
required_packages = [
    'pyinstaller',
    'flask',
    'flask-login', 
    'flask-sqlalchemy',
    'werkzeug',
    'requests'
]

print("Installing required packages...")
for package in required_packages:
    subprocess.run([sys.executable, "-m", "pip", "install", package])

print("Creating build directory...")
build_dir = "build_exe"
if os.path.exists(build_dir):
    shutil.rmtree(build_dir)
os.makedirs(build_dir)

# Copy all required files
print("Copying application files...")
files_to_copy = [
    'app.py',
    'start_app.py'
]

for file in files_to_copy:
    shutil.copy(file, build_dir)

# Copy templates and static folders
shutil.copytree('templates', os.path.join(build_dir, 'templates'))
if os.path.exists('static'):
    shutil.copytree('static', os.path.join(build_dir, 'static'))

# Create a basic launcher script
launcher_script = """
import subprocess
import os
import sys
import webbrowser
import time
import threading

def open_browser():
    time.sleep(2)  # Wait for server to start
    webbrowser.open('http://localhost:5000')

print("Starting BUILDBTECH App...")
print("Opening application in your default browser...")

# Start browser in a separate thread
browser_thread = threading.Thread(target=open_browser)
browser_thread.daemon = True
browser_thread.start()

# Run the Flask application
app_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "app.py")
subprocess.run([sys.executable, app_path])
"""

launcher_path = os.path.join(build_dir, "launch_buildbtech.py")
with open(launcher_path, 'w') as f:
    f.write(launcher_script)

print("Creating executable with PyInstaller...")
os.chdir(build_dir)
subprocess.run([
    "pyinstaller",
    "--name=BUILDBTECH_App",
    "--onefile",
    "--windowed",
    "--add-data=templates;templates",
    "--add-data=static;static" if os.path.exists('static') else "",
    "launch_buildbtech.py"
])

print("Creating offline data package...")
# Create placeholder for offline data
offline_dir = "offline_data"
if not os.path.exists(offline_dir):
    os.makedirs(offline_dir)

# Create basic offline data structure
for folder in ['lab_templates', 'project_ideas', 'study_materials', 'resume_templates']:
    os.makedirs(os.path.join(offline_dir, folder), exist_ok=True)

# Add some sample offline data
with open(os.path.join(offline_dir, 'lab_templates', 'physics_template.txt'), 'w') as f:
    f.write("Physics Lab Report Template\n\nExperiment Title: [Title]\n\nObjective: [Objective]\n\nApparatus: [List apparatus]\n\nTheory: [Theoretical background]\n\nProcedure: [Step-by-step procedure]\n\nObservations: [Record observations]\n\nCalculations: [Show calculations]\n\nResults: [Present results]\n\nConclusion: [Write conclusion]")

with open(os.path.join(offline_dir, 'project_ideas', 'web_development.txt'), 'w') as f:
    f.write("Web Development Project Ideas\n\n1. Portfolio Website\n2. E-commerce Store\n3. Social Media Dashboard\n4. Learning Management System\n5. Weather Application")

# Create a zip file of offline data
zip_path = os.path.join("dist", "offline_data.zip")
with zipfile.ZipFile(zip_path, 'w') as zipf:
    for root, dirs, files in os.walk(offline_dir):
        for file in files:
            zipf.write(os.path.join(root, file), os.path.relpath(os.path.join(root, file), offline_dir))

print("Build completed successfully!")
print(f"Executable is located at: {os.path.abspath(os.path.join('dist', 'BUILDBTECH_App.exe'))}")
