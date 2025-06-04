import Book from "../Model/Book.js";
import Review from "../Model/Review.js";

// Add a new book
export const addBook = async (req, res) => {
  try {
    const { title, author, genre } = req.body;
    const newBook = new Book({ title, author, genre });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all books with pagination and optional filters
export const getBooks = async (req, res) => {
  const { page = 1, limit = 10, author, genre } = req.query;
  const query = {};
  if (author) query.author = author;
  if (genre) query.genre = genre;

  try {
    const books = await Book.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("reviews");
    const total = await Book.countDocuments(query);
    res.status(200).json({ total, page, books });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get book details by ID
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("reviews");
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Calculate average rating
    const reviews = await Review.find({ book: book._id });
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((acc, review) => acc + review.rating, 0) /
          reviews.length
        : 0;

    res.status(200).json({ ...book.toObject(), averageRating, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit a review
export const submitReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = new Review({
      book: req.params.id,
      user: req.user.id,
      rating,
      comment,
    });
    await review.save();

    // Update book's reviews array
    await Book.findByIdAndUpdate(req.params.id, {
      $push: { reviews: review._id },
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review || review.user !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this review" });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review || review.user !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this review" });
    }

    await Review.findByIdAndDelete(req.params.id);
    await Book.findByIdAndUpdate(review.book, {
      $pull: { reviews: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
