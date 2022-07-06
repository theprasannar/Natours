const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');

//handle uncought Exception
process.on('uncaughtException', (err) => {
  console.log(`Error:${err.message}`);
  console.log('Shutting down server because of uncaughtException');
  process.exit(1);
});
const app = require('./app');

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

//unhandler promise rejection
process.on('unhandledRejection', (err) => {
  console.log(`Error:${err.message}`);
  console.log('Shutting down server because of unhandled promise rejection');

  server.close(() => {
    process.exit(1);
  });
});
