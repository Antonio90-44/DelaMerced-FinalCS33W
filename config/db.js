const mongoose = require("mongoose");
require("dotenv").config(); 

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("connected to MongoDB Atlas"))
    .catch(error => console.error("MongoDB error: ", error));