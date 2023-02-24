require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const Router = require("./routes")
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.json({limit: 200000000}));
app.use(express.urlencoded({limit: 200000000, extended: false}));

mongoose.set('strictQuery', true);
mongoose.set('autoIndex', true);
mongoose.connect(process.env.DATA_URL);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected to MongoDB");
})

app.use(Router);

app.listen(process.env.PORT, () => {
    console.log("Server is running at port "+process.env.PORT);
});