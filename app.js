const express = require('express');
const mongoose = require('mongoose');
const Task = require('./models/Task');

const app = express();

// middleware
app.use(express.urlencoded({ extended: true }));

// view engine
app.set('view engine', 'ejs');

// DB connect
mongoose.connect('mongodb://127.0.0.1:27017/campus')
    .then(() => console.log("DB connected"))
    .catch(err => console.log(err));

// test route
app.get('/', (req, res) => {
    res.send("Working 🚀");
});

app.listen(3000, () => {
    console.log("Server running on 3000");
});

// show form
app.get('/tasks/new', (req, res) => {
    res.render('new');
});

// create task
app.post('/tasks', async (req, res) => {
    const task = new Task(req.body);
    await task.save();
    res.redirect('/tasks');
});

// show all tasks
app.get('/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.render('index', { tasks });
});