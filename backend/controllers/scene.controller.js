const { analyzeImage } = require('../services/azureVision');
const { generateResponse } = require('../services/groqService');

exports.analyzeScene = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image uploaded" });
        }

        console.log("Processing Scene Request...");
        const analysis = await analyzeImage(req.file.buffer, 'scene');

        const description = analysis.description?.captions?.[0]?.text || "a complex scene";
        const tags = analysis.description?.tags?.slice(0, 5).join(", ") || "";

        const userPrompt = `The scene contains: ${description}. Tags: ${tags}. Describe this environment to me so I can visualize it.`;
        const friendlyResponse = await generateResponse(userPrompt, 'scene');

        res.json({
            summary: friendlyResponse,
            objects: [], // Scene analysis might not give objects list directly in v3.2 'Description' mode without 'Objects' feature
            text: "",
            raw: analysis
        });

    } catch (error) {
        console.error("Scene Controller Error:", error);
        res.status(500).json({ message: "Failed to analyze scene", error: error.message });
    }
};
