const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const mongoose = require('mongoose');

dotenv.config({ path: './.env.local' });


const app = express();
const businessRoutes = require('./routes/business'); // ✅ Import business routes

const allowedOrigins = [
    "http://localhost:3000",
    "https://dynamicfd.vercel.app",
   
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`❌ CORS Blocked: ${origin}`);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

app.use(express.json());

// MongoDB Atlas connection
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
    console.error('❌ MongoDB URI not found. Check your .env file.');
    process.exit(1);
}

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas successfully!'))
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    });

// ✅ Use business routes
app.use('/api/business', businessRoutes);

app.get("/", (req, res) => {
    res.send("Backend is running on Vercel!");
  });

  
// Health Check Route
app.get("/health", (req, res) => {
    res.status(200).send("Healthy");
  });
  
  // Self-Ping Mechanism to Keep Server Active
// Self-Ping Mechanism to Keep Server Active
const SELF_URL = "https://dynamicfdbackend.onrender.com/"; // Replace with your deployed backend URL

setInterval(() => {
  axios
    .get(SELF_URL)
    .then(() => console.log("Self-ping successful!"))
    .catch((err) => console.error("Self-ping failed:", err.message));
}, 1800000); // 30 minutes (1,800,000 ms)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
