// src/components/BookList.js
import { useState } from 'react';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Stack
} from '@mui/material';
import { deleteBook, updateBook } from '../services/api';

const BookList = ({ books, onBookUpdated, onBookDeleted }) => {
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [currentBook, setCurrentBook] = useState(null);
    const [editedBook, setEditedBook] = useState({
        title: '',
        author: '',
        year_published: '',
        num_pages: '',
        num_copies: ''
    });

    const handleEditClick = (book) => {
        setCurrentBook(book);
        setEditedBook({
            title: book.title,
            author: book.author,
            year_published: book.year_published,
            num_pages: book.num_pages,
            num_copies: book.num_copies
        });
        setEditDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setEditDialogOpen(false);
    };

    const handleSaveEdit = async () => {
        try {
            await updateBook(currentBook.title, currentBook.author, {
                year_published: parseInt(editedBook.year_published),
                num_pages: parseInt(editedBook.num_pages),
                num_copies: parseInt(editedBook.num_copies)
            });
            setEditDialogOpen(false);
            if (onBookUpdated) onBookUpdated();
        } catch (error) {
            console.error('Error updating book:', error);
            alert('Failed to update book');
        }
    };

    const handleDeleteClick = async (title, author) => {
        if (window.confirm(`Are you sure you want to delete "${title}" by ${author}?`)) {
            try {
                await deleteBook(title, author);
                if (onBookDeleted) onBookDeleted();
            } catch (error) {
                console.error('Error deleting book:', error);
                alert('Failed to delete book');
            }
        }
    };

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell>Year Published</TableCell>
                            <TableCell>Pages</TableCell>
                            <TableCell>Copies</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {books.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">No books found</TableCell>
                            </TableRow>
                        ) : (
                            books.map((book) => (
                                <TableRow key={`${book.title}-${book.author}`}>
                                    <TableCell>{book.title}</TableCell>
                                    <TableCell>{book.author}</TableCell>
                                    <TableCell>{book.year_published}</TableCell>
                                    <TableCell>{book.num_pages}</TableCell>
                                    <TableCell>{book.num_copies}</TableCell>
                                    <TableCell>
                                        <Button 
                                            size="small" 
                                            onClick={() => handleEditClick(book)}
                                            sx={{ mr: 1 }}
                                        >
                                            Edit
                                        </Button>
                                        <Button 
                                            size="small" 
                                            color="error" 
                                            onClick={() => handleDeleteClick(book.title, book.author)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Edit Book Dialog */}
            <Dialog open={editDialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Edit Book</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Title"
                            value={currentBook?.title || ''}
                            disabled
                            fullWidth
                        />
                        <TextField
                            label="Author"
                            value={currentBook?.author || ''}
                            disabled
                            fullWidth
                        />
                        <TextField
                            label="Year Published"
                            type="number"
                            value={editedBook.year_published}
                            onChange={(e) => setEditedBook({ ...editedBook, year_published: e.target.value })}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Number of Pages"
                            type="number"
                            value={editedBook.num_pages}
                            onChange={(e) => setEditedBook({ ...editedBook, num_pages: e.target.value })}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Number of Copies"
                            type="number"
                            value={editedBook.num_copies}
                            onChange={(e) => setEditedBook({ ...editedBook, num_copies: e.target.value })}
                            fullWidth
                            required
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSaveEdit} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default BookList;
