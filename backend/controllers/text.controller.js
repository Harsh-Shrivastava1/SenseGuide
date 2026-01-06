const { analyzeImage } = require('../services/azureVision');
const { generateResponse } = require('../services/groqService');

exports.analyzeText = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image uploaded" });
        }

        console.log("Processing Text Request...");
        const analysis = await analyzeImage(req.file.buffer, 'text');

        // OCR JSON parsing might vary by version (v3.2)
        // Structure: regions -> lines -> words
        let gatheredText = "";
        if (analysis.regions) {
            gatheredText = analysis.regions.map(region =>
                region.lines.map(line =>
                    line.words.map(w => w.text).join(" ")
                ).join("\n")
            ).join("\n\n");
        }

        if (!gatheredText.trim()) gatheredText = "No readable text found.";

        const userPrompt = `Read this text for me: "${gatheredText}". If it's long, summarize it. If it's short, read it directly.`;
        const friendlyResponse = await generateResponse(userPrompt, 'text');

        res.json({
            summary: friendlyResponse,
            objects: [],
            text: gatheredText,
            raw: analysis
        });

    } catch (error) {
        console.error("Text Controller Error:", error);
        res.status(500).json({ message: "Failed to read text", error: error.message });
    }
};
