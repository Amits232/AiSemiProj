import * as brain from 'brain.js';

const fs = require('fs');

// Read the CSV file
fs.readFile('./public/st', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Parse the CSV data
  const rows = data.split('\n').map(row => row.split(','));

  // Process the data as needed
  console.log(rows);
});

