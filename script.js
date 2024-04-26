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

ekUpload();  // Initialize the upload functionality

// Global model variable
let model, maxPredictions;

// Function to load the model
async function loadModel() {
    const modelURL = 'model.json';  // Ensure path is correct
    model = await tmImage.loadModel(modelURL);
    maxPredictions = model.getTotalClasses();
    console.log('Model loaded');
}

window.onload = loadModel;  // Ensure model is loaded on page load

// Function to handle image upload and run prediction
async function handleImageUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
        const image = new Image();
        image.onload = async () => {
            if (model) {
                await predict(image);
            } else {
                console.error('Model not loaded');
            }
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
