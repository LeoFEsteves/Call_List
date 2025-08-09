import express from "express";
import verify from "./jwt.js";
import db from "../db.js";

const routerAttendance = express.Router();

routerAttendance.post("/", verify(), async (req, res) => {
  const { id_student, present, date_attendance } = req.body;

  
  if (!id_student || present === undefined || !date_attendance) {
    return res.status(400).json({ message: "Dados incompletos" });
  }

  if (isNaN(Date.parse(date_attendance))) {
    return res.status(400).json({ message: "Data inválida" });
  }

  try {
   
    const [aluno] = await db.query(
      "SELECT id FROM Student WHERE id = ? AND id_user = ?",
      [id_student, req.userId]
    );

    if (aluno.length === 0) {
      return res.status(403).json({ message: "Aluno não pertence a este professor" });
    }

    const presentBool = present === true || present === 1 || present === "1";

    await db.query(
      "INSERT INTO Attendance (id_student, present, date_attendance) VALUES (?, ?, ?) " +
      "ON DUPLICATE KEY UPDATE present = VALUES(present)",
      [id_student, presentBool, date_attendance]
    );

    res.status(201).json({ message: "Presença registrada com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao registrar presença" });
  }
});

export default routerAttendance;
