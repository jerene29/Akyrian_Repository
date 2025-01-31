import Tesseract from 'tesseract.js';

self.onmessage = function(e) {
    const { imagePath } = e.data;

    Tesseract.recognize(
        imagePath,
        'eng',
        {
            logger: info => console.log(info) // Log progress
        }
    ).then(result => {
        self.postMessage(result);   
    }).catch(err => {
        self.postMessage({ error: err });
    });
};
