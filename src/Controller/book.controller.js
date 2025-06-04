import Book from "../Model/Book.js";
import Review from "../Model/Review.js";
import { uploadOnCloudinary } from "../Utils/cloudinary.js";

const updateAverageRating = async (bookId) => {
  const reviews = await Review.find({ book: bookId });
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  await Book.findByIdAndUpdate(bookId, { averageRating });
};

export const addBook = async (req, res) => {
  try {
    const { title, author, genre } = req.body;
    const filepath = req.file.path
    if(!filepath){
      return res.json(400,"File is Required")
    }
    const uploadfile = await uploadOnCloudinary(filepath)
    if(!uploadfile){
      return res.status(400).json({message:"Failed to upload book image"})
    }
    const newBook = new Book({ title, author, genre , image:uploadfile?.url});
    await newBook.save();
    await updateAverageRating(newBook._id);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

export const getBookById = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query; // Default pagination values

    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Paginate reviews for this book
    const reviews = await Review.find({ book: book._id })
      .populate("user", "name") // optional: populate user info
      .sort({ createdAt: -1 }) // latest first
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalReviews = await Review.countDocuments({ book: book._id });

    // Calculate average rating
    const allReviews = await Review.find({ book: book._id });
    const averageRating =
      allReviews.length > 0
        ? allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length
        : 0;

    res.status(200).json({
      ...book.toObject(),
      averageRating,
      reviews,
      totalReviews,
      currentPage: Number(page),
      totalPages: Math.ceil(totalReviews / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.user.id;
    const bookId = req.params.id;

    // Check if the user has already submitted a review for this book
    const existingReview = await Review.findOne({ book: bookId, user: userId });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already submitted a review for this book.",
      });
    }

    // Create and save new review
    const review = new Review({
      book: bookId,
      user: userId,
      rating,
      comment,
    });
    await review.save();

    // Update book's reviews array
    await Book.findByIdAndUpdate(bookId, {
      $push: { reviews: review._id },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if(!review ){
      return res.status(404).json({message:"Review not found"})
    }
    if (review.user !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can not delete other user reviews" });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    await updateAverageRating(updateReview._id);
    res.status(200).json(updatedReview);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

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
    await updateAverageRating(review._id);
    res.status(200).send("Deleted review Successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
