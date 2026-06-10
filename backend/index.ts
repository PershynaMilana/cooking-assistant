import cors from "cors";
import express from "express";

import controllers from "./composition-root";
import { config } from "./config/env";
import errorHandler from "./middleware/errorHandler";
import createMenuCategoryRouter from "./routes/menuCategory.routes";
import createMenuRouter from "./routes/menu.routes";
import createRecipeRouter from "./routes/recipe.routes";
import createTypeRouter from "./routes/type.routes";
import createUserIngredientsRouter from "./routes/userIngredients.routes";
import createUserRouter from "./routes/user.routes";

const app = express();

app.disable("x-powered-by"); // do not advertise the framework in response headers

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

app.listen(config.port, () =>
    console.log(`server listening on ${config.port}`),
);
