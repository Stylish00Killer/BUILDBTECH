
from flask import Flask, render_template, redirect, url_for, request, flash, session, jsonify
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os
import requests
import json
from datetime import datetime
import sqlite3
import time

# API Keys
EDEN_AI_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzg2ZWY4ODEtMjlmNy00NzY0LWJkOWYtNTVmM2JiMmUzZTQ1IiwidHlwZSI6ImFwaV90b2tlbiJ9.lV7anQ5LLaBekAmABdQwPLI4RbbqWrwAZBTOfxVDGU8'
DEEPSEEK_API_KEY = 'sk-be3b678f12dd41e1994ee3af6e958fea'
DEEPAI_API_KEY = 'ebeb9893-4b08-4447-9ab8-be6ec29d18e0'
HUGGINGFACE_API_KEY = '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'
RESTACK_API_KEY = '7c5c531ec63297b9b03278ecfd3a7618759c0ba7acabd8326833a159a93582bc'
GOOGLE_TTS_API_KEY = '6d3f04acf06dfa6503aee8686ccbd23045d42414'

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24).hex()
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///buildbtech.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)
    email = db.Column(db.String(100), nullable=True)
    role = db.Column(db.String(20), default='student')  # 'student', 'teacher', 'admin'
    profile_completed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    
    # Relationships
    lab_reports = db.relationship('LabReport', backref='author', lazy=True)
    projects = db.relationship('Project', backref='owner', lazy=True)
    study_plans = db.relationship('StudyPlan', backref='user', lazy=True)
    expenses = db.relationship('Expense', backref='user', lazy=True)
    events = db.relationship('Event', backref='participants', lazy=True)
    notes = db.relationship('Note', backref='author', lazy=True)
    
    def is_admin(self):
        return self.role == 'admin'
        
    def is_teacher(self):
        return self.role == 'teacher' or self.role == 'admin'

class LabReport(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    course = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(50), default='draft')

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(50), default='planning')
    tech_stack = db.Column(db.String(200))
    
class StudyPlan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    
class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    date = db.Column(db.DateTime, default=db.func.current_timestamp())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    location = db.Column(db.String(200), nullable=True)
    event_type = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    subject = db.Column(db.String(100), nullable=False)
    
