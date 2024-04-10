import sendMail from "@/pages/api/nodemailer";
import formidable from "formidable";
import fs from "fs";
import { IncomingMessage } from "http";

export default async function handler(
  req: IncomingMessage,
  res: {
    status: (arg0: number) => {
      (): any;
      new (): any;
      json: {
        (arg0: { success: boolean; error?: string }): void | PromiseLike<void>;
        new (): any;
      };
    };
  }
) {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error al analizar la solicitud:", err);
      return res
        .status(500)
        .json({ success: false, error: "Error al procesar la solicitud" });
    }

    const { email } = fields;
    const pdf = files?.pdf?.[0]; // Acceder al primer elemento de la matriz de archivos

    if (!email || !pdf) {
      return res
        .status(400)
        .json({ success: false, error: "Faltan parámetros" });
    }

    try {
      const pdfBuffer = fs.readFileSync(pdf.path);
      const success = await sendMail(email, pdfBuffer, pdf.name || "pdf.pdf"); // Utilizar pdf.name o un nombre predeterminado si pdf.name es undefined

      if (success) {
        return res.status(200).json({ success: true });
      } else {
        return res
          .status(500)
          .json({ success: false, error: "Error al enviar el correo" });
      }
    } catch (error) {
      console.error("Error en el endpoint:", error);
      return res
        .status(500)
        .json({ success: false, error: "Error al enviar el correo" });
    }
  });
}
