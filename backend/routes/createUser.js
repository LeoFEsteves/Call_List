import express from "express";
import bcrypt from "bcryptjs";
import db from "../db.js";

const routerCreateUser = express.Router();
const salt = 10;

routerCreateUser.post("/create/user", async (req, res) => {
  const { nome, senha } = req.body;

  if (!nome || !senha) {
    return res.status(500).json({ message: "Nome ou senha não fornecidos." });
  }

  try {
    const [users] = await db.query("SELECT nome FROM users WHERE nome = ?", [
      nome,
    ]);

    if (users.length > 0)
      return res.status(409).json({ message: "Usuário já existe." });

    const hash = await bcrypt.hash(senha, salt);

    const [result] = await db.query(
      "INSERT INTO users (nome,senha) VALUES (?,?)",
      [nome, hash]
    );
    res.status(201).json({ nome, id: result.insertId });
  } catch (error) {
    console.error("Erro ao inserir usuário:", error);
    res.status(500).json({ message: "Erro interno ao inserir usuário." });
  }
});

export default routerCreateUser;
