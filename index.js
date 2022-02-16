import getConnection from "./lib/connection.js";
import migrate from "./lib/migrate.js"
import {column, schema} from "./lib/schema.js"

export default async function database({host, database, user, password, schema}){
	let SCHEMA = schema || null;
	let connection = await getConnection({ host, database, user, password });
    
	if(schema !== null && connection !== undefined){
		await migrate(connection, SCHEMA);
		connection.end();
	}
}

export const col = column;

export const table = schema;



