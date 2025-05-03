const { generatePrompt } = require("../services/ai.service");

const getResultController = async (req, res) => {
    try {
        const { prompt } = req.query;
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        const result = await generatePrompt(prompt);
        res.send(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getResultController
};