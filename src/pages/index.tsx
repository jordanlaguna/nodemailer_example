import { Inter } from "next/font/google";
import { ChangeEvent, SetStateAction, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [email, setEmail] = useState("");

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSendEmail = async () => {
    try {
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        console.log("Correo enviado exitosamente");
      } else {
        console.error("Error al enviar el correo");
      }
    } catch (error) {
      console.error("Error inesperado", error);
    }
  };

  return (
    <main>
      <div>
        <input
          className="w-48 h-8 items-center ml-60 mt-44"
          type="text"
          placeholder="Digite el correo"
          value={email}
          onChange={(e) => handleEmailChange(e)}
        />
        <button
          className="bg-lime-900 py-1 ml-1 rounded-md w-28 h-8"
          onClick={handleSendEmail}
        >
          Enviar correo
        </button>
      </div>
    </main>
  );
}
