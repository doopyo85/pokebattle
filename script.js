// Ensures ekUpload does not conflict with other model declarations
function ekUpload() {
    console.log("Upload Initialized");

    const fileSelect = document.getElementById('file-upload'),
          fileDrag = document.getElementById('file-drag'),
          messages = document.getElementById('messages');

    function fileDragHover(e) {
        e.preventDefault();
        e.stopPropagation();
        fileDrag.className = (e.type === 'dragover' ? 'hover' : 'modal-body file-upload');
    }

    function fileSelectHandler(e) {
        const files = e.target.files || e.dataTransfer.files;
        fileDragHover(e);
        Array.from(files).forEach(parseFile);
    }

    function parseFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('file-image').src = e.target.result;
            messages.innerHTML = `<strong>${encodeURI(file.name)}</strong>`;
            document.getElementById('start').classList.add("hidden");
            document.getElementById('response').classList.remove("hidden");
            document.getElementById('notimage').classList.add("hidden");
            document.getElementById('file-image').classList.remove("hidden");
        };
        reader.readAsDataURL(file);
    }

    fileSelect.addEventListener('change', fileSelectHandler, false);
    fileDrag.addEventListener('dragover', fileDragHover, false);
    fileDrag.addEventListener('dragleave', fileDragHover, false);
    fileDrag.addEventListener('drop', fileSelectHandler, false);
}

// Initialize upload functionality
document.addEventListener("DOMContentLoaded", function() {
    ekUpload();
    document.getElementById('start-button').addEventListener('click', loadModel);
    document.getElementById('predict-button').addEventListener('click', function() {
        const image = document.getElementById('file-image');
        if (image.src) {
            predict(image);
        }
    });
});

// Global model variable
let model;
let maxPredictions;

// Function to load the model
async function loadModel() {
    if (!model) {  // Check if the model has not been initialized yet
        try {
            const modelURL = 'model.json';  // Ensure path is correct
            model = await tmImage.loadmodel(modelURL);  // Updated to use 'loadmodel'
            maxPredictions = model.getTotalClasses();
            console.log('Model loaded');
        } catch (error) {
            console.error("Failed to load model", error);
        }
    }
}

// Function to handle image upload and prediction
async function handleImageUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const image = new Image();
        image.onload = async function() {
            // Predict once the image is fully loaded
            await predict(image);
        };
        image.src = e.target.result;
    };

    reader.readAsDataURL(file);
}

// Function to predict image data using the loaded model
async function predict(image) {
    if (!model) {
        console.error('Model is not initialized');
        return;
    }

    const prediction = await model.predict(image);
    const labelContainer = document.getElementById('label-container');
    labelContainer.innerHTML = '';  // Clear previous predictions

    for (let i = 0; i < maxPredictions; i++) {
        const className = prediction[i].className;
        const probability = prediction[i].probability.toFixed(2);
        const label = document.createElement('div');
        label.innerHTML = `${className}: ${probability}`;
        labelContainer.appendChild(label);
    }
}
