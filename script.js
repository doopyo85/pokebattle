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

document.addEventListener("DOMContentLoaded", function() {
    ekUpload();
    document.getElementById('start-button').addEventListener('click', init);
    document.getElementById('predict-button').addEventListener('click', function() {
        const image = document.getElementById('file-image');
        if (image.src) {
            predict(image);
        }
    });
});

let model, labelContainer, maxPredictions;

async function init() {
    const modelURL = './my_model/model.json';
    const metadataURL = './my_model/metadata.json';

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    labelContainer = document.getElementById('label-container');
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement('div'));
    }
    console.log('Model loaded');
}

async function predict(image) {
    if (!model) {
        console.error('Model is not initialized');
        return;
    }

    const prediction = await model.predict(image);
    for (let i = 0; i < maxPredictions; i++) {
        const className = prediction[i].className;
        const probability = prediction[i].probability.toFixed(2);
        const label = labelContainer.childNodes[i];
        label.innerHTML = `${className}: ${probability}`;
    }
}
