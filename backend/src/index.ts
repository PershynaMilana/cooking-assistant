import controllers from "./composition-root";
import { createApp } from "./app";
import { config } from "@config/env";

const app = createApp(controllers);

app.listen(config.port, () =>
    console.log(`server listening on ${config.port}`),
);
