import cors from "cors";
import express, { type Express } from "express";

import type { Controllers } from "./composition-root";
import errorHandler from "@middleware/errorHandler";
import createMenuCategoryRouter from "@routes/menuCategory.routes";
import createMenuRouter from "@routes/menu.routes";
import createRecipeRouter from "@routes/recipe.routes";
import createTypeRouter from "@routes/type.routes";
import createUserIngredientsRouter from "@routes/userIngredients.routes";
import createUserRouter from "@routes/user.routes";

export function createApp(controllers: Controllers): Express {
    const app = express();

    app.disable("x-powered-by");
    app.use(
        cors({
            origin: "http://localhost:5173",
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            credentials: true,
        }),
    );
    app.use(express.json());

    app.use("/api", createUserRouter(controllers.userController));
    app.use("/api", createRecipeRouter(controllers.recipeController));
    app.use("/api", createTypeRouter(controllers.recipeTypeController));
    app.use(
        "/api",
        createUserIngredientsRouter(controllers.userIngredientsController),
    );
    app.use("/api", createMenuRouter(controllers.menuController));
    app.use(
        "/api",
        createMenuCategoryRouter(controllers.menuCategoryController),
    );

    app.use(errorHandler);

    return app;
}
