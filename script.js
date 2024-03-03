/**
 * Author: Viktor Fejes
 * Date: 2024-03-03
 * Description: This file contains the JavaScript code for the online LUT conversion tool.
 */

const upload = document.getElementById("hald-upload");
const btnConvert = document.getElementById("btn-convert");
const btnHald = document.getElementById("btn-hald");
const uploadInfo = document.getElementById("upload-info");

upload.addEventListener('change', function () {
    const file = this.files[0];
    const fileName = this.files[0].name;
    const fileNameRoot = this.files[0].name.split(".")[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const img = new Image();

            img.onload = function () {
                const canvas = document.createElement("canvas");
                // const canvas = document.getElementById("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");

                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                let cubeData = generateHeaderString(fileNameRoot);

                for (let i = 0; i < data.length; i += 4) {
                    const R = (data[i] / 255).toFixed(6);
                    const G = (data[i + 1] / 255).toFixed(6);
                    const B = (data[i + 2] / 255).toFixed(6);

                    cubeData += `${R} ${G} ${B}\n`;

                    // Make progress bar wider
                    const progressBar = document.getElementsByClassName("progressbar")[0];
                    progressBar.style.width = `${(i / data.length) * 100}%`;
                }
                uploadInfo.innerHTML = `✔ Uploaded: ${fileName}`;

                btnConvert.addEventListener('click', function () {

                    const link = document.createElement('a');
                    link.download = "test.cube";
                    const blob = new Blob([cubeData], { type: "text/plain" });
                    link.href = URL.createObjectURL(blob);
                    link.click();
                    link.remove();
                })

                // btnHald.addEventListener('click', function () {
                //     const link = document.createElement('a');
                //     link.download = "test.png";
                //     link.href = canvas.toDataURL();
                //     link.click();
                //     link.remove();
                // });
            };
            img.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }
});

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