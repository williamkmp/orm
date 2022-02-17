import getConnection from "./connection.js";
import {schema, TABLE_SCHEMA} from "./schema.js";

export default async function migrate(client_schema){
    let databaseConfig = client_schema.DATABASE_CONFIG;
    let database = await getConnection(databaseConfig);
    let creates = [];

    for(let name in client_schema){
        let module = client_schema[name];
        if( Array.isArray(module)){
            let table = schema(name, module);
            creates.push(table.create);
        }
    }

    let message = await resetDatabase(database, creates)
    return message;
}

async function resetDatabase(connection, create_queries){
    try {
        let drop_queries = [];
        let [rows, fields] = await connection.execute(`SHOW TABLES;`);
        if (Array.isArray(rows)) {
			rows.forEach((row) => {
				for (let header in row) {
					if (row[header] !== null || row[header] !== undefined)
						drop_queries.push(`DROP TABLE IF EXISTS \`${row[header]}\`;`);
				}
			});
		}
        await connection.execute("SET foreign_key_checks=0;");
		drop_queries.forEach(async (script) => {
			await connection.execute(script);
		});
		create_queries.forEach(async (script) => {
			await connection.execute(script);
		});
		await connection.execute("SET foreign_key_checks=1;");
    } catch (error) {
        return "There is an error when migrating \\(- _ -')/";
    }finally{
        connection.end();
        return "Success migrating  \\(^ - ^)/";
    }
}