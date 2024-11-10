const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/user.routes");
const recipeRouter = require("./routes/recipe.routes");
const typeRouter = require("./routes/type.routes");
const userIngredientsRouter = require("./routes/userIngredients.routes");


const PORT = process.env.PORT || 8080;

const app = express();

const corsOptions = {
  origin: "http://localhost:5173", // access for frontend requests
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions)); // apply CORS for all routes
app.use(express.json());

app.use("/api", userRouter);
app.use("/api", recipeRouter);
app.use("/api", typeRouter);
app.use("/api", userIngredientsRouter);

app.listen(PORT, () => console.log(`server listening on ${PORT}`));
