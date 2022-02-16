import mysql from "mysql2/promise";

let connection = null;
export default async function getConnection({host, database, user, password}) {
	let HOST = host || "localhost";
	let DB_NAME = database || "";
	let USER = user || "root";
	let PASSWORD = password || "";
	if (connection === null) {
		connection = await mysql.createConnection({
			host: HOST,
			database: DB_NAME,
			user: USER,
			password: PASSWORD,
		});
	}
	return connection;
}
