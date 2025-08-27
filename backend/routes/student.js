import express from "express";
import verify from "./jwt.js";
import db from "../db.js";

const routerStudents = express.Router();

// Adicionar aluno
routerStudents.post("/", verify(), async (req, res) => {
  console.log("📝 POST /students recebido");
  console.log("Body:", req.body);
  console.log("User ID:", req.userId);
  
  const { name } = req.body;
  
  if (!name) {
    console.log("Erro: Nome não fornecido");
    return res.status(400).json({ message: "Nome do aluno é obrigatório" });
  }

  try {
    console.log("Tentando inserir aluno:", name, "para usuário:", req.userId);
    
    const [result] = await db.query(
      "INSERT INTO Student (nome, id_user) VALUES (?, ?)",
      [name, req.userId]
    );

    console.log("Aluno inserido com ID:", result.insertId);
    res.status(201).json({ id: result.insertId, name });

  } catch (error) {
    console.error("Erro ao criar aluno:", error);
    res.status(500).json({ message: "Erro ao criar aluno" });
  }
});

// Buscar todos os alunos do usuário logado
routerStudents.get("/", verify(), async (req, res) => {
  console.log("📋 GET /students recebido para usuário:", req.userId);
  
  try {
    const [rows] = await db.query(
      "SELECT id, nome FROM Student WHERE id_user = ?",
      [req.userId]
    );

    console.log("Alunos encontrados:", rows.length);
    
    const students = rows.map(row => ({
      id: row.id,
      name: row.nome
    }));

    res.json(students);

  } catch (error) {
    console.error("Erro ao buscar alunos:", error);
    res.status(500).json({ message: "Erro ao buscar alunos" });
  }
});

export default routerStudents;