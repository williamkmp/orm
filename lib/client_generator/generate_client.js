import { writeFileSync, mkdirSync, rmSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { generateORM } from "./orn_generator.js";
import { TABLE } from "../table/table.js";
import prettier from 'prettier';


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
		}
		
		export async function END(){
			let db = await _connection();
			await db.end()
			return;
		}
		
		export async function START(){
			await _connection();
			return;
		}
		`;

	let CLIENT_CODE = `${CLIENT_BOILERPLATE} \n ${table_infos.join("\n\n")} \n ${code_block.join("\n\n")}`;
	writeFileSync(
		join(clientPath, "index.js"),
		prettier.format(CLIENT_CODE, { useTabs: true, tabWidth: 4, parser: "babel" }),
	);

	return "successfully created client code";
}
