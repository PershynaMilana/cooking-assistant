import { Pool } from "pg";

import { config } from "./config/env";

const pool = new Pool(config.db);

export default pool;
