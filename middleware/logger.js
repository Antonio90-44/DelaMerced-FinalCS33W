const fs = require('fs');
const path = require('path');


const logFilePath = path.resolve("logs/request.log")

const logger = (request, response, next) => {
    const timestamp = new Date().toISOString();
    const method = request.method;
    const urlPath = request.originalUrl;

    const opString = "REQ: " + timestamp + " || " + method + " || " + urlPath;

    fs.appendFile(logFilePath, opString, (error) => {
        if(error) {
            console.error("Error writing to requests.log: ", error);
        }
    });

    next();
}
module.exports = logger;