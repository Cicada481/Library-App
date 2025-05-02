from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from models import db, ma, Member, Book, Borrow
from schemas import MemberSchema, BookSchema, BorrowSchema
from sqlalchemy import text

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///library.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
ma.init_app(app)

with app.app_context():
    db.create_all()

member_schema = MemberSchema()
book_schema = BookSchema()
borrow_schema = BorrowSchema()

# Member endpoints
@app.route('/member', methods=['POST'])
def add_member():
    data = request.json
    new_member = Member(**data)
    with db.session.begin(): # Transaction
        db.session.add(new_member)
    return jsonify(member_schema.dump(new_member)), 201

@app.route('/members', methods=['GET'])
def get_members():
    members = Member.query.all()
    return jsonify(member_schema.dump(members, many=True))

@app.route('/member/<name>', methods=['GET'])
def get_member(name):
    member = Member.query.get_or_404(name)
    return jsonify(member_schema.dump(member))

@app.route('/member/<name>', methods=['PUT'])
def update_member(name):
    data = request.json

    with db.session.begin(): # Transaction
        member = Member.query.get_or_404(name)
        if 'email' in data:
            member.email = data['email']
        if 'age' in data:
            member.age = data['age']
            
    return jsonify(member_schema.dump(member))

@app.route('/member/<name>', methods=['DELETE'])
def delete_member(name):
    with db.session.begin():
        member = Member.query.get_or_404(name)
        db.session.delete(member)
    return jsonify({"message": "Member deleted successfully"})

# Book endpoints
@app.route('/book', methods=['POST'])
def add_book():
    data = request.json
    new_book = Book(**data)
    with db.session.begin(): # Transaction
        db.session.add(new_book)
    return jsonify(book_schema.dump(new_book)), 201

@app.route('/books', methods=['GET'])
def get_books():
    books = Book.query.all()
    return jsonify(book_schema.dump(books, many=True))

@app.route('/book/<title>/<author>', methods=['GET'])
def get_book(title, author):
    book = Book.query.get_or_404((title, author))
    return jsonify(book_schema.dump(book))

@app.route('/book/<title>/<author>', methods=['PUT'])
def update_book(title, author):
    data = request.json

    with db.session.begin(): # Transaction
        book = Book.query.get_or_404((title, author))
        if 'year_published' in data:
            book.year_published = data['year_published']
        if 'num_pages' in data:
            book.num_pages = data['num_pages']
        if 'num_copies' in data:
            book.num_copies = data['num_copies']
    
    return jsonify(book_schema.dump(book))

@app.route('/book/<title>/<author>', methods=['DELETE'])
def delete_book(title, author):
    with db.session.begin(): # Transaction
        book = Book.query.get_or_404((title, author))
        db.session.delete(book)
    
    return jsonify({"message": "Book deleted successfully"})

# Borrow endpoints
@app.route('/borrow', methods=['POST'])
def add_borrow():
    data = request.json
    # Check if member exists
    member = Member.query.get(data['name'])
    if not member:
        return jsonify({"error": "Member not found"}), 404
    
    # Check if book exists and has available copies
    book = Book.query.get((data['title'], data['author']))
    if not book:
        return jsonify({"error": "Book not found"}), 404
    if book.num_copies <= 0:
        return jsonify({"error": "No copies available"}), 400
    
    # Check if the specified user has already borrowed the specified book
    borrow = Borrow.query.get((data['name'], data['title'], data['author']))
    if borrow:
        return jsonify({"error": "Book already borrowed"}), 400

    # Create borrow record
    new_borrow = Borrow(**data)

    with db.session.begin(): # Transaction lock
        # Decrease book copies
        book.num_copies -= 1
        db.session.add(new_borrow)
    return jsonify(borrow_schema.dump(new_borrow)), 201

@app.route('/borrows', methods=['GET'])
def get_borrows():
    borrows = Borrow.query.all()
    return jsonify(borrow_schema.dump(borrows, many=True))

@app.route('/borrow/<name>/<title>/<author>', methods=['DELETE'])
def return_book(name, title, author):
    borrow = Borrow.query.get_or_404((name, title, author))
    
    # Increase book copies
    with db.session.begin(): # Transaction lock
        book = Book.query.get((title, author))
        if book:
            book.num_copies += 1
        db.session.delete(borrow)
    return jsonify({"message": "Book returned successfully"})

# Member report endpoint
@app.route('/member-report/<name>', methods=['GET'])
def get_member_report(name):
    try:
        # Prepared statement to get member details
        member_query = text("""
            SELECT name, email, age 
            FROM member 
            WHERE name = :name
        """)
        
        member_result = db.session.execute(member_query, {"name": name}).fetchone()
        
        if not member_result:
            return jsonify({"error": "Member not found"}), 404
        
        # Prepared statement to get all books borrowed by the member with complete details
        books_query = text("""
            SELECT 
                bk.title, 
                bk.author,
                bk.year_published, 
                bk.num_pages,
                bk.num_copies
            FROM borrow b
            JOIN book bk ON b.title = bk.title AND b.author = bk.author 
            WHERE b.name = :name
        """)
        
        books_result = db.session.execute(books_query, {"name": name}).fetchall()

                # Prepare the response
        borrowed_books = book_schema.dump(books_result, many=True)
        
        # Prepared statement to calculate statistics
        stats_query = text("""
            SELECT 
                COUNT(b.title) as books_borrowed,
                AVG(bk.num_pages) as avg_book_length,
                AVG(bk.year_published) as avg_book_year
            FROM borrow b
            JOIN book bk ON b.title = bk.title AND b.author = bk.author
            WHERE b.name = :name
        """)
        
        stats_result = db.session.execute(stats_query, {"name": name}).fetchone()
        
        # Format the response with both sections
        response = {
            "member_details": member_schema.dump(member_result),
            "statistics": {
                "books_borrowed": stats_result.books_borrowed if stats_result.books_borrowed else 0,
                "avg_book_length": round(stats_result.avg_book_length, 1) if stats_result.avg_book_length else None,
                "avg_book_year": round(stats_result.avg_book_year, 1) if stats_result.avg_book_year else None
            },
            "borrowed_books": borrowed_books
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5001)
