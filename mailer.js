"use strict"

/**
 * @description Email script to send email to a list and including attached files.
 * For use in sending statements to congregants.
 * @author John Shaw
 * @version 1.0.0
 */

const nodemailer = require("nodemailer");
const fs = require("fs");

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Load data from JSON file
const data = JSON.parse(fs.readFileSync('./data.json'));

// SETUP EMAIL TRANSPORTER
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: data.emailUser,
    pass: data.emailPw // Not email pw, google registered app pw
  },
});

async function main() {
    // MAKE EMAILS
    for (const recipient of data.recipients) {
        const mailOptions = {
            from: data.sender,
            cc: data.cc,
            to: recipient.email,
            subject: data.subject,
            text: data.message,
            html: data.messageHTML,
            attachments: [
                {
                    filename: recipient.filePrefix + data.fileSuffix,
                    path: data.pathToFiles + recipient.filePrefix + data.fileSuffix
                }
            ]
        };

        // Send the email
        try {
            await transporter.sendMail(mailOptions);
            console.log(`${recipient.email} sent successfully!`);
            await sleep(1000);
        } catch (err) {
            console.error(`Error occurred sending ${recipient.email}:`, err.message);
        }
    }
}

(async () => {
    await main();
    console.log("All emails processed.");
})();
