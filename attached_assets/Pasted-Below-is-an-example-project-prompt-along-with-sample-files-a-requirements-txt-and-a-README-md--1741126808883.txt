Below is an example project prompt along with sample files (a `requirements.txt` and a `README.md`) that clean up the code and detail how to install dependencies, run the app locally, and build an executable file for Windows.

---

### **Project Prompt**

**Objective:**  
Develop a fully functional version of the BUILDBTECH app. Clean up the code, enforce coding standards, and add comprehensive documentation and unit tests. The app should be deployable via GitHub and runnable on localhost. Additionally, include a process to package the app into an executable file (using PyInstaller) for ease of distribution.

**Requirements:**

- **Code Clean-Up:**  
  - Refactor and organize code into clear modules (e.g., separate the AI logic, API endpoints, and UI components).
  - Follow Python PEP8 guidelines and use linters (e.g., flake8) for consistency.
  - Write unit tests for core functionalities.

- **GitHub Repository:**  
  - Upload the cleaned and documented code to GitHub.
  - Include clear instructions in the README on how to install dependencies, run the app locally, and build an executable.

- **Local Execution:**  
  - Provide a step-by-step process from cloning the repository to running the app on localhost.
  - Offer an option to build an executable file (using PyInstaller) so users can run the app without needing a full Python environment.

- **Documentation:**  
  - Create a `README.md` with sections on Overview, Setup, Installation, Usage, and Build Instructions.
  - Include a `requirements.txt` file listing all necessary Python packages.

---

### **Sample `requirements.txt`**

```plaintext
Flask==2.1.2
tensorflow==2.9.0
numpy==1.22.0
pandas==1.4.0
scikit-learn==1.0.2
gunicorn==20.1.0
pyinstaller==5.1
```

*Note: Adjust package versions as needed for your project.*

---

### **Sample `README.md`**

```markdown
# BUILDBTECH

*Learn. Build. Succeed.*

BUILDBTECH is an AI-powered, all-in-one platform designed to streamline student life for BTech students. It tackles academic challenges—from generating lab reports and project assistance to interactive learning and real-time collaboration. This repository contains the fully functional prototype of BUILDBTECH.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Setup & Installation](#setup--installation)
- [Running on Localhost](#running-on-localhost)
- [Building an Executable](#building-an-executable)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Overview

BUILDBTECH centralizes key academic tasks by providing:
- **AI-Powered Lab Report Generation**  
- **Project Assistance & AI Mentorship**  
- **Interactive Learning Hub**  
- **Career & Finance Support**  
- **Student Life Management Tools**  
- **Engagement & Motivation Features**

## Features

### Academic & Project Assistance
- **AutoLab:** AI-generated lab reports & analysis.
- **BuildIt:** AI-based project idea generator & mentor.
- **ExamAI:** Personalized exam prep & doubt-solving AI.
- **CollabMate:** AI-based team builder for college projects.

### Career & Finance Support
- **Resume Builder:** AI-powered resume creation & analysis.
- **Mock Interview AI:** Job interview simulation & feedback.
- **Scholarship Finder:** AI-based scholarship search.
- **Expense Tracker:** Smart financial management.

### Student Life Management
- **Event Finder:** Discover college events, hackathons & internships.
- **Marketplace:** Buy & sell second-hand college essentials.
- **Notes Organizer:** Store, organize & share study materials.
- **Smart Study Plans:** AI-generated study schedules.
- **Reminders & Timetable:** Manage assignments, exams & deadlines.
- **Time Management Helper:** Optimize study sessions.

### Engagement & Motivation
- **Gamification Elements:** Earn badges & points for achievements.

### Unique Selling Points
- AI-powered assistance for studies & career growth.
- One-stop solution for all student needs.
- Simplifies project building & team collaboration.
- Smart financial tracking for students.
- Boosts motivation with gamification elements.

## Setup & Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/buildbtech.git
   cd buildbtech
   ```

2. **Create a Virtual Environment:**

   - On Windows:
     ```bash
     python -m venv venv
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install Dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

## Running on Localhost

1. **Start the Application:**

   Assuming your main app file is named `app.py`, run:

   ```bash
   python app.py
   ```

2. **Access the App:**

   Open your browser and navigate to [http://localhost:5000](http://localhost:5000).

## Building an Executable

To package the app as a standalone executable (Windows):

1. **Install PyInstaller:**

   ```bash
   pip install pyinstaller
   ```

2. **Build the Executable:**

   ```bash
   pyinstaller --onefile app.py
   ```

3. **Run the Executable:**

   After building, find the executable in the `dist` folder. Run it by double-clicking or via command line:

   ```bash
   dist/app.exe
   ```

## Usage

- After launching the app, follow on-screen instructions for navigating through the various features.
- Use the interactive dashboard to access lab report generation, project assistance, career tools, and more.
- For any issues, please refer to the documentation or contact the development team.

## Contributing

Contributions are welcome! Please follow these steps:
- Fork the repository.
- Create a new branch for your feature or bugfix.
- Submit a pull request with a detailed description of your changes.

## License

No License
```

---

This prompt, along with the `requirements.txt` and `README.md`, should give you a solid foundation to clean up your code, upload your project to GitHub, and provide clear instructions for installation, local execution, and creating an executable file.