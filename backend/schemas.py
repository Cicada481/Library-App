from marshmallow import Schema, fields

class MemberSchema(Schema):
    name = fields.Str(required=True)
    email = fields.Email(required=True)
    age = fields.Int(required=True)

class BookSchema(Schema):
    title = fields.Str(required=True)
    author = fields.Str(required=True)
    year_published = fields.Int(required=True)
    num_pages = fields.Int(required=True)
    num_copies = fields.Int(required=True)

class BorrowSchema(Schema):
    name = fields.Str(required=True)
    title = fields.Str(required=True)
    author = fields.Str(required=True)