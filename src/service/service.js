const fs = require("fs/promises");
const moment = require("moment");

const logError = async (controller, err, res) => {
    try {
        const timestamp = moment().format("DD/MM/YYYY HH:mm:ss");
        const folderPath = "./logs";
        const filePath = `${folderPath}/${controller + moment().format("YYYY-MM-DD")}.txt`;

        // Create "logs" folder if missing
        await fs.mkdir(folderPath, { recursive: true });

        const logMessage = `[${timestamp}] ERROR: ${err.message}\n` + 
                           `STACK: ${err.stack}\n` + 
                           `DETAILS: ${JSON.stringify(err.original || err.parent || {}, null, 2)}\n\n`;

        await fs.appendFile(filePath, logMessage);
        console.error(`Error in ${controller}:`, err);

    } catch (error) {
        console.error("Error writing to log file:", error);
    }

    res.status(500).json({ 
        message: "Internal Server Error!", 
        error: err.message 
    });
};

module.exports = logError;
