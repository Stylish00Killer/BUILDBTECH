
from flask import Flask, render_template, redirect, url_for, request, flash, session
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os

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

        if password != confirm_password:
            flash('Passwords do not match')
            return render_template('register.html')

        user_exists = User.query.filter_by(username=username).first()
        if user_exists:
            flash('Username already exists')
            return render_template('register.html')

        # Hash the password before storing
        hashed_password = generate_password_hash(password)
        new_user = User(username=username, password=hashed_password)
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

# Add new routes for dashboard features
@app.route('/lab-reports')
@login_required
def lab_reports():
    return render_template('features/lab_reports.html')

@app.route('/project-ideas')
@login_required
def project_ideas():
    return render_template('features/project_ideas.html')

@app.route('/exam-prep')
@login_required
def exam_prep():
    return render_template('features/exam_prep.html')

@app.route('/schedule')
@login_required
def schedule():
    return render_template('features/schedule.html')

@app.route('/progress')
@login_required
def progress():
    return render_template('features/progress.html')

@app.route('/study-groups')
@login_required
def study_groups():
    return render_template('features/study_groups.html')

if __name__ == '__main__':
    with app.app_context():
        db.drop_all()  # First drop all tables to ensure clean state
        db.create_all()  # Then create all tables based on models
    app.run(debug=True, host='0.0.0.0', port=5000)
