import { writeFileSync, mkdirSync, rmSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { generateORM } from "./orn_generator.js";
import { TABLE } from "../table/table.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export function generateClient(config, tableSchemas) {
	//path
	let clientPath = join(__dirname, "../../client");
	rmSync(clientPath, { recursive: true, force: true });
	mkdirSync(clientPath);

	let table_infos = []; //string[]
	let code_block = []; // string []
	if (Array.isArray(tableSchemas)) {
		tableSchemas.forEach((table) => {
			if (table instanceof TABLE) {
				table_infos.push(table.InfoObjectString());
				code_block.push(generateORM(table));
			}
		});
	}

	let CLIENT_BOILERPLATE = `import mysql from "mysql2/promise";

		let _connection_ = null;
		async function _connection() {
			if (_connection_ === null) {
				_connection_ = await mysql.createConnection({
					host: "${config.host || "loacalhost"}",
					database: "${config.database || ""}",
					user: "${config.user || "root"}",
					password: "${config.password || ""}",
				});
			}
			return _connection_;
		}`;

	writeFileSync(join(clientPath, "index.js"), CLIENT_BOILERPLATE + `export const ORM = {}`);
	writeFileSync(join(clientPath, "index.js"), CLIENT_BOILERPLATE + `${table_infos.join("\n")}\n${code_block.join("\n")}`);

	return "successfully created client code";
}
