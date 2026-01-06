# SenseGuide

**SenseGuide** is an accessibility-focused AI web platform designed to help users understand objects, text, and surroundings using image and audio analysis. Built for the Microsoft Imagine Cup MVP stage.

## 🚀 Features

- **Object Understanding**: Identify objects from images.
- **Text Simplification**: Extract and simplify text from documents.
- **Scene Explanation**: Get detailed descriptions of your surroundings.
- **Audio Interpretation**: Record audio questions and get AI answers.
- **Accessibility First**: High contrast mode, large text, and screen reader friendly.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express
- **AI Integration**: Microsoft Azure AI (Placeholders ready for integration)
    - Azure OpenAI
    - Azure Computer Vision
    - Azure Speech Services

## 📂 Project Structure

```bash
/senseguide
  /frontend    # React Application
  /backend     # Node.js Express API
  /docs        # Documentation
```

## ⚡ Getting Started

### Prerequisites
- Node.js (v14+)
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd SenseGuide
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm run dev
   # Server runs on http://localhost:5000
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   # Client runs on http://localhost:5173
   ```

## 🔌 API Endpoints (Mocked for MVP)

- `POST /api/object/analyze` - Analyze an image for objects.
- `POST /api/text/analyze` - Extract and simplify text.
- `POST /api/scene/analyze` - Describe a scene.
- `POST /api/audio/analyze` - Interpret audio input.

## 🔮 Future Roadmap

- Integration with real Azure AI services.
- User history and settings persistence.
- Mobile PWA capability.
