import cv2
import pytesseract
import numpy as np
from PIL import Image
import os

# Tesseract language mapping (ISO 639-2 to Tesseract codes)
LANGUAGE_MAP = {
    'en': 'eng',
    'fr': 'fra',
    'es': 'spa',
    'de': 'deu'
}

def process_image(image_path, language='en'):
    """
    Process an image file to extract text using Tesseract OCR
    Args:
        image_path: Path to the image file
        language: Language code for OCR (default: English)
    Returns:
        Dictionary containing:
        - extracted_text: The extracted text
        - processing_time: Time taken for processing
        - word_count: Number of words extracted
        - confidence: Average confidence score
    """
    try:
        # Preprocess image
        img = cv2.imread(image_path)
        img = preprocess_image(img)
        
        # Convert to PIL image for pytesseract
        pil_img = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        
        # Get Tesseract language code
        tess_lang = LANGUAGE_MAP.get(language, 'eng')
        
        # Perform OCR
        data = pytesseract.image_to_data(
            pil_img,
            lang=tess_lang,
            output_type=pytesseract.Output.DICT
        )
        
        # Process results
        extracted_text = ' '.join([text for text, conf in zip(data['text'], data['conf']) if int(conf) > 60])
        word_count = len(extracted_text.split())
        confidence = np.mean([float(conf) for conf in data['conf'] if float(conf) > 0])
        
        return {
            'status': 'success',
            'extracted_text': extracted_text,
            'processing_time': 'N/A',
            'word_count': word_count,
            'confidence': round(confidence, 2),
            'language': language
        }
        
    except Exception as e:
        return {
            'status': 'error',
            'message': f"An error occurred during image processing: {str(e)}"
        }

def preprocess_image(img):
    """
    Preprocess image for better OCR results
    Args:
        img: Input image as numpy array
    Returns:
        Processed image as numpy array
    """
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Denoising
    denoised = cv2.fastNlMeansDenoising(gray, None, 10, 7, 21)
    
    # Thresholding
    _, thresholded = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    
    # Morphological operations
    kernel = np.ones((1, 1), np.uint8)
    processed = cv2.morphologyEx(thresholded, cv2.MORPH_CLOSE, kernel)
    
    return processed
