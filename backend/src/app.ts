import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";

import type { Controllers } from "./composition-root";
import { logger } from "@config/logger";
import errorHandler from "@middleware/errorHandler";
import createHealthRouter from "@routes/health.routes";
import createMenuCategoryRouter from "@routes/menuCategory.routes";
import createMenuRouter from "@routes/menu.routes";
import createRecipeRouter from "@routes/recipe.routes";
import createTypeRouter from "@routes/type.routes";
import createUserIngredientsRouter from "@routes/userIngredients.routes";
import createUserRouter from "@routes/user.routes";

export function createApp(controllers: Controllers): Express {
    const app = express();

    app.use(helmet());
    app.use(
        pinoHttp({
            logger,
            // keep auth tokens and cookies out of logs
            redact: ["req.headers.authorization", "req.headers.cookie"],
        }),
    );
    app.use(
        cors({
            origin: "http://localhost:5173",
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            credentials: true,
        }),
    );
    app.use(express.json({ limit: "100kb" }));

    app.use("/api", createHealthRouter());
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
