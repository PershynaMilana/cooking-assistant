const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/user.routes");
const recipeRouter = require("./routes/recipe.routes");
const typeRouter = require("./routes/type.routes");

const PORT = process.env.PORT || 8080;

const app = express();

const corsOptions = {
  origin: "http://localhost:5173", // Дозволити доступ тільки з цього домену
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Дозволені методи
  credentials: true, // Дозволити відправку куків
};

app.use(cors(corsOptions)); // Застосовуємо CORS до всіх маршрутів
app.use(express.json());
app.use("/api", userRouter);
app.use("/api", recipeRouter);
app.use("/api", typeRouter);

app.listen(PORT, () => console.log(`server listening on ${PORT}`));
