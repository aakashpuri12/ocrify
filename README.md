# AI-Powered OCR for Digitizing Handwritten Documents

An application that extracts text from handwritten documents using EasyOCR and provides a modern web interface for uploading documents or capturing them via camera.

## Features

- 📄 Upload images (JPG, PNG) for text extraction
- 📷 Capture documents using device camera
- 🌍 Multiple language support (English, French, Spanish, German)
- ✂️ Copy extracted text to clipboard
- 📊 Processing statistics (word count, confidence score)
- 🎨 Modern responsive UI with light color scheme

## Technologies Used

### Frontend
- HTML5, CSS3, JavaScript
- Bootstrap 5 for responsive design
- Font Awesome for icons
- Webcam API for camera access

### Backend
- Python 3
- Flask for web framework
- EasyOCR for text recognition
- OpenCV for image preprocessing
- Pillow for image handling

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-ocr-project.git
cd ai-ocr-project
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create required directories:
```bash
mkdir -p uploads
```

## Running the Application

1. Start the Flask development server:
```bash
python app.py
```

2. Open your browser and navigate to:
```
http://localhost:5000
```

## Usage

1. **Upload a document**:
   - Click "Choose File" to select an image from your device
   - Supported formats: JPG, PNG

2. **Or capture a document**:
   - Click "Take Picture" to use your device camera
   - Position the document clearly in the camera view
   - Click "Capture" to take the picture

3. **Select language** (default: English)

4. Click "Process Document" to extract text

5. View and copy the extracted text

## Configuration

You can modify the following in `app.py`:
- `MAX_CONTENT_LENGTH`: Maximum file upload size (default: 16MB)
- `ALLOWED_EXTENSIONS`: Supported file types (default: png, jpg, jpeg)
- `UPLOAD_FOLDER`: Where uploaded files are stored (default: 'uploads')

## Production Deployment

For production, consider using:
- Gunicorn as WSGI server
- Nginx as reverse proxy
- Environment variables for configuration

Example Gunicorn command:
```bash
gunicorn --bind 0.0.0.0:5000 app:app
```

## License

MIT License

## Screenshots

![Application Screenshot](/screenshots/screenshot1.png)
![Camera Capture Screenshot](/screenshots/screenshot2.png)