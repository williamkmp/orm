import { writeFileSync, mkdirSync, rmSync } from "fs";
import { dirname, join} from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export function generateClient(config, tableSchemas) {
    let clientPath = join(__dirname, "../client");
    rmSync(clientPath, {recursive: true, force: true});
    mkdirSync(clientPath);

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

export let ORM = {
    name : "Hi from epek"
};`;


    writeFileSync(join(clientPath, "index.js"), CLIENT_BOILERPLATE);

    return "successfully created client code";
}

