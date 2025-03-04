"""
Database configuration for BUILDBTECH
"""
from flask_sqlalchemy import SQLAlchemy
from flask import Flask

def init_db(app: Flask) -> SQLAlchemy:
    """Initialize database with proper configuration"""
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///buildbtech.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db = SQLAlchemy(app)
    return db
