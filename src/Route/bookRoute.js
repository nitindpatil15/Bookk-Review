import express from 'express';
import {
    addBook,
    getBooks,
    getBookById,
    submitReview,
    updateReview,
    deleteReview
} from '../Controller/book.controller.js';

const router = express.Router();

// Middleware to check authentication (dummy example)
const isAuthenticated = (req, res, next) => {
    // Implement your authentication logic here
    req.user = { id: 'userId' }; // Replace with actual user ID from authentication
    next();
};

// Routes
router.post('/books', isAuthenticated, addBook);
router.get('/books', getBooks);
router.get('/books/:id', getBookById);
router.post('/books/:id/reviews', isAuthenticated, submitReview);
router.put('/reviews/:id', isAuthenticated, updateReview);
router.delete('/reviews/:id', isAuthenticated, deleteReview);

export default router;
