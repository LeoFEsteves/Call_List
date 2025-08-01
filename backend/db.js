import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "inserir host mysql",
  port: "porte do mysql",
  user: "usuario do  mysql",
  password: "senha do mysql",
  database: "inserir aqui",
});
export default db;
