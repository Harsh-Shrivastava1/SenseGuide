const { getSpeechToken } = require('../services/azureSpeech');
const { generateResponse } = require('../services/groqService');

exports.getToken = async (req, res) => {
    try {
        const tokenData = await getSpeechToken();
        res.json(tokenData);
    } catch (error) {
        res.status(500).json({ message: "Failed to get speech token" });
    }
};

exports.analyzeAudio = async (req, res) => {
    // Thisendpoint is likely used if we were sending audio blob to backend.
    // However, plan is to use Frontend SDK for STT.
    // Instead, this might be a "Chat" endpoint where text comes in, and Audio comes out?
    // Requirement: "Send transcribed text ... to Groq".
    // So this endpoint should take TEXT, run Groq.

    // We already have `groqService`.

    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Text required" });

    try {
        const reply = await generateResponse(text);
        res.json({ summary: reply, text: reply });
    } catch (error) {
        res.status(500).json({ message: "Chat failed" });
    }
};
