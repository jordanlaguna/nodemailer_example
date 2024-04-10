import { ChangeEvent, useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [pdf, setPdf] = useState<File | null>(null);
  const [error, setError] = useState("");

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePdfChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdf(e.target.files[0]);
    }
  };

  const handleSendEmail = async () => {
    if (!pdf) {
      setError("Por favor selecciona un archivo PDF");
      return;
    }

    try {
      setError("");
      const formData = new FormData();
      formData.append("email", email);
      formData.append("pdf", pdf);

      const response = await fetch("/api/sendEmail", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Correo enviado exitosamente");
      } else {
        console.error("Error al enviar el correo");
      }
    } catch (error) {
      console.error("Error inesperado", error);
      setError("Ocurrió un error al enviar el correo");
    }
  };

  return (
    <main>
      <div>
        <input
          type="text"
          placeholder="Digite el correo"
          value={email}
          onChange={(e) => handleEmailChange(e)}
        />
        <input type="file" accept=".pdf" onChange={handlePdfChange} />
        <button
          className=" border-r-2 w-30 h-30 bg-green-600"
          onClick={handleSendEmail}
        >
          Enviar correo
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </main>
  );
}
