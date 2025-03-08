# BUILDBTECH

*Learn. Build. Succeed.*

An offline-first desktop application for BTech students with core academic tools and local AI processing capabilities.

## Project Files Structure

```
buildbtech/
├── app.py                    # Main Flask application with routes and models
├── static/
│   ├── css/
│   │   └── style.css        # Main stylesheet (Green theme)
│   ├── js/
│   │   └── app.js          # Client-side JavaScript
│   └── images/
│       └── logo.png        # Application logo
├── templates/
│   ├── base.html           # Base template (Comic Sans MS styling)
│   ├── login.html          # Authentication pages
│   ├── register.html
│   └── features/           # Feature-specific templates
│       ├── lab_reports.html
│       ├── project_ideas.html
│       ├── exam_prep.html
│       ├── schedule.html
│       ├── progress.html
│       ├── study_groups.html
│       ├── marketplace.html
│       ├── notes.html
│       ├── events.html
│       └── expense_tracker.html
├── utils/
│   ├── ai_helpers.py       # AI integration utilities
│   ├── database.py         # Database configuration
│   └── auth.py            # Authentication utilities
└── .env                    # Environment variables configuration
```

## Application Theme

The application uses a warm, student-friendly design:
- Font: Comic Sans MS for a playful, approachable feel
- Colors:
  - Background: #ffefd5 (Papaya Whip)
  - Primary: #427B17 (green)
  - Secondary: #7cfc00 (lawn green)
  - Accent: #ffdab9 (Peach Puff)
  - Text: #ff4500 (Orange Red)

## Features

### Academic & Project Assistance
- **Lab Report Generation:** AI-powered lab report creation and analysis
- **Project Ideas:** Smart project suggestion system with AI mentor
- **Exam Prep:** Personalized study materials and practice tests

### Student Life Management
- **Study Schedule:** Smart timetable organization
- **Progress Tracking:** Academic performance monitoring
- **Study Groups:** Collaborative learning platform
- **Notes Management:** Digital note organization system

### Additional Tools
- **Marketplace:** Buy/sell academic resources
- **Event Calendar:** Track academic events and deadlines
- **Expense Tracker:** Student finance management

## Technical Stack

- **Backend:** Flask web framework
- **Database:** SQLAlchemy ORM
- **Authentication:** Flask-Login
- **AI Integration:** Custom implementation for academic tools
- **Frontend:** HTML, CSS, JavaScript
