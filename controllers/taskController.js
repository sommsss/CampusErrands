const Task = require('../models/Task');
const { quickCheck, aiModerate } = require('../middleware/moderation');

// CREATE TASK
exports.createTask = async (req, res) => {
    try {
        const { title, description, bounty } = req.body;

        const text = `${title || ""} ${description || ""}`;

        // keyword check (this is the main one)
        const quick = quickCheck(text);

        // AI check
        const ai = await aiModerate(text);

        const flags = {
            selfHarm: quick.selfHarm || ai.selfHarm,
            violence: quick.violence || ai.violence,
            abusive: quick.abusive || ai.abusive,
            alcohol: quick.alcohol || ai.alcohol,
            confidence: ai.confidence
        };

        const isFlagged =
            flags.selfHarm ||
            flags.violence ||
            flags.abusive ||
            flags.alcohol;

        const task = new Task({
            title,
            description,
            bounty,
            requester: req.user?._id,
            moderationStatus: isFlagged ? "flagged" : "clean",
            flags
        });

        await task.save();

        // 🔥 THIS IS NEW (frontend message)
        if (isFlagged) {
            return res.redirect('/tasks?flagged=true');
}

res.redirect('/tasks');

    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating task");
    }
};

// GET ALL TASKS (only clean ones)
exports.getTasks = async (req, res) => {
    const tasks = await Task.find({ moderationStatus: "clean" }).populate('requester');
    res.render('tasks', { tasks });
};

// ADMIN: VIEW FLAGGED TASKS
exports.getFlaggedTasks = async (req, res) => {
    const tasks = await Task.find({ moderationStatus: "flagged" });
    res.render('flagged', { tasks });
};

// ADMIN: APPROVE TASK
exports.approveTask = async (req, res) => {
    await Task.findByIdAndUpdate(req.params.id, {
        moderationStatus: "clean"
    });
    res.redirect('/admin/flagged');
};

// ADMIN: REMOVE TASK
exports.removeTask = async (req, res) => {
    await Task.findByIdAndUpdate(req.params.id, {
        moderationStatus: "removed"
    });
    res.redirect('/admin/flagged');
};