import { fileURLToPath } from "url";
import { dirname as dir } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dir(__filename);

export const dirname = __dirname;
