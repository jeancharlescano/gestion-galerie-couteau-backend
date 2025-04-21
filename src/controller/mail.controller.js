import { sendAMail } from "../services/mail.service.js";

export const sendMail = async (req, res) => {
  try {
    const { firstname, lastname, email, message } = req.body;

    const subject = `LameDeTony - Nouvelle demande de ${firstname} ${lastname}`;
    const body = `
      Nom : ${lastname}
      Prénom : ${firstname}
      Email : ${email}

      Message :
      ${message}
    `;

    await sendAMail("lamedetony84@gmail.com", subject, body, email);

    res
      .status(200)
      .json({ success: true, message: "Mail envoyé avec succès." });
  } catch (error) {
    console.error("Erreur d'envoi :", error);
    res
      .status(500)
      .json({ success: false, message: "Erreur lors de l'envoi de l'email." });
  }
};
