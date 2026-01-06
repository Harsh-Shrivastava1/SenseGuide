const { analyzeImage } = require('../services/azureVision');
const { generateResponse } = require('../services/groqService');

exports.analyzeObject = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image uploaded" });
        }

        console.log("Processing Object Request...");
        const visionFilter = 'object'; // or 'Objects'
        const analysis = await analyzeImage(req.file.buffer, visionFilter);

        // Extract object names
        const objects = analysis.objects?.map(o => o.object).join(", ") || "no specific objects identified";

        // Use Groq to make it friendly
        const userPrompt = `I see: ${objects}. Detailed: ${JSON.stringify(analysis)}. Explain what is in front of me safely.`;
        const friendlyResponse = await generateResponse(userPrompt, 'object');

        res.json({
            summary: friendlyResponse,
            objects: analysis.objects?.map(o => o.object) || [],
            text: "",
            raw: analysis
        });

    } catch (error) {
        console.error("Object Controller Error:", error);
        res.status(500).json({ message: "Failed to analyze object", error: error.message });
    }
};
