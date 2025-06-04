# 📚 Book Review API

A full-featured backend API built with **Node.js** and **Express.js**, allowing users to sign up, log in, manage books, submit reviews, and perform filtered searches. Authentication is handled using **JWT**, and data is stored in a **MongoDB** database.

---

## 🔧 Requirements

- Node.js
- Express.js
- MongoDB (or compatible database)
- JWT for authentication
- Postman (for testing endpoints, optional)

---

## 🚀 Tech Stack

- Backend: **Node.js**, **Express.js**
- Database: **MongoDB** with **Mongoose**
- Authentication: **JWT**
- Pagination & Filtering support

---

## 🔐 Authentication

- `POST /signup` – Register a new user  
- `POST /login` – Authenticate and return a JWT token  

🔑 Token is required for all book/review operations via `Authorization: Bearer <token>`

---

## 📘 Core Features

### 📗 Books

- `POST /books`  
  ➤ Add a new book (Authenticated users only)

- `GET /books`  
  ➤ Get all books with:
  - Pagination (`?page=1&limit=10`)
  - Optional filters (`?author=xyz&genre=fiction`)

- `GET /books/:id`  
  ➤ Get single book details with:
  - Average rating
  - Reviews (paginated)

### 📝 Reviews

- `POST /books/:id/reviews`  
  ➤ Submit a review (Authenticated, one review per user per book)

- `PUT /reviews/:id`  
  ➤ Update your own review

- `DELETE /reviews/:id`  
  ➤ Delete your own review

---

## 🔎 Additional Feature

- `GET /search`  
  ➤ Search books by partial title or author name (case-insensitive)  
  Example: `/search?query=har`

---

## 📁 Folder Structure
├── public/
  ├── temp/  // for temp image uploading
├── src/
  ├── controllers/
  ├── models/
  ├── routes/
  ├── middleware/
  ├── config/
  ├── utils/
  └── index.js
├── .env

1. Clone the repo:
   git clone https://github.com/yourusername/book-review-api.git
   cd book-review-api
   
Install dependencies:
  npm install
  
Set environment variables in .env:

  PORT=5000
  MONGO_URI=your_mongo_connection_string
  JWT_SECRET=your_secret_key
  CLOUDINARY_NAME:tygfgyhg
  API_KEY:API_KEY
  API_SECRETE: API_SECRETE
  
Run the app:
  npm run dev
  
📬 API Testing
Use Postman or any other API client to test endpoints. Ensure to set the Authorization header when accessing protected routes.


🙋‍♂️ Author
Nitin Dagadu Patil
Feel free to reach out via LinkedIn or raise issues and PRs on this repo!

Let me know if you'd like to include:
- Live hosted link
- Example `.env` file
- Screenshots of Postman tests  
I can also auto-generate badges or deploy buttons if you're publishing to platforms like Render or Railway.







