const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');


router.post('/create', taskController.createTask);


router.get('/', taskController.getTasks);


router.get('/admin/flagged', taskController.getFlaggedTasks);
router.post('/admin/approve/:id', taskController.approveTask);
router.post('/admin/remove/:id', taskController.removeTask);

module.exports = router;