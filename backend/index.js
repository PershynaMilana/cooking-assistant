require("dotenv").config();
const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/user.routes");
const recipeRouter = require("./routes/recipe.routes");
const typeRouter = require("./routes/type.routes");
const userIngredientsRouter = require("./routes/userIngredients.routes");
const menuRouter = require("./routes/menu.routes");
const menuCategoryRouter = require("./routes/menuCategory.routes");
const errorHandler = require("./middleware/errorHandler");

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
app.use("/api", menuRouter);
app.use("/api", menuCategoryRouter);

app.use(errorHandler); // must be last - turns thrown errors into { error } responses

app.listen(PORT, () => console.log(`server listening on ${PORT}`));
