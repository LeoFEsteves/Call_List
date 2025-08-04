import express from "express";
import verify from "./jwt.js";
import db from "../db.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'

const routerLogin = express.Router();
const secret = "SuperSecreto";

routerLogin.post("/login", async (req, res) => {
  const { nome, senha } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM Users WHERE nome = ?", [
      nome,
    ]);
    console.log(rows)

    if (rows.length === 0)
      return res.status(401).json({ message: "Usuário não encontrado" });
    const user = rows[0];
    const correctPass = await bcrypt.compare(senha, user.senha);

    if (!correctPass)
      return res.status(401).json({ message: "Senha incorreta" });

    const token = jwt.sign({ userId: user.id, nome: user.nome }, secret, {
      expiresIn: "7d",
    });

    res.json({ token });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ message: "Erro no servidor" });
  }
});
routerLogin.get("/verify", verify(), async (req, res) => {
  res.status(200).json({ valid: true, userId: req.userId, nome: req.nome });
});

export default routerLogin