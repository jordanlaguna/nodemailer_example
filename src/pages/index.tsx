import { ChangeEvent, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Navbar from "@/components/NavBar";

export default function Home() {
  const [email, setEmail] = useState("");
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfName, setPdfName] = useState("");
  const [error, setError] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [fecha, setFecha] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [tableData, setTableData] = useState([
    ["Jordan", "Laguna Rodríguez", "2021-10-10", "jlagu@gmail.com", "jlaguna"],
    ["Jordan", "Laguna Rodríguez", "2021-10-10", "jlagu@gmail.com", "jlaguna"],
    ["Jordan", "Laguna Rodríguez", "2021-10-10", "jlagu@gmail.com", "jlaguna"]
  ]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState<string[]>([]);

  const inputFileRef = useRef<HTMLInputElement>(null);

  const showNotification = (message: string) => {
    setNotifications((prev) => [...prev, message]);
    setUnreadNotifications((prev) => [...prev, message]);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSendEmail = async () => {
    try {
      setError("");

      if (!pdfBlob) {
        setError("No se ha cargado ningún archivo PDF");
        return;
      }

      const formData = new FormData();
      formData.append("email", email);
      formData.append("pdf", pdfBlob, "ReporteUsuarios.pdf");

      const response = await fetch("/api/sendEmail", {
        method: "POST",
        body: formData
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
      startY: 70
    });

    return doc.output("blob");
  };

  const handleDownloadPDF = async () => {
    try {
      const pdfBlob = await generatePDF();
      setPdfBlob(pdfBlob);

      const pdfName = "ReporteUsuarios.pdf";
      setPdfName(pdfName);

      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", pdfName);
      document.body.appendChild(link);
      link.click();

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

  const handleNombreChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNombre(e.target.value);
  };

  const handleApellidosChange = (e: ChangeEvent<HTMLInputElement>) => {
    setApellidos(e.target.value);
  };

  const handleFechaChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFecha(e.target.value);
  };

  const handleCorreoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCorreo(e.target.value);
  };

  const handleContraseñaChange = (e: ChangeEvent<HTMLInputElement>) => {
    setContraseña(e.target.value);
  };

  const handleAddRecord = () => {
    const newRecord = [nombre, apellidos, fecha, correo, contraseña];
    setTableData((prev) => [...prev, newRecord]);
    showNotification(`Nuevo registro agregado: ${nombre}`);
    setNombre("");
    setApellidos("");
    setFecha("");
    setCorreo("");
    setContraseña("");
  };

  return (
    <>
      <Navbar notifications={unreadNotifications} />
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px"
        }}
      >
        <div style={{ width: "100%", maxWidth: "800px", marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Digite el correo"
            value={email}
            onChange={handleEmailChange}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            ref={inputFileRef}
            style={{ display: "none" }}
          />
          <div style={{ marginLeft: "10px" }}>{pdfName}</div>
          <button
            className="border-r-2 w-30 h-30 bg-green-600"
            onClick={handleSendEmail}
            disabled={!pdfBlob}
            style={{
              padding: "10px",
              marginBottom: "10px",
              backgroundColor: "green",
              color: "white"
            }}
          >
            Enviar correo
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>

        <section style={{ width: "100%", maxWidth: "800px" }}>
          <table className="w-full bg-slate-400 rounded-lg">
            <thead>
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

        <article
          style={{ width: "100%", maxWidth: "800px", marginTop: "20px" }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={handleNombreChange}
              style={{ padding: "10px" }}
            />
            <input
              type="text"
              placeholder="Apellidos"
              value={apellidos}
              onChange={handleApellidosChange}
              style={{ padding: "10px" }}
            />
            <input
              type="date"
              placeholder="Fecha"
              value={fecha}
              onChange={handleFechaChange}
              style={{ padding: "10px" }}
            />
            <input
              type="email"
              placeholder="Correo"
              value={correo}
              onChange={handleCorreoChange}
              style={{ padding: "10px" }}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={contraseña}
              onChange={handleContraseñaChange}
              style={{ padding: "10px" }}
            />
            <button
              className="bg-blue-500 rounded-lg text-white w-40 mt-5 h-10"
              onClick={handleAddRecord}
              style={{
                padding: "10px",
                backgroundColor: "blue",
                color: "white"
              }}
            >
              Agregar
            </button>
          </div>
        </article>
      </main>
    </>
  );
}
