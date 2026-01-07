import axios from 'axios';

// Create an axios instance with the base URL from environment variables
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

const api = {
    // Vision Routes
    analyzeObject: async (formData) => {
        const res = await apiClient.post('/vision/object', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data; // { summary, objects, text, raw }
    },
    analyzeText: async (formData) => {
        const res = await apiClient.post('/vision/text', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    },
    analyzeScene: async (formData) => {
        const res = await apiClient.post('/vision/scene', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    },

    // Speech Token
    getSpeechToken: async () => {
        const response = await apiClient.get('/speech/token');
        return response.data; // { token, region }
    },

    // Chat with Groq
    chatWithGroq: async (text) => {
        const response = await apiClient.post('/chat', { text });
        return response.data.summary; // Return cleaned summary text
    }
};

export default api;
