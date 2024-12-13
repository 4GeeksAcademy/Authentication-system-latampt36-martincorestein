from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(250), nullable=False)
    name = db.Column(db.String(80), nullable=True)
    birthdate = db.Column(db.Date, nullable=True)
    country = db.Column(db.String(80), nullable=True)

    def __repr__(self):
        return f'<User {self.email}>'
    
    
    
    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
            "name": self.name,
            "birthdate": self.birthdate.isoformat() if self.birthdate else None,
            "country": self.country,
        }
    
 
    def __init__(self, email, username, password_hash, name=None, birthdate=None, country=None):
        self.email = email
        self.username = username
        self.password_hash = password_hash
        self.name = name
        self.birthdate = birthdate
        self.country = country