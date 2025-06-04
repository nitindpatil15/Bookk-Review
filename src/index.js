import { app} from "./app.js";
import connectDb from "./DB/index.js";
import dotenv from 'dotenv';
dotenv.config();
   

// Connect to MongoDB using the `connectDb` function
connectDb()
  .then(() => {
    // Handle server errors
    app.on("error", (error) => {
      console.error("Server Error:", error);
    });
    // Start the server on the specified port
    app.listen(process.env.PORT || 8043, () => {
      console.log(`Server is running at http://localhost:${process.env.PORT || 8043}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection Failed !!!", err);
  });
