// ./src/controllers/slackMessage.js
const nodemailer = require('nodemailer');

function slackMessage(req, res) {
  const { slackName, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: 'aaaajnk2voipj5wlxp45urn6ba@codexlearners.slack.com',
    subject: `Message from ${slackName}`,
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error sending email');
    } else {
      console.log(`Email sent: ${info.response}`);
      res.status(200).send({ status: 'Message sent' });
    }
  });
}

module.exports = slackMessage;
