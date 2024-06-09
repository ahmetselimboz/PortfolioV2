const nodemailer = require("nodemailer");
const config = require("../config/environments")

const mail = async (message) => {
  try {
    const transporter = nodemailer.createTransport({
      host: config.MAIL_HOST,
      port: 587,
      auth: {
        user: config.MAIL_USER,
        pass: config.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: config.MAIL_USER,
      to: ["ahmetselimboz46@gmail.com"],
      subject: "Ahmetselimboz.com.tr Notification",
      text: "Notification!!",
    };
    mailOptions.text = message;
    await transporter.sendMail(mailOptions);
    console.log("Mail sended!");
  } catch (error) {
    console.log("sendMail Error: " + error);
  }
};
module.exports = mail;
