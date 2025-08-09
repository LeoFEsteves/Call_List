import express from "express";
import verify from "./jwt.js"; 
import db from "../db.js";      

const routerStudents = express.Router();

routerStudents.post("/students", verify(), async (req, res) => {
  const { nome } = req.body;  
  if (!nome) return res.status(400).json({ message: "Nome do aluno é obrigatório" });

  try {
    const [result] = await db.query(
      "INSERT INTO Student (nome, id_user) VALUES (?, ?)",
      [nome, req.userId]
    );

   
    res.status(201).json({ id: result.insertId, nome });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar aluno" });
  }
});
export default routerStudents;
