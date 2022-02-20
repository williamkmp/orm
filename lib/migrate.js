import getConnection from "./connection.js";
import COL_INTERFACE from "./column/col_interface.js"
import { TABLE } from "./table/table.js";

export default async function migrate(client_schema) {
	let [database_config, table_list] = parseClientSchema(client_schema);
	let connection = await getConnection(database_config);
	let drop_queries = await getDropQueries(connection);
	let create_queries = getCreateQueries(table_list);

	let response = await migrateDatabase(connection, drop_queries, create_queries);

	await connection.end();
	return response;
}

export function parseClientSchema(client_schema) {
	let DATABASE_CONFIG = client_schema.DATABASE_CONFIG; // object {} for getConnection({})
	let TABLES = []; // class TABLE [] from "/lib/table/table.js"
	for (let schema_name in client_schema) {
		let object = client_schema[schema_name];
		if (Array.isArray(object)) {
			let newTable = new TABLE(schema_name, object);
			TABLES.push(newTable);
		}
	}
	return [DATABASE_CONFIG, TABLES];
}

async function getDropQueries(connection) {
	let drop_queries = []; // string []
	try {
		let [rows, fields] = await connection.execute(`SHOW TABLES;`);
		rows.forEach((row) => {
			for (let header in row) {
				drop_queries.push(`DROP TABLE IF EXISTS \`${row[header]}\`;`);
			}
		});
	} catch (error) {
		return null;
	} finally {
		return drop_queries;
	}
}

function getCreateQueries(table_list) {
	let create_queries = []; // string []
	if (Array.isArray(table_list)) {
		table_list.forEach((table) => {
			if (table instanceof TABLE) {
				create_queries.push(table.query);
			}
		});
	}
	return create_queries;
}

async function migrateDatabase(connection, drop_queries, create_queries) {
	try {
		await connection.execute("SET foreign_key_checks=0;");
		drop_queries.forEach(async (script) => {
			await connection.execute(script);
		});
		create_queries.forEach(async (script) => {
			await connection.execute(script);
		});
		await connection.execute("SET foreign_key_checks=1;");
	} catch (error) {
		return "There is an error when migrating \\(-_-*)/";
	} finally {
		return "Success migrating  \\(^ - ^)/";
	}
}
