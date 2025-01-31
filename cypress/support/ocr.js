const Tesseract = require('tesseract.js');

const performOCR = (imageSrc) => {
    return new Promise((resolve, reject) => {
        // Use a relative path to reference the worker
        const worker = new Worker('cypress/support/workers/worker.min.js');

        worker.onmessage = (e) => {
            const { data } = e;
            if (data.error) {
                reject(data.error);
            } else {
                resolve(data);
            }
        };

        // Post the image source to the worker
        worker.postMessage({ imagePath: imageSrc });
    });
};

module.exports = { performOCR };