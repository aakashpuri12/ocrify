document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const cameraBtn = document.getElementById('cameraBtn');
    const cameraModal = new bootstrap.Modal(document.getElementById('cameraModal'));
    const cameraFeed = document.getElementById('cameraFeed');
    const captureBtn = document.getElementById('captureBtn');
    const cameraPreview = document.getElementById('cameraPreview');
    const fileInput = document.getElementById('fileInput');
    const processBtn = document.getElementById('processBtn');

    // Camera stream
    let stream = null;

    // Event Listeners
    cameraBtn.addEventListener('click', startCamera);
    captureBtn.addEventListener('click', captureImage);
    document.getElementById('cameraModal').addEventListener('hidden.bs.modal', stopCamera);

    // Start camera
    async function startCamera() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment', // Prefer rear camera
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            });
            cameraFeed.srcObject = stream;
            cameraModal.show();
        } catch (err) {
            console.error('Camera error:', err);
            alert('Could not access the camera. Please check permissions.');
        }
    }

    // Stop camera
    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            cameraFeed.srcObject = null;
            stream = null;
        }
    }

    // Capture image
    function captureImage() {
        if (!stream) return;

        // Create canvas to capture image
        const canvas = document.createElement('canvas');
        canvas.width = cameraFeed.videoWidth;
        canvas.height = cameraFeed.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(cameraFeed, 0, 0, canvas.width, canvas.height);

        // Convert to blob and create file object
        canvas.toBlob(function(blob) {
            const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
            
            // Create a fake event for the file input
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;
            
            // Display preview
            cameraPreview.innerHTML = `<img src="${URL.createObjectURL(blob)}" class="img-fluid" alt="Camera Capture">`;
            processBtn.disabled = false;
            
            // Close modal
            cameraModal.hide();
        }, 'image/jpeg', 0.9);
    }

    // Handle camera permissions change
    navigator.permissions.query({ name: 'camera' }).then(function(permissionStatus) {
        permissionStatus.onchange = function() {
            if (this.state === 'denied') {
                alert('Camera permission denied. Please enable it in your browser settings.');
                cameraModal.hide();
            }
        };
    });
});