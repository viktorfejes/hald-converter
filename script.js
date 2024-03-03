/**
 * Author: Viktor Fejes
 * Date: 2024-03-03
 * Description: This file contains the JavaScript code for the online LUT conversion tool.
 * Version: 1.1.4
 */

const upload = document.getElementById("hald-upload");
const btnConvert = document.getElementById("btn-convert");
const btnWrapper = document.getElementById("btn-na-wrapper");
const btnHald = document.getElementById("btn-hald");
const uploadInfo = document.getElementById("upload-info");
const progressBar = document.getElementsByClassName("progressbar")[0];

upload.addEventListener('change', function () {
    const file = this.files[0];
    const fileName = this.files[0].name;
    const fileNameRoot = this.files[0].name.split(".")[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            progressBar.style.width = "0%";
            uploadInfo.classList.remove("error");
            uploadInfo.innerHTML = `Uploading: ${fileName}`;
            const img = new Image();

            img.onload = function () {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");

                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                const acceptableSize = 512 * 512 * 4;
                if (data.length !== acceptableSize || canvas.width !== 512 || canvas.height !== 512) {
                    uploadInfo.innerHTML = `❌ Invalid size: ${fileName}`;
                    uploadInfo.classList.add("error");
                    btnConvert.style.filter = "blur(4px)";
                    btnConvert.style.pointerEvents = "none";
                    btnWrapper.style.cursor = "not-allowed";
                    return;
                }

                const header = generateHeaderString(fileNameRoot);
                const chunkSize = 100000;

                // Callback function to handle the cube data
                function handleCubeData(cubeData) {
                    uploadInfo.innerHTML = `✔ Uploaded: ${fileName}`;
                    btnConvert.style.filter = "blur(0)";
                    btnConvert.style.pointerEvents = "auto";
                    btnWrapper.style.cursor = "pointer";

                    btnConvert.addEventListener('click', function () {
                        const link = document.createElement('a');
                        link.download = "test.cube";
                        const blob = new Blob([header + cubeData], { type: "text/plain" });
                        link.href = URL.createObjectURL(blob);
                        link.click();
                        link.remove();
                    });
                }

                processDataChunks(data, progressBar, chunkSize, handleCubeData);
            };
            img.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }
});

function processDataChunks(data, progressBar, chunkSize, callback) {
    let i = 0;
    let cubeDataArray = [];

    function processChunk() {
        const end = Math.min(i + chunkSize, data.length);
        for (; i < end; i += 4) {
            const R = (data[i] / 255).toFixed(6);
            const G = (data[i + 1] / 255).toFixed(6);
            const B = (data[i + 2] / 255).toFixed(6);

            cubeDataArray.push(`${R} ${G} ${B}\n`);
        }

        progressBar.style.width = `${(i / data.length) * 100}%`;

        if (i < data.length) {
            requestAnimationFrame(processChunk);
        }
        else {
            callback(cubeDataArray.join(""));
        }
    }
    processChunk();
}

function generateHeaderString(fileNameRoot) {
    return `#Created by: Our Conversion Website
#Tool Author: Viktor Fejes
#Website: https://google.com
TITLE "${fileNameRoot}"

#LUT size
LUT_3D_SIZE 64

#data domain
DOMAIN_MIN 0.0 0.0 0.0
DOMAIN_MAX 1.0 1.0 1.0

#LUT data points
`;
}

// Trigger file input using div
const uploadDiv = document.getElementById("upload-trigger");
const uploadInput = document.getElementById("hald-upload");

uploadDiv.addEventListener('click', function () {
    uploadInput.click();
});