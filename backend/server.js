const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/v98b_questions', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Question Schema
const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  donation: {
    type: Number,
    required: true,
    min: 0.01
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
    }
  }
});

// Index for automatic cleanup after 24 hours
questionSchema.index({ "expiresAt": 1 }, { expireAfterSeconds: 0 });

const Question = mongoose.model('Question', questionSchema);

// Routes

// Get all questions (sorted by creation date, most recent first)
app.get('/api/questions', async (req, res) => {
  try {
    const questions = await Question.find()
      .sort({ createdAt: -1 })
      .select('_id question email donation createdAt')
      .limit(10000);
    
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit a new question
app.post('/api/questions', async (req, res) => {
  try {
    const { question, email, donation } = req.body;

    // Validation
    if (!question || !email || !donation) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (question.trim().length === 0) {
      return res.status(400).json({ error: 'Question cannot be empty' });
    }

    if (question.length > 1000) {
      return res.status(400).json({ error: 'Question is too long (max 1000 characters)' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const donationAmount = parseFloat(donation);
    if (isNaN(donationAmount) || donationAmount < 0.01) {
      return res.status(400).json({ error: 'Invalid donation amount' });
    }

    // Check if we're at the 10,000 question limit
    const questionCount = await Question.countDocuments();
    if (questionCount >= 10000) {
      // Delete the oldest question to make room
      await Question.findOneAndDelete({}, { sort: { createdAt: 1 } });
    }

    // Create new question
    const newQuestion = new Question({
      question: question.trim(),
      email: email.trim().toLowerCase(),
      donation: donationAmount
    });

    await newQuestion.save();

    res.status(201).json({
      message: 'Question submitted successfully',
      question: {
        _id: newQuestion._id,
        question: newQuestion.question,
        donation: newQuestion.donation,
        createdAt: newQuestion.createdAt
      }
    });

  } catch (error) {
    console.error('Error submitting question:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get question statistics
app.get('/api/stats', async (req, res) => {
  try {
    const totalQuestions = await Question.countDocuments();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const questionsToday = await Question.countDocuments({
      createdAt: { $gte: todayStart }
    });

    const totalDonations = await Question.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$donation' }
        }
      }
    ]);

    res.json({
      totalQuestions,
      questionsToday,
      totalDonations: totalDonations[0]?.total || 0
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cleanup task - runs every hour to remove expired questions and maintain limit
cron.schedule('0 * * * *', async () => {
  try {
    console.log('Running cleanup task...');
    
    // Remove expired questions (older than 24 hours)
    const expiredCount = await Question.deleteMany({
      createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });
    
    if (expiredCount.deletedCount > 0) {
      console.log(`Removed ${expiredCount.deletedCount} expired questions`);
    }

    // Check if we exceed the 10,000 limit and remove oldest if needed
    const totalCount = await Question.countDocuments();
    if (totalCount > 10000) {
      const excessCount = totalCount - 10000;
      const oldestQuestions = await Question.find()
        .sort({ createdAt: 1 })
        .limit(excessCount);
      
      const idsToDelete = oldestQuestions.map(q => q._id);
      await Question.deleteMany({ _id: { $in: idsToDelete } });
      console.log(`Removed ${excessCount} excess questions to maintain 10,000 limit`);
    }
    
  } catch (error) {
    console.error('Error during cleanup task:', error);
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;