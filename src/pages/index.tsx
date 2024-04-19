import { ChangeEvent, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function Home() {
  const [email, setEmail] = useState("");
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfName, setPdfName] = useState("");
  const [error, setError] = useState("");

  const tableData = [
    ["Jordan ", "Laguna Rodríguez", "2021-10-10", "jlagu@gmail.com", "jlaguna"],
    ["Jordan ", "Laguna Rodríguez", "2021-10-10", "jlagu@gmail.com", "jlaguna"],
    [
      "Jordan Laguna",
      "Laguna Rodríguez",
      "2021-10-10",
      "jlagu@gmail.com",
      "jlaguna",
    ],
    [
      "Jordan Laguna",
      "Laguna Rodríguez",
      "2021-10-10",
      "jlagu@gmail.com",
      "jlaguna",
    ],
  ];

  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSendEmail = async () => {
    try {
      setError("");

      // Verificar si pdfBlob es nulo antes de usarlo
      if (!pdfBlob) {
        setError("No se ha cargado ningún archivo PDF");
        return;
      }

      const formData = new FormData();
      formData.append("email", email);
      formData.append("pdf", pdfBlob, "ReporteUsuarios.pdf");

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

  const generatePDF = async () => {
    const doc = new jsPDF();
    doc.setFontSize(18);

    doc.text("Historial Usuarios.", 105, 15, { align: "center" });

    doc.text("Nombre De La Empresa: Supermercado El Piru.", 10, 40);
    doc.text("Dirección: Golfito, Río Claro, KM 29-30.", 10, 50);
    doc.text("Telefono: 8988-8786.", 10, 60);

    const columns = ["Nombre", "Apellidos", "Fecha", "Correo", "Contraseña"];

    autoTable(doc, {
      head: [columns],
      body: tableData,
      startY: 70,
    });

    // Devolver el blob del PDF directamente
    return doc.output("blob");
  };

  const handleDownloadPDF = async () => {
    try {
      const pdfBlob = await generatePDF();
      setPdfBlob(pdfBlob); // Almacenar el blob del PDF en el estado

      const pdfName = "ReporteUsuarios.pdf"; // Nombre del PDF
      setPdfName(pdfName); // Almacenar el nombre del PDF en el estado

      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", pdfName);
      document.body.appendChild(link);
      link.click();

      // Cargar automáticamente el PDF en el input file
      inputFileRef.current?.click();
    } catch (error) {
      console.error("Error al descargar el PDF", error);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfBlob(file);
      setPdfName(file.name);
    }
  };

  return (
    <>
      <main
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <input
          type="text"
          placeholder="Digite el correo"
          value={email}
          onChange={(e) => handleEmailChange(e)}
        />
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          ref={inputFileRef}
          style={{ display: "none" }}
        />
        <div style={{ marginLeft: "10px" }}>{pdfName}</div>{" "}
        <button
          className="border-r-2 w-30 h-30 bg-green-600"
          onClick={handleSendEmail}
          disabled={!pdfBlob}
        >
          Enviar correo
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </main>
      <section className="ml-36">
        <table className="mt-5 w-[80%] bg-slate-400 rounded-lg">
          <thead className="items-end ">
            <tr>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Fecha</th>
              <th>Correo</th>
              <th>Contraseña</th>
            </tr>
          </thead>
          <tbody className="text-center text-sm">
            {tableData.map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="bg-green-700 rounded-lg text-white w-40 mt-5 h-10"
          onClick={handleDownloadPDF}
        >
          Descargar PDF
        </button>
      </section>
    </>
  );
}
