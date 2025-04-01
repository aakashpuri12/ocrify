document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const fileInput = document.getElementById('fileInput');
    const filePreview = document.getElementById('filePreview');
    const processBtn = document.getElementById('processBtn');
    const languageSelect = document.getElementById('languageSelect');
    const resultContainer = document.getElementById('resultContainer');
    const extractedText = document.getElementById('extractedText');
    const statsText = document.getElementById('statsText');
    const copyBtn = document.getElementById('copyBtn');
    const processingSpinner = document.getElementById('processingSpinner');
    const processText = document.getElementById('processText');

    // Event Listeners
    fileInput.addEventListener('change', handleFileSelect);
    processBtn.addEventListener('click', processDocument);
    copyBtn.addEventListener('click', copyToClipboard);

    // Handle file selection
    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Check file type
        if (!file.type.match('image.*')) {
            showAlert('Please select an image file (JPG, PNG)', 'danger');
            return;
        }

        // Display preview
        const reader = new FileReader();
        reader.onload = function(e) {
            filePreview.innerHTML = `<img src="${e.target.result}" class="img-fluid" alt="Preview">`;
            processBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    }

    // Process document through API
    async function processDocument() {
        const file = fileInput.files[0];
        if (!file) return;

        // Show loading state
        processBtn.disabled = true;
        processingSpinner.classList.remove('d-none');
        processText.textContent = 'Processing...';

        const formData = new FormData();
        formData.append('file', file);
        formData.append('language', languageSelect.value);

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.status === 'success') {
                // Display results
                extractedText.textContent = data.extracted_text;
                statsText.textContent = `Words: ${data.word_count} | Confidence: ${data.confidence}%`;
                resultContainer.style.display = 'block';
                
                // Scroll to results
                resultContainer.scrollIntoView({ behavior: 'smooth' });
            } else {
                showAlert(data.message || 'Error processing document', 'danger');
            }
        } catch (error) {
            showAlert('Failed to connect to server', 'danger');
            console.error('Error:', error);
        } finally {
            // Reset button state
            processBtn.disabled = false;
            processingSpinner.classList.add('d-none');
            processText.textContent = 'Process Document';
        }
    }

    // Copy text to clipboard
    function copyToClipboard() {
        const text = extractedText.textContent;
        navigator.clipboard.writeText(text)
            .then(() => {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check me-2"></i>Copied!';
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    }

    // Show alert message
    function showAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show mt-3`;
        alert.role = 'alert';
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        const cardBody = document.querySelector('.card-body');
        cardBody.insertBefore(alert, cardBody.firstChild);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 150);
        }, 5000);
    }

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});