import bcrypt from "bcryptjs";
const username = "Admin";
const salt = 10;
const password = await bcrypt.hash("senhaSuperSecreta", salt);

console.log(
  `INSERT INTO Users(nome, senha) values ('${username}','${password}')`
);
