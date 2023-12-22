// server.js

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const connectMongo = require('connect-mongo');

const app = express();
const MongoStore = connectMongo(session);

// MongoDB connection
mongoose.connect('mongodb://localhost/nba-player-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Passport configuration
passport.use(new GoogleStrategy(/* Google OAuth configuration here */));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Express middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Set up routes (to be added later)

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});// models/player.js

const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  team: { type: String, required: true },
  jerseyNumber: { type: Number, required: true },
  position: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Player', playerSchema);// models/comment.js

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Comment', commentSchema);