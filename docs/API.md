# API Documentation

The backend provides several endpoints to analyze media. Currently, these endpoints return MOCK data for the MVP.

## Base URL
`http://localhost:5000/api`

## Endpoints

### 1. Object Understanding
- **URL**: `/object/analyze`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Body**: `image` (File)
- **Response**:
  ```json
  {
    "title": "Detected Object",
    "description": "Description of the object...",
    "confidence": "98%",
    "tags": ["tag1", "tag2"]
  }
  ```

### 2. Text Simplification
- **URL**: `/text/analyze`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Body**: `image` (File)
- **Response**:
  ```json
  {
    "originalText": "...",
    "simplifiedText": "...",
    "summary": "..."
  }
  ```

### 3. Scene Explanation
- **URL**: `/scene/analyze`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Body**: `image` (File)
- **Response**:
  ```json
  {
    "description": "...",
    "objects": ["..."],
    "safetyAlert": "..."
  }
  ```

### 4. Audio Interpretation
- **URL**: `/audio/analyze`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Body**: `audio` (File)
- **Response**:
  ```json
  {
    "transcription": "...",
    "interpretation": "...",
    "action": "..."
  }
  ```
