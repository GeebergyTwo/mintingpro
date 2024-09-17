const mongoose = require('mongoose');
// Pending Task Schema
const pendingTaskSchema = new mongoose.Schema({
    userID: { type: String, required: true },
    taskID: { type: String, required: true },
    imageSrc: { type: String, required: true },
    description: { type: String, required: true },
    points: { type: Number, required: true }, // Added points field
    status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending' },
    submittedAt: { type: Date, default: Date.now },
  });
  
  // Create PendingTask model
  const PendingTask = mongoose.model('PendingTask', pendingTaskSchema);
  module.exports = PendingTask;