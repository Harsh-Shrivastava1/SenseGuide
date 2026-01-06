const axios = require('axios');
require('dotenv').config();

const SPEECH_KEY = process.env.AZURE_SPEECH_KEY;
const SPEECH_REGION = process.env.AZURE_SPEECH_REGION;

const getSpeechToken = async () => {
    if (!SPEECH_KEY || !SPEECH_REGION) {
        throw new Error("Speech Key or Region missing in backend config");
    }

    const headers = {
        'Ocp-Apim-Subscription-Key': SPEECH_KEY,
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    try {
        const tokenUrl = `https://${SPEECH_REGION}.api.cognitive.microsoft.com/sts/v1.0/issueToken`;
        const response = await axios.post(tokenUrl, null, { headers });
        return { token: response.data, region: SPEECH_REGION };
    } catch (error) {
        console.error("Speech Token Error:", error.response?.data || error.message);
        throw new Error("Failed to get speech token");
    }
};

module.exports = { getSpeechToken };
