import express from "express";
import routerLogin from "./routes/login.js";
import routerCreateUser from "./routes/createUser.js";
import routerStudents from "./routes/students.js";

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  console.log("Request Body:", req.body);
  next();
});

app.use("/auth", routerLogin, routerCreateUser);
app.use("/students", routerStudents);

const port = 5000;
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
