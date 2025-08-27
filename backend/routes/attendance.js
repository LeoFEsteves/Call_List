import express from "express";
import verify from "./jwt.js";
import db from "../db.js";

const routerAttendance = express.Router();

// Registrar presença/falta
routerAttendance.post("/", verify(), async (req, res) => {
  const { studentName, present, date_attendance } = req.body;

  if (!studentName || present === undefined || !date_attendance) {
    return res.status(400).json({ message: "Dados incompletos" });
  }

  if (isNaN(Date.parse(date_attendance))) {
    return res.status(400).json({ message: "Data inválida" });
  }

  try {
    // Buscar aluno pelo nome e pelo usuário logado
    const [aluno] = await db.query(
      "SELECT id FROM Student WHERE nome = ? AND id_user = ?",
      [studentName, req.userId]
    );

    if (aluno.length === 0) {
      return res.status(403).json({ message: "Aluno não pertence a este professor" });
    }

    const presentBool = present === true || present === 1 || present === "1";

    await db.query(
      `INSERT INTO Attendance (id_student, present, date_attendance) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE present = VALUES(present)`,
      [aluno[0].id, presentBool, date_attendance]
    );

    res.status(201).json({ message: "Presença registrada com sucesso" });
  } catch (error) {
    console.error("Erro ao registrar presença:", error);
    res.status(500).json({ message: "Erro ao registrar presença" });
  }
});

export default routerAttendance;
