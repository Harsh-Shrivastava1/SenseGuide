export const CONVERSATION_STATE = {
    IDLE: 'IDLE',
    LISTENING: 'LISTENING',
    PROCESSING: 'PROCESSING',
    SPEAKING: 'SPEAKING'
};

export class AudioConversationController {
    constructor(onStateChange, onTranscriptUpdate) {
        this.state = CONVERSATION_STATE.IDLE;
        this.onStateChange = onStateChange;
        this.onTranscriptUpdate = onTranscriptUpdate;

        // Browser Speech Recognition (Fallback/Primary for mic)
        this.recognition = null;
        this.initRecognition();

        // Browser Speech Synthesis (Fallback)
        this.synthesis = window.speechSynthesis;
        this.currentUtterance = null;
    }

    initRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false; // Stop automatically after speech
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            // Silence Detection Timeout
            this.silenceTimer = null;

            this.recognition.onstart = () => {
                this.setState(CONVERSATION_STATE.LISTENING);
                // Set a timeout to stop if no speech is detected after ~3 seconds
                this.silenceTimer = setTimeout(() => {
                    if (this.state === CONVERSATION_STATE.LISTENING) {
                        this.stopListening();
                    }
                }, 3000);
            };

            this.recognition.onresult = (event) => {
                clearTimeout(this.silenceTimer);
                const text = event.results[0][0].transcript;
                this.onTranscriptUpdate(text);
                this.handleUserQuery(text);
            };

            this.recognition.onend = () => {
                clearTimeout(this.silenceTimer);
                if (this.state === CONVERSATION_STATE.LISTENING) {
                    this.setState(CONVERSATION_STATE.IDLE);
                }
            };

            this.recognition.onerror = (e) => {
                clearTimeout(this.silenceTimer);
                console.error("Speech Error:", e);
                this.setState(CONVERSATION_STATE.IDLE);
            };
        }
    }

    setState(newState) {
        this.state = newState;
        this.onStateChange(newState);
    }

    startConversation() {
        this.speak("I'm listening.", () => {
            this.startListening();
        });
    }

    startListening() {
        if (this.state === CONVERSATION_STATE.SPEAKING) {
            this.interrupt();
        }

        try {
            if (this.recognition) {
                this.recognition.start();
            } else {
                console.error("No speech recognition available");
                this.setState(CONVERSATION_STATE.IDLE);
            }
        } catch (e) {
            // Already started?
            console.warn("Start listening error", e);
        }
    }

    stopListening() {
        if (this.recognition) {
            this.recognition.stop();
        }
        this.setState(CONVERSATION_STATE.IDLE);
    }

    interrupt() {
        if (this.synthesis) {
            this.synthesis.cancel();
        }
        this.startListening();
    }

    async handleUserQuery(text) {
        this.setState(CONVERSATION_STATE.PROCESSING);

        try {
            // Azure OpenAI Logic (Mocked if no key, or fetch implementation)
            const responseText = await this.fetchAIResponse(text);
            this.speak(responseText);
        } catch (error) {
            console.error(error);
            this.speak("Sorry, I couldn't process that.");
        }
    }

    async fetchAIResponse(text) {
        // Enforce max 1 call logic if needed, but handled by state machine (PROCESSING)

        try {
            // Check for Azure Config
            const endpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
            const apiKey = import.meta.env.VITE_AZURE_OPENAI_KEY;
            const deployment = import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT || "gpt-35-turbo"; // Example default

            if (endpoint && apiKey) {
                const response = await fetch(`${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=2024-02-15-preview`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'api-key': apiKey
                    },
                    body: JSON.stringify({
                        messages: [
                            { role: "system", content: "You are a helpful voice assistant for people with low vision. Speak clearly, briefly (max 2 sentences), and calmly." },
                            { role: "user", content: text }
                        ],
                        max_tokens: 80, // Hard limit as requested
                        temperature: 0.7
                    })
                });

                if (!response.ok) {
                    throw new Error(`Azure API Error: ${response.statusText}`);
                }

                const data = await response.json();
                return data.choices[0].message.content;
            }
        } catch (e) {
            console.warn("Azure Fallback:", e);
        }

        // Fallback Mock
        return new Promise(resolve => setTimeout(() => resolve(`I heard "${text}". I am in fallback mode because Azure is not configured.`), 1000));
    }

    speak(text, onEndCallback) {
        this.setState(CONVERSATION_STATE.SPEAKING);

        // Cancel any current speaking
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        this.currentUtterance = utterance;

        // Azure TTS would go here (fetch mp3 -> play audio)
        // Fallback to browser:

        utterance.onend = () => {
            // Return to IDLE or auto-listen? 
            // Request says: "Switch back to listening" IF user speaks again (handled by interrupt)
            // Default behavior: IDLE -> LISTENING -> RESPONDING -> IDLE
            this.setState(CONVERSATION_STATE.IDLE);
            if (onEndCallback) onEndCallback();
        };

        utterance.onerror = () => {
            this.setState(CONVERSATION_STATE.IDLE);
        };

        this.synthesis.speak(utterance);
    }

    toggle() {
        if (this.state === CONVERSATION_STATE.IDLE) {
            this.startConversation();
        } else {
            this.stopListening();
            this.synthesis.cancel();
            this.setState(CONVERSATION_STATE.IDLE);
        }
    }
}
