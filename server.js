const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
const cookieParser = require('cookie-parser')

app.use(cookieParser());
app.use(cors({
    origin: ["https://e09f-92-40-110-200.ngrok-free.app", "http://localhost:3000"]
}));
app.use(express.json());

app.use('/users', require("./routes/authRoutes"))
app.use('/albums', require("./routes/albumRoutes"))
app.use(errorHandler)
app.listen(port, () => {
    console.log(port)
})

module.exports = app