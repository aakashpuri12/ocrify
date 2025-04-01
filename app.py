from flask import Flask, request, jsonify, render_template
import os
from werkzeug.utils import secure_filename
from ocr_processor import process_image
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB limit
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg'}

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/languages', methods=['GET'])
def get_languages():
    # Will implement with EasyOCR language list
    return jsonify({'languages': ['en', 'fr', 'es', 'de']})

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Get language from request (default to English)
        language = request.form.get('language', 'en')
        
        # Process the image
        result = process_image(filepath, language)
        return jsonify(result)
    
    return jsonify({'error': 'Invalid file type'}), 400

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

if __name__ == '__main__':
    app.run(debug=True)
    
# cd ai-ocr-project
# python -m venv venv
# venv\Scripts\activate
# pip install -r requirements.txt
# python app.py

# pip install opencv-python
# pip install easyocr
# pip install flask
# pip install spacy
# pip install numpy
# pip install tensorflow


