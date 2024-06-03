import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

async function sendMail(
  toEmail: string,
  pdfBuffer: Buffer,
  pdfFilename: string
) {
  try {
    // Adjuntar el PDF al correo electrónico
    const info = await transporter.sendMail({
      from: '"Soy el admin" <jordanlaguna10@gmail.com>',
      to: toEmail,
      subject: "Políticas del Admin",
      text: "Enviado con éxito!",
      html: `
        <p>
          ¡Hola!<br><br>
          Esperamos que te encuentre bien!<br><br>
          Atentamente,<br>
        </p>
      `,
      attachments: [
        {
          filename: pdfFilename,
          content: pdfBuffer
        }
      ]
    });

    console.log("Message sent: %s", info.messageId);

    return true;
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw new Error("Error al enviar el correo");
  }
}

export default sendMail;
