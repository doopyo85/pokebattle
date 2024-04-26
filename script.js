// File Upload
function ekUpload(){
    function Init() {
        console.log("Upload Initialised");

        var fileSelect = document.getElementById('file-upload'),
            fileDrag = document.getElementById('file-drag');

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
        document.getElementById('messages').innerHTML = '<strong>' + encodeURI(file.name) + '</strong>';

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

    if (window.File && window.FileList && window.FileReader) {
        Init();
    } else {
        document.getElementById('file-drag').style.display = 'none';
    }
}
ekUpload();

// Global model variables
let model, maxPredictions;

async function loadModel() {
    model = await tmImage.loadModel('model.json');
    maxPredictions = model.getTotalClasses();
    console.log('Model loaded');
}

window.onload = function() {
    loadModel();
};

async function handleImageUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
        const image = new Image();
        image.onload = async () => {
            await predict(image);
        };
        image.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

async function predict(image) {
    const prediction = await model.predict(image);
    const labelContainer = document.getElementById('label-container');
    labelContainer.innerHTML = '';

    for (let i = 0; i < maxPredictions; i++) {
        const className = prediction[i].className;
        const probability = prediction[i].probability.toFixed(2);
        const label = document.createElement('div');
        label.innerHTML = `${className}: ${probability}`;
        labelContainer.appendChild(label);
    }
}
