const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  link: String,
  post_description: String,
  status: String,
  taskType: String,
  points: {
    type: Number,
    default: 0
  },
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
