const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    bounty: Number
});

module.exports = mongoose.model('Task', taskSchema);