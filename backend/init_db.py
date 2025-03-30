import os
from models import db
from app import app

if os.path.exists('library.db'):
    os.remove('library.db')

# Initialize the database
with app.app_context():
    db.create_all()

print("Database setup complete.")