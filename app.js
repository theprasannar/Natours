const express = require('express');
const fs = require('fs');
const app = express();

//Reading data
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-sample.json`)
);
app.get('/api/v1', (req, res) => {
  res.status(200).json({
    status: 'Success',
    data: { tours },
  });
});
const port = 5000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
