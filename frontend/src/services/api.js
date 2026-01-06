import axios from 'axios';

const API_Base = 'http://localhost:5000'; // Changed to root since routes include prefixes now

const api = {
    // Vision Routes
    analyzeObject: async (formData) => {
        const res = await axios.post(`${API_Base}/vision/object`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data; // { summary, objects, text, raw }
    },
    analyzeText: async (formData) => {
        const res = await axios.post(`${API_Base}/vision/text`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    },
    analyzeScene: async (formData) => {
        const res = await axios.post(`${API_Base}/vision/scene`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    },

    // Speech Token
    getSpeechToken: async () => {
        const response = await axios.get(`${API_Base}/speech/token`);
        return response.data; // { token, region }
    },

    // Chat with Groq
    chatWithGroq: async (text) => {
        const response = await axios.post(`${API_Base}/chat`, { text });
        return response.data.summary; // Return cleaned summary text
    }
};

export default api;
