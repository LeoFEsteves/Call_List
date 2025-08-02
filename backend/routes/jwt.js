import jwt from "jsonwebtoken";
const secret = "SuperSecreto";

export default function verify() {
  return async (req, res, next) => {
    try {
      const header = req.headers.authorization;
      if (!header || !header.startsWith("Bearer")) {
        return res
          .status(401)
          .json({ message: "Token não fornecido ou mal formado" });
      }
      const token = header.split(" ")[1];
      jwt.verify(token, secret, (error, decoded) => {
        if (error) {
          return res
            .status(401)
            .json({ message: "Token inválido ou expirado" });
        }
        if (!decoded.userId) {
          return res
            .status(403)
            .json({ message: "Token inválido: dados incompletos" });
        }
        req.userId = decoded.userId;
        next();
      });
    } catch (error) {
      console.error("Erro no middleware JWT:", error);
      return res.status(500).json({ message: "Erro de autenticação" });
    }
  };
}
