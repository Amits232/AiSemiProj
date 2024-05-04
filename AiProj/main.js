import brain from 'brain.js';
import data from './public/data.csv';

const net = new brain.NeuralNetwork({ activation: 'relu' });

fetch(data)
  .then(response => response.text())
  .then(data => {
    const csvRows = data.split('\n');
    const headers = csvRows.shift().split(',');
    const trainingData = csvRows.map(row => {
      const values = row.split(',');
      const dataPoint = {};
      headers.forEach((header, i) => {
        dataPoint[header] = parseFloat(values[i]);
      });
      return dataPoint;
    });

    net.train(trainingData, { log: true, errorThresh: 0.01 });

    const inputBoxes = Array.from(document.querySelectorAll('.input-box'));
    const outputBox = document.getElementById('output-box');
    const predictButton = document.getElementById('predict-button');

    predictButton.addEventListener('click', () => {
      const input = inputBoxes.map(box => parseFloat(box.value));
      const result = net.run(input);
      outputBox.value = result.toFixed(2);
    });
  });

