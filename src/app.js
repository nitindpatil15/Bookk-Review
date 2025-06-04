import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Import routers here
import userRoutes from "./Route/userRoute.js";
import bookRoutes from "./Route/bookRoute.js"

const app = express();

// Middleware Configuration
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// ✅ CORS Configuration
const allowedOrigins = [
  "http://localhost:3000",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "auth-token"],
  credentials: true,
};

app.use(cors(corsOptions));

// ✅ Explicitly Allow Headers for All Requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, auth-token"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  // ✅ Handle Preflight Requests (OPTIONS)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

// ✅ API Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/", bookRoutes);

export { app };
