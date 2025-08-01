import express from "express";
import verify from "./jwt";
import db from "../db";
import bcrypt from "bcryptjs";

const routerLogin = express.Router();
const secret = "SuperSecretoOCodigo";

routerLogin.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM Users WHERE nome = ?", [
      username,
    ]);

    if (rows.length === 0)
      return res.status(401).json({ message: "Usuário não encontrado" });
    const user = rows[0];
    const correctPass = await bcrypt.compare(password, user.senha);

    if (!correctPass)
      return res.status(401).json({ message: "Senha incorreta" });

    const token = jwt.sign({ userId: user.id, username: user.nome }, secret, {
      expiresIn: "7d",
    });

    res.json({ token });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ message: "Erro no servidor" });
  }
});
routerLogin.get("/verify", verify(), async (req, res) => {
  res.status(200).json({ valid: true, userId: req.userId, username: req.nome });
});
