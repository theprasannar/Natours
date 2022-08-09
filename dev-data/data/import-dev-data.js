const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../../models/tourModel');

const DB = process.env.DB_URI.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Databse is Connected');
  });

//Read JSON file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf8'));

//import data into databse
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Imported');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Deleted');
  } catch (error) {}
  process.exit();
};

if (process.argv[2] === '--importData') {
  importData();
}
if (process.argv[2] === '--deleteData') {
  deleteData();
}
