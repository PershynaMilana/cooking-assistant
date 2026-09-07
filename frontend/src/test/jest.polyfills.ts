// jsdom ships neither; axios and the URL helpers used in tests read them at module load
import { TextDecoder, TextEncoder } from "node:util";

Object.assign(globalThis, { TextEncoder, TextDecoder });
