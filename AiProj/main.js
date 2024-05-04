import brain from 'brain.js';
import data from './public/data.csv';

const net = new brain.NeuralNetwork({ activation: 'relu' });

fetch(data)
  .then(response => response.text())
  .then(csvData => {
    const csvRows = csvData.split('\n');
    const headers = csvRows.shift().split(',');
    const trainingData = csvRows.map(row => {
      const values = row.split(',');
      const input = values.slice(0, -1).map(parseFloat); // Extract inputs except the last column
      const output = [parseFloat(values[values.length - 1])]; // Extract the last column as output
      return { input, output };
    });

    net.train(trainingData, { log: true, errorThresh: 0.01 });

    const inputBoxes = document.querySelectorAll('.input-box');
    const outputBox = document.getElementById('output-box');
    const predictButton = document.getElementById('predict-button');

    predictButton.addEventListener('click', () => {
      const input = Array.from(inputBoxes).map(box => parseFloat(box.value));
      const result = net.run(input);
      outputBox.value = result.toFixed(2);
    });
  });