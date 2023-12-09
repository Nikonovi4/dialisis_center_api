const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/error-handler');
// Слушаем 3000 порт

const app = express();
const routes = require("./routes/index");

const { PORT = "3000", DB_URL = "mongodb://0.0.0.0/dialisisdb" } = process.env;

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connected to bd");
  });

app.use(cookieParser());
app.use(bodyParser.json());
app.use(routes);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server is runing on port ${PORT}`);
});
