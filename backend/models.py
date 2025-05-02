from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

db = SQLAlchemy()
ma = Marshmallow()

class Member(db.Model):
    name = db.Column(db.String(100), primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    age = db.Column(db.Integer, nullable=False)

class Book(db.Model):
    title = db.Column(db.String(200), primary_key=True)
    author = db.Column(db.String(100), primary_key=True)
    year_published = db.Column(db.Integer, nullable=False)
    num_pages = db.Column(db.Integer, nullable=False)
    num_copies = db.Column(db.Integer, nullable=False)

class Borrow(db.Model):
    name = db.Column(db.String(100), db.ForeignKey('member.name'), primary_key=True)
    title = db.Column(db.String(200), primary_key=True)
    author = db.Column(db.String(100), primary_key=True)