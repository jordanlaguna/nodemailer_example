import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "jordanlaguna10@gmail.com",
    pass: "wcka awqr eyen pypf",
  },
});

async function sendMail(toEmail: string) {
  try {
    const info = await transporter.sendMail({
      from: '"Mi primer correo enviado 👻" <jordanlaguna10@gmail.com>',
      to: toEmail,
      subject: "Departamento de recursos humanos",
      text: "Enviado con éxito!",
      html: "<b>Esta prueba se ha realizado con éxito.</b>",
    });
    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw new Error("Error al enviar el correo");
  }
}

export default sendMail;
