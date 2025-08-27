import express from "express";
import verify from "./jwt.js";
import db from "../db.js";

const routerAttendance = express.Router();

// Registrar presença/falta
routerAttendance.post("/", verify(), async (req, res) => {
  console.log("📊 POST /attendance recebido");
  console.log("Body:", req.body);
  
  const { studentName, present, date_attendance } = req.body;

  if (!studentName || present === undefined || !date_attendance) {
    console.log("Erro: Dados incompletos");
    return res.status(400).json({ message: "Dados incompletos" });
  }

  if (isNaN(Date.parse(date_attendance))) {
    console.log("Erro: Data inválida");
    return res.status(400).json({ message: "Data inválida" });
  }

  try {
    console.log("Buscando aluno:", studentName, "para usuário:", req.userId);
    
    const [aluno] = await db.query(
      "SELECT id FROM Student WHERE nome = ? AND id_user = ?",
      [studentName, req.userId]
    );

    if (aluno.length === 0) {
      console.log("Erro: Aluno não encontrado ou não pertence ao usuário");
      return res.status(403).json({ message: "Aluno não pertence a este professor" });
    }

    const presentBool = present === true || present === 1 || present === "1";
    console.log("Registrando presença:", presentBool, "para data:", date_attendance);

    await db.query(
      `INSERT INTO Attendance (id_student, present, date_attendance) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE present = VALUES(present)`,
      [aluno[0].id, presentBool, date_attendance]
    );

    console.log("Presença registrada com sucesso");
    res.status(201).json({ message: "Presença registrada com sucesso" });

  } catch (error) {
    console.error("Erro ao registrar presença:", error);
    res.status(500).json({ message: "Erro ao registrar presença" });
  }
});

export default routerAttendance;