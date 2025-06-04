import express from 'express';
import {
    addBook,
    getBooks,
    getBookById,
    submitReview,
    updateReview,
    deleteReview
} from '../Controller/book.controller.js';
import authentication from '../Middleware/auth.js';
import { upload } from '../Middleware/upload.js';

const router = express.Router();

router.post('/books',upload.single("image"), authentication, addBook);
router.get('/books', getBooks);
router.get('/books/:id', getBookById);
router.post('/books/:id/reviews', authentication, submitReview);
router.put('/reviews/:id', authentication, updateReview);
router.delete('/reviews/:id', authentication, deleteReview);

export default router;
