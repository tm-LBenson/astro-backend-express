/** @format */

const nodemailer = require('nodemailer');

function contact(req, res) {
  const { name, email, message } = req.body;
  const EMAIL = process.env.EMAIL;
  const PASS = process.env.PASS;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL,
      pass: PASS,
    },
  });
  const mailOptions = {
    from: email,
    to: EMAIL,
    subject: `New message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
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

module.exports = contact;
