require("dotenv").config();
const express = require("express");
const cors = require("cors");
const controllers = require("./composition-root");
const createUserRouter = require("./routes/user.routes");
const createRecipeRouter = require("./routes/recipe.routes");
const createTypeRouter = require("./routes/type.routes");
const createUserIngredientsRouter = require("./routes/userIngredients.routes");
const createMenuRouter = require("./routes/menu.routes");
const createMenuCategoryRouter = require("./routes/menuCategory.routes");
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

app.use("/api", createUserRouter(controllers.userController));
app.use("/api", createRecipeRouter(controllers.recipeController));
app.use("/api", createTypeRouter(controllers.recipeTypeController));
app.use(
    "/api",
    createUserIngredientsRouter(controllers.userIngredientsController),
);
app.use("/api", createMenuRouter(controllers.menuController));
app.use("/api", createMenuCategoryRouter(controllers.menuCategoryController));

app.use(errorHandler); // must be last - turns thrown errors into { error } responses

app.listen(PORT, () => console.log(`server listening on ${PORT}`));
