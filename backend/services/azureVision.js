const axios = require('axios');
require('dotenv').config();

const VISION_KEY = process.env.AZURE_VISION_KEY;
const VISION_ENDPOINT = process.env.AZURE_VISION_ENDPOINT;

// Validate config
if (!VISION_KEY || !VISION_ENDPOINT) {
    console.error("CRITICAL: AZURE_VISION_KEY or AZURE_VISION_ENDPOINT missing.");
}

const analyzeImage = async (imageBuffer, type = 'scene') => {
    try {
        let features = '';
        let url = `${VISION_ENDPOINT}/vision/v3.2/analyze`;

        switch (type) {
            case 'scene':
                features = 'Description,Color,Categories';
                break;
            case 'object':
                features = 'Objects';
                break;
            case 'text':
                url = `${VISION_ENDPOINT}/vision/v3.2/ocr`; // Simple OCR
                // For Read API (better text): url = `${VISION_ENDPOINT}/vision/v3.2/read/analyze`;
                // But Read API is async and requires 2 calls. Using basic OCR for simplicity if sufficient.
                // Let's stick to 'analyze' with Description/Objects first.
                // Actually, for "Text", let's use OCR endpoint.
                break;
            default:
                features = 'Description';
        }

        const headers = {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': VISION_KEY
        };

        const params = type === 'text' ? { language: 'unk', detectOrientation: true } : { visualFeatures: features, language: 'en' };

        console.log(`[AzureVision] Sending request to ${url} for ${type}`);

        const response = await axios.post(url, imageBuffer, {
            headers: headers,
            params: params
        });

        console.log(`[AzureVision] Success:`, response.data);
        return response.data;

    } catch (error) {
        console.error("[AzureVision] Error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Vision API Failed");
    }
};

module.exports = { analyzeImage };
