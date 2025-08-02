import express from "express";
import routerLogin from "./routes/login.js";
const app = express();

app.use(express.json())
app.use("/auth", routerLogin);

const port = 5000;
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
