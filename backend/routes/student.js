import express from "express";
import verify from "./jwt.js"; 
import db from "../db.js";      

const routerStudents = express.Router();

// Adicionar aluno
routerStudents.post("/", verify(), async (req, res) => {
  const { name } = req.body;  // front envia "name"
  if (!name) return res.status(400).json({ message: "Nome do aluno é obrigatório" });

  try {
    const [result] = await db.query(
      "INSERT INTO Student (nome, id_user) VALUES (?, ?)",
      [name, req.userId]
    );

    res.status(201).json({ id: result.insertId, name });
  } catch (error) {
    console.error("Erro ao criar aluno:", error);
    res.status(500).json({ message: "Erro ao criar aluno" });
  }
});

// Buscar todos os alunos do usuário logado
routerStudents.get("/", verify(), async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, nome FROM Student WHERE id_user = ?",
      [req.userId]
    );

    // converte 'nome' do DB para 'name' do frontend
    const students = rows.map(row => ({ id: row.id, name: row.nome }));
    res.json(students);
  } catch (error) {
    console.error("Erro ao buscar alunos:", error);
    res.status(500).json({ message: "Erro ao buscar alunos" });
  }
});

export default routerStudents;
