const Groq = require('groq-sdk');
require('dotenv').config();

const apiKey = process.env.GROQ_API_KEY;
console.log("Testing Groq with Key:", apiKey ? "Loaded (ends with " + apiKey.slice(-4) + ")" : "MISSING");

const groq = new Groq({ apiKey: apiKey });

async function test() {
    try {
        console.log("Sending request to Groq (llama-3.3-70b-versatile)...");
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "user", content: "Say hello" }
            ],
            model: "llama-3.3-70b-versatile",
        });
        console.log("Success:", completion.choices[0]?.message?.content);
    } catch (e) {
        console.error("Groq Failed:", e);
    }
}

test();
