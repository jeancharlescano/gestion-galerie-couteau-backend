import nodemailer from "nodemailer";

export const sendAMail = async (to, subject, body, replyTo) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
      user: "lamedetony84@gmail.com",
      pass: process.env.MAIL_PWD,
    },
  });

  const mailOptions = {
    from: "lamedetony84@gmail.com",
    to,
    subject,
    text: body,
    replyTo,
  };

  return transporter.sendMail(mailOptions);
};
