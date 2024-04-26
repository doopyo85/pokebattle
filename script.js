// File Upload and Model Prediction Handling

function ekUpload(){
    function init() {
        console.log("Upload Initialised");

        var fileSelect    = document.getElementById('file-upload'),
            fileDrag      = document.getElementById('file-drag');

        fileSelect.addEventListener('change', fileSelectHandler, false);

        var xhr = new XMLHttpRequest();
        if (xhr.upload) {
            fileDrag.addEventListener('dragover', fileDragHover, false);
            fileDrag.addEventListener('dragleave', fileDragHover, false);
            fileDrag.addEventListener('drop', fileSelectHandler, false);
        }
    }

    function fileDragHover(e) {
        var fileDrag = document.getElementById('file-drag');
        e.stopPropagation();
        e.preventDefault();
        fileDrag.className = (e.type === 'dragover' ? 'hover' : 'modal-body file-upload');
    }

    function fileSelectHandler(e) {
        var files = e.target.files || e.dataTransfer.files;
        fileDragHover(e);
        for (var i = 0, f; f = files[i]; i++) {
            parseFile(f);
        }
    }

    function parseFile(file) {
        console.log(file.name);
        var imageName = file.name;
        var isGood = /\.(?=gif|jpg|png|jpeg)/gi.test(imageName);
        if (isGood) {
            var reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('file-image').src = e.target.result;
                document.getElementById('start').classList.add("hidden");
                document.getElementById('response').classList.remove("hidden");
                document.getElementById('notimage').classList.add("hidden");
                document.getElementById('file-image').classList.remove("hidden");
            };
            reader.readAsDataURL(file);
        } else {
            document.getElementById('file-image').classList.add("hidden");
            document.getElementById('notimage').classList.remove("hidden");
            document.getElementById('start').classList.remove("hidden");
            document.getElementById('response').classList.add("hidden");
            document.getElementById("file-upload-form").reset();
        }
    }

    init();
}

ekUpload();

// Global Model Handler
let model, maxPredictions;
async function loadModel() {
    model = await tmImage.loadModel('/my_model/model.json');
    maxPredictions = model.getTotalClasses();
    console.log('Model loaded successfully');
}

// Load model on page load
loadModel();

async function predict(image) {
    if (!model) {
        console.error('Model not loaded');
        return;
    }
    const prediction = await model.predict(image);
    displayPredictions(prediction);
}

function displayPredictions(predictions) {
    const labelContainer = document.getElementById('label-container');
    labelContainer.innerHTML = '';  // Clear previous predictions
    predictions.forEach(prediction => {
        const label = document.createElement('div');
        label.textContent = `${prediction.className}: ${prediction.probability.toFixed(2)}`;
        labelContainer.appendChild(label);
    });
}
