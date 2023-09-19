// Set the worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.js';

async function getTextFromPDF(arrayBuffer) {
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';

    for(let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(' ') + '\n';
    }

    return text;
}

function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = event => resolve(event.target.result);
        reader.onerror = error => reject(error);
        reader.readAsArrayBuffer(file);
    });
}

async function comparePDFs() {
    const pdfInput1 = document.getElementById('pdfInput1');
    const pdfInput2 = document.getElementById('pdfInput2');
    const resultDiv = document.getElementById('result');

    if (pdfInput1.files.length === 0 || pdfInput2.files.length === 0) {
        resultDiv.innerHTML = "Please select both PDFs.";
        return;
    }

    const arrayBuffer1 = await readFileAsArrayBuffer(pdfInput1.files[0]);
    const arrayBuffer2 = await readFileAsArrayBuffer(pdfInput2.files[0]);

    const text1 = await getTextFromPDF(arrayBuffer1);
    const text2 = await getTextFromPDF(arrayBuffer2);

    if (text1 === text2) {
        resultDiv.innerHTML = "The texts are identical!<br><br>" + text1;
        resultDiv.style.color = "green";
    } else {
        resultDiv.innerHTML = "The texts are different!";
        resultDiv.style.color = "red";
    }
}
