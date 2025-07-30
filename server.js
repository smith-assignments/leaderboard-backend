/**
 * server.js
 * Entry point for the Leaderboard API.
 * Responsibilities:
 * - Connect to MongoDB
 * - Register middleware & routes
 * - Optionally seed initial users (idempotent)
 * - Expose REST endpoints under /api/users
 *
 * Env:
 * - PORT
 * - MONGO_URI
 * - CLIENT_ORIGIN (for CORS in production)
 */


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const { seedInitialUsers } = require('./seed/seedUsers');

const app = express();

// CORS: Allow all in dev; in prod set CLIENT_ORIGIN to your Netlify URL
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    // Seed only if users collection is empty
    await seedInitialUsers();

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
})
.catch((err) => console.error('DB connection error:', err));

// Note: connection is awaited before starting the HTTP server to avoid 500s on cold start.



