"""
Authentication utilities for BUILDBTECH
"""
from flask_login import LoginManager
from werkzeug.security import generate_password_hash, check_password_hash

def init_login_manager(app, User):
    """Initialize and configure the login manager"""
    login_manager = LoginManager(app)
    login_manager.login_view = 'login'
    
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))
    
    return login_manager

def hash_password(password):
    """Create password hash"""
    return generate_password_hash(password)

def verify_password(hash, password):
    """Verify password against hash"""
    return check_password_hash(hash, password)
