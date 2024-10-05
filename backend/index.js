const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/user.routes");
const recipeRouter = require("./routes/recipe.routes");

const PORT = process.env.PORT || 8080;

const app = express();

const corsOptions = {
  origin: "http://localhost:5173", // Разрешите доступ только с этого домена
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Разрешенные методы
  credentials: true, // Разрешите отправку куки
};

app.use(cors(corsOptions)); // Применяем CORS ко всем маршрутам
app.use(express.json());
app.use("/api", userRouter);
app.use("/api", recipeRouter);

app.listen(PORT, () => console.log(`server listening on ${PORT}`));
