import { Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import sendMail from "@/pages/api/nodemailer";

const upload = multer({ dest: "/uploads" });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: Request, res: Response) {
  try {
    upload.single("pdf")(req, res, async (err) => {
      if (err) {
        console.error("Error parsing request:", err);
        return res.status(500).json({
          success: false,
          error: "Error parsing request",
        });
      }

      const { email } = req.body;
      const pdf = req.file;

      if (!email || !pdf) {
        return res.status(400).json({
          success: false,
          error: "Missing parameters",
        });
      }

      console.log("Ruta del archivo PDF:", pdf.path);

      try {
        console.log("Leyendo archivo PDF...");
        if (!fs.existsSync(pdf.path)) {
          throw new Error("El PDF no existe en la ubicación especificada.");
        }
        const pdfBuffer = fs.readFileSync(pdf.path);
        const pdfFilename = pdf.originalname || ".pdf";
        console.log("Adjuntando archivo PDF al correo electrónico...");
        const success = await sendMail(email, pdfBuffer, pdfFilename);

        fs.unlinkSync(pdf.path);

        if (success) {
          console.log("Correo electrónico enviado exitosamente.");
          return res.status(200).json({ success: true });
        } else {
          console.error("Error al enviar el correo.");
          return res.status(500).json({
            success: false,
            error: "Error sending email",
          });
        }
      } catch (error) {
        console.error("Error al leer el archivo PDF:", error);
        return res.status(500).json({
          success: false,
          error: "Error reading PDF file",
        });
      }
    });
  } catch (error) {
    console.error("Error in endpoint:", error);
    return res.status(500).json({
      success: false,
      error: "Error in endpoint",
    });
  }
}
