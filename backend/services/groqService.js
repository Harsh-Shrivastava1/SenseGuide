const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateResponse = async (userText, context = "general") => {
    try {
        let systemPrompt = "You are SenseGuide, a calm and clear voice assistant for people with low vision. Speak slowly, clearly, and give helpful real-world guidance. Keep responses short (under 2 sentences) and safe.";

        if (context === 'scene') systemPrompt += " The user has just asked to describe a scene.";
        if (context === 'object') systemPrompt += " The user asks what object is in front of them.";
        if (context === 'text') systemPrompt += " The user wants you to read text.";

        // Using 'llama-3.3-70b-versatile' as it is stable and fast
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userText }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            max_tokens: 150,
        });

        return completion.choices[0]?.message?.content || "I'm not sure what to say.";

    } catch (error) {
        // Detailed logging
        console.error("Groq Service Error:", error);
        if (error.error?.message) console.error("Message:", error.error.message);

        return "I am having trouble connecting to my brain right now.";
    }
};

module.exports = { generateResponse };