class StudyGroup(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    course = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class Marketplace(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(50), default='available')

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/')
@login_required
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))

    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            login_user(user)
            next_page = request.args.get('next')
            return redirect(next_page or url_for('index'))
        else:
            flash('Invalid username or password')

    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))

    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        role = request.form.get('role', 'student')

        # Only admins can create teachers
        if role == 'teacher' and (not current_user.is_authenticated or not current_user.is_admin()):
            role = 'student'
            flash('Only admins can create teacher accounts')

        if password != confirm_password:
            flash('Passwords do not match')
            return render_template('register.html')

        user_exists = User.query.filter_by(username=username).first()
        if user_exists:
            flash('Username already exists')
            return render_template('register.html')

        # Hash the password before storing
        hashed_password = generate_password_hash(password)
        new_user = User(username=username, password=hashed_password, role=role)
        db.session.add(new_user)
        db.session.commit()

        flash('Registration successful, please login')
        return redirect(url_for('login'))

    return render_template('register.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

# Academic & Project Assistance Routes
@app.route('/lab-reports')
@login_required
def lab_reports():
    reports = LabReport.query.filter_by(user_id=current_user.id).all()
    return render_template('features/lab_reports.html', reports=reports)

@app.route('/lab-reports/new', methods=['GET', 'POST'])
@login_required
def new_lab_report():
    if request.method == 'POST':
        title = request.form.get('title')
        content = request.form.get('content')
        course = request.form.get('course')
        
        new_report = LabReport(
            title=title,
            content=content,
            course=course,
            user_id=current_user.id
        )
        
        db.session.add(new_report)
        db.session.commit()
        flash('Lab report created successfully!')
        return redirect(url_for('lab_reports'))
        
    return render_template('features/new_lab_report.html')

@app.route('/project-ideas')
@login_required
def project_ideas():
    projects = Project.query.filter_by(user_id=current_user.id).all()
    return render_template('features/project_ideas.html', projects=projects)

@app.route('/project-ideas/new', methods=['GET', 'POST'])
@login_required
def new_project():
    if request.method == 'POST':
        title = request.form.get('title')
        description = request.form.get('description')
        category = request.form.get('category')
        tech_stack = request.form.get('tech_stack')
        
        new_project = Project(
            title=title,
            description=description,
            category=category,
            tech_stack=tech_stack,
            user_id=current_user.id
        )
        
        db.session.add(new_project)
        db.session.commit()
        flash('Project idea created successfully!')
        return redirect(url_for('project_ideas'))
        
    return render_template('features/new_project.html')

@app.route('/exam-prep')
@login_required
def exam_prep():
    return render_template('features/exam_prep.html')

@app.route('/exam-prep/generate', methods=['POST'])
@login_required
def generate_exam_material():
    subject = request.form.get('subject')
    topic = request.form.get('topic')
    material_type = request.form.get('material_type')
    
    # Here we would integrate with AI API to generate materials
    # For now, return a simple response
    generated_material = f"Sample {material_type} for {subject} - {topic}"
    
    return render_template('features/exam_prep_result.html', material=generated_material)

# Student Life Management Routes
@app.route('/schedule')
@login_required
def schedule():
    study_plans = StudyPlan.query.filter_by(user_id=current_user.id).all()
    return render_template('features/schedule.html', plans=study_plans)

@app.route('/schedule/new', methods=['GET', 'POST'])
@login_required
def new_schedule():
    if request.method == 'POST':
        title = request.form.get('title')
        description = request.form.get('description')
        start_date = request.form.get('start_date')
        end_date = request.form.get('end_date')
        
        new_plan = StudyPlan(
            title=title,
            description=description,
            start_date=start_date,
            end_date=end_date,
            user_id=current_user.id
        )
        
        db.session.add(new_plan)
        db.session.commit()
        flash('Study plan created successfully!')
        return redirect(url_for('schedule'))
        
    return render_template('features/new_schedule.html')

@app.route('/progress')
@login_required
def progress():
    # Calculate progress stats
    total_reports = LabReport.query.filter_by(user_id=current_user.id).count()
    total_projects = Project.query.filter_by(user_id=current_user.id).count()
    total_plans = StudyPlan.query.filter_by(user_id=current_user.id).count()
    
    stats = {
        'reports': total_reports,
        'projects': total_projects,
        'plans': total_plans,
    }
    
    return render_template('features/progress.html', stats=stats)

@app.route('/study-groups')
@login_required
def study_groups():
    groups = StudyGroup.query.filter_by(user_id=current_user.id).all()
    return render_template('features/study_groups.html', groups=groups)

@app.route('/study-groups/new', methods=['GET', 'POST'])
@login_required
def new_study_group():
    if request.method == 'POST':
        name = request.form.get('name')
        description = request.form.get('description')
        course = request.form.get('course')
        
        new_group = StudyGroup(
            name=name,
            description=description,
            course=course,
            user_id=current_user.id
        )
        
        db.session.add(new_group)
        db.session.commit()
        flash('Study group created successfully!')
        return redirect(url_for('study_groups'))
        
    return render_template('features/new_study_group.html')

# Career & Finance Support Routes
@app.route('/resume-builder')
@login_required
def resume_builder():
    return render_template('features/resume_builder.html')

@app.route('/mock-interview')
@login_required
def mock_interview():
    return render_template('features/mock_interview.html')

@app.route('/expense-tracker')
@login_required
def expense_tracker():
    expenses = Expense.query.filter_by(user_id=current_user.id).all()
    total = sum(expense.amount for expense in expenses)
    return render_template('features/expense_tracker.html', expenses=expenses, total=total)

@app.route('/expense-tracker/new', methods=['GET', 'POST'])
@login_required
def new_expense():
    if request.method == 'POST':
        amount = request.form.get('amount')
        description = request.form.get('description')
        category = request.form.get('category')
        
        new_expense = Expense(
            amount=float(amount),
            description=description,
            category=category,
            user_id=current_user.id
        )
        
        db.session.add(new_expense)
        db.session.commit()
        flash('Expense added successfully!')
        return redirect(url_for('expense_tracker'))
        
    return render_template('features/new_expense.html')

# Additional Features
@app.route('/marketplace')
@login_required
def marketplace():
    items = Marketplace.query.filter(Marketplace.user_id != current_user.id, Marketplace.status == 'available').all()
    my_items = Marketplace.query.filter_by(user_id=current_user.id).all()
    return render_template('features/marketplace.html', items=items, my_items=my_items)

@app.route('/marketplace/new', methods=['GET', 'POST'])
@login_required
def new_marketplace_item():
    if request.method == 'POST':
        title = request.form.get('title')
        description = request.form.get('description')
        price = request.form.get('price')
        category = request.form.get('category')
        
        new_item = Marketplace(
            title=title,
            description=description,
            price=float(price),
            category=category,
            user_id=current_user.id
        )
        
        db.session.add(new_item)
        db.session.commit()
        flash('Item listed successfully!')
        return redirect(url_for('marketplace'))
        
    return render_template('features/new_marketplace_item.html')

@app.route('/notes')
@login_required
def notes():
    notes = Note.query.filter_by(user_id=current_user.id).all()
    return render_template('features/notes.html', notes=notes)

@app.route('/notes/new', methods=['GET', 'POST'])
@login_required
def new_note():
    if request.method == 'POST':
        title = request.form.get('title')
        content = request.form.get('content')
        subject = request.form.get('subject')
        
        new_note = Note(
            title=title,
            content=content,
            subject=subject,
            user_id=current_user.id
        )
        
        db.session.add(new_note)
        db.session.commit()
        flash('Note created successfully!')
        return redirect(url_for('notes'))
        
    return render_template('features/new_note.html')

@app.route('/events')
@login_required
def events():
    events = Event.query.all()
    return render_template('features/events.html', events=events)

@app.route('/profile')
@login_required
def profile():
    return render_template('features/profile.html')

@app.route('/admin')
@login_required
def admin_panel():
    if not current_user.is_admin():
        flash('Access denied: Admin privileges required')
        return redirect(url_for('index'))
    
    users = User.query.all()
    return render_template('features/admin_panel.html', users=users)

@app.route('/admin/user/<int:user_id>', methods=['POST'])
@login_required
def update_user_role(user_id):
    if not current_user.is_admin():
        flash('Access denied: Admin privileges required')
        return redirect(url_for('index'))
    
    user = User.query.get_or_404(user_id)
    new_role = request.form.get('role')
    
    if new_role in ['student', 'teacher', 'admin']:
        user.role = new_role
        db.session.commit()
        flash(f'User {user.username} role updated to {new_role}')
    
    return redirect(url_for('admin_panel'))

@app.route('/teacher')
@login_required
def teacher_panel():
    if not current_user.is_teacher():
        flash('Access denied: Teacher privileges required')
        return redirect(url_for('index'))
    
    students = User.query.filter_by(role='student').all()
    return render_template('features/teacher_panel.html', students=students)

@app.route('/profile/update', methods=['POST'])
@login_required
def update_profile():
    email = request.form.get('email')
    current_user.email = email
    current_user.profile_completed = True
    db.session.commit()
    flash('Profile updated successfully!')
    return redirect(url_for('profile'))
    
@app.route('/license')
def license():
    try:
        with open('LICENSE.md', 'r') as file:
            license_content = file.read()
        return render_template('license.html', license_content=license_content)
    except FileNotFoundError:
        return "License file not found.", 404

# AI Service Integration Functions
def generate_lab_report(experiment_title, observations, course):
    # Eden AI text generation API
    url = "https://api.edenai.run/v2/text/generation"
    
    payload = {
        "providers": "openai",
        "text": f"Generate a detailed lab report for an experiment titled '{experiment_title}' in the course '{course}' based on these observations: {observations}.",
        "max_tokens": 1000,
        "temperature": 0.7
    }
    
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "authorization": f"Bearer {EDEN_AI_API_KEY}"
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        if response.status_code == 200:
            result = response.json()
            generated_text = result['openai']['generated_text']
            return generated_text
        else:
            # Fallback for offline
            return f"Lab Report: {experiment_title}\n\nObservations: {observations}\n\nConclusion: Analysis will be generated when online."
    except:
        # Offline fallback
        return f"Lab Report: {experiment_title}\n\nObservations: {observations}\n\nConclusion: Analysis will be generated when online."

def generate_project_ideas(tech_area, skill_level):
    # DeepSeek AI API
    url = "https://api.deepseek.com/v1/completions"
    
    payload = {
        "model": "deepseek-coder",
        "prompt": f"Generate 5 project ideas for a {skill_level} level student interested in {tech_area}. For each idea, provide a title, short description, and key technologies to use.",
        "max_tokens": 800,
        "temperature": 0.7
    }
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        if response.status_code == 200:
            result = response.json()
            return result['choices'][0]['text']
        else:
            # Fallback for offline
            return f"Project Ideas for {tech_area} (Offline Mode):\n\n1. Portfolio Website\n2. Task Management App\n3. Data Visualization Tool\n4. E-commerce Platform\n5. Social Media Dashboard"
    except:
        # Offline fallback
        return f"Project Ideas for {tech_area} (Offline Mode):\n\n1. Portfolio Website\n2. Task Management App\n3. Data Visualization Tool\n4. E-commerce Platform\n5. Social Media Dashboard"

def generate_exam_material(subject, topic, material_type):
    # HuggingFace API
    url = f"https://api-inference.huggingface.co/models/facebook/bart-large"
    
    if material_type == 'questions':
        prompt = f"Generate 10 practice questions with answers for {subject} on the topic of {topic}."
    elif material_type == 'summary':
        prompt = f"Provide a comprehensive summary of {topic} in {subject}."
    else:
        prompt = f"Create study notes for {topic} in {subject}."
    
    payload = {"inputs": prompt}
    headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        if response.status_code == 200:
            result = response.json()
            return result[0]['generated_text']
        else:
            # Fallback for offline
            return f"Study Material for {subject} - {topic} (Offline Mode)\n\nThis content will be generated when you're back online."
    except:
        # Offline fallback
        return f"Study Material for {subject} - {topic} (Offline Mode)\n\nThis content will be generated when you're back online."

def generate_interview_questions(job_title, experience_level):
    # Restack API
    url = "https://api.restack.io/v1/ai/generate"
    
    payload = {
        "prompt": f"Generate 5 technical interview questions for a {job_title} position at {experience_level} level. Include answers.",
        "model": "gpt-3.5-turbo"
    }
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {RESTACK_API_KEY}"
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        if response.status_code == 200:
            result = response.json()
            return result['data']['content']
        else:
            # Fallback for offline
            return f"Interview Questions for {job_title} (Offline Mode)\n\n1. Tell me about your experience with relevant technologies.\n2. How do you approach problem-solving?\n3. Describe a challenging project you worked on."
    except:
        # Offline fallback
        return f"Interview Questions for {job_title} (Offline Mode)\n\n1. Tell me about your experience with relevant technologies.\n2. How do you approach problem-solving?\n3. Describe a challenging project you worked on."

# AI API Routes
@app.route('/api/generate-lab-report', methods=['POST'])
@login_required
def api_generate_lab_report():
    data = request.get_json()
    title = data.get('title')
    observations = data.get('observations')
    course = data.get('course')
    
    generated_report = generate_lab_report(title, observations, course)
    
    return jsonify({
        'success': True,
        'report': generated_report
    })

@app.route('/api/generate-project-ideas', methods=['POST'])
@login_required
def api_generate_project_ideas():
    data = request.get_json()
    tech_area = data.get('tech_area')
    skill_level = data.get('skill_level')
    
    ideas = generate_project_ideas(tech_area, skill_level)
    
    return jsonify({
        'success': True,
        'ideas': ideas
    })

@app.route('/api/generate-exam-material', methods=['POST'])
@login_required
def api_generate_exam_material():
    data = request.get_json()
    subject = data.get('subject')
    topic = data.get('topic')
    material_type = data.get('material_type')
    
    material = generate_exam_material(subject, topic, material_type)
    
    return jsonify({
        'success': True,
        'material': material
    })

@app.route('/api/generate-interview-questions', methods=['POST'])
@login_required
def api_generate_interview_questions():
    data = request.get_json()
    job_title = data.get('job_title')
    experience_level = data.get('experience_level')
    
    questions = generate_interview_questions(job_title, experience_level)
    
    return jsonify({
        'success': True,
        'questions': questions
    })

@app.route('/api/search-marketplace', methods=['GET'])
@login_required
def api_search_marketplace():
    query = request.args.get('query', '')
    category = request.args.get('category', '')
    
    # Database search
    items_query = Marketplace.query.filter(
        Marketplace.status == 'available',
        Marketplace.user_id != current_user.id
    )
    
    if query:
        items_query = items_query.filter(
            Marketplace.title.like(f'%{query}%') | 
            Marketplace.description.like(f'%{query}%')
        )
    
    if category:
        items_query = items_query.filter(Marketplace.category == category)
    
    items = items_query.all()
    
    # Format results
    results = []
    for item in items:
        seller = User.query.get(item.user_id)
        results.append({
            'id': item.id,
            'title': item.title,
            'description': item.description,
            'price': item.price,
            'category': item.category,
            'seller': seller.username if seller else 'Unknown',
            'created_at': item.created_at.strftime('%Y-%m-%d')
        })
    
    return jsonify({
        'success': True,
        'items': results
    })

@app.route('/create-initial-user', methods=['GET'])
def create_initial_user():
    if User.query.count() == 0:
        hashed_password = generate_password_hash('admin123')
        admin_user = User(username='admin', password=hashed_password)
        db.session.add(admin_user)
        db.session.commit()
        return 'Initial admin user created with username: admin and password: admin123'
    return 'Users already exist'

# Helper functions for permission handling
def check_delete_permission(item, user):
    """Check if a user has permission to delete an item"""
    # Admin can delete anything
    if user.is_admin():
        return True
    
    # Teachers can delete their own content and student content
    if user.is_teacher():
        if hasattr(item, 'user_id'):
            item_owner = User.query.get(item.user_id)
            return item.user_id == user.id or (item_owner and item_owner.role == 'student')
    
    # Students can only delete their own content
    return hasattr(item, 'user_id') and item.user_id == user.id

# Routes for handling content deletion with permission check
@app.route('/lab-reports/delete/<int:report_id>', methods=['POST'])
@login_required
def delete_lab_report(report_id):
    report = LabReport.query.get_or_404(report_id)
    
    if check_delete_permission(report, current_user):
        db.session.delete(report)
        db.session.commit()
        flash('Lab report deleted successfully')
    else:
        flash('You do not have permission to delete this report')
        
    return redirect(url_for('lab_reports'))

@app.route('/project-ideas/delete/<int:project_id>', methods=['POST'])
@login_required
def delete_project(project_id):
    project = Project.query.get_or_404(project_id)
    
    if check_delete_permission(project, current_user):
        db.session.delete(project)
        db.session.commit()
        flash('Project deleted successfully')
    else:
        flash('You do not have permission to delete this project')
        
    return redirect(url_for('project_ideas'))

if __name__ == '__main__':
    with app.app_context():
        db.drop_all()  # First drop all tables to ensure clean state
        db.create_all()  # Then create all tables based on models
        
        # Create an initial admin and teacher user if none exists
        if User.query.count() == 0:
            hashed_password = generate_password_hash('admin123')
            admin_user = User(username='admin', password=hashed_password, role='admin')
            teacher_user = User(username='teacher', password=hashed_password, role='teacher')
            db.session.add(admin_user)
            db.session.add(teacher_user)
            db.session.commit()
            
    app.run(debug=True, host='0.0.0.0', port=5000)
