import sendMail from "@/pages/api/nodemailer";
export default async function handler(
  req: { body: { email: any } },
  res: {
    status: (arg0: number) => {
      (): any;
      new (): any;
      json: { (arg0: { success: boolean; error?: string }): void; new (): any };
    };
  }
) {
  const { email } = req.body;
  console.log("Correo recibido en el endpoint:", email);
  try {
    const success = await sendMail(email);
    if (success) {
      res.status(200).json({ success: true });
    } else {
      res
        .status(500)
        .json({ success: false, error: "Error al enviar el correo" });
    }
  } catch (error) {
    console.error("Error en el endpoint:", error);
    res
      .status(500)
      .json({ success: false, error: "Error al enviar el correo" });
  }
}
