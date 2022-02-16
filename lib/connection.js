import mysql from "mysql2/promise";

let connection = null;
export default async function getConnection() {
	if (connection === null) {
		connection = await mysql.createConnection({
			host: "localhost",
			database: "william",
			user: "root",
			password: "",
		});
		console.log("[SERVER] - created a new connection");
	}
	return connection;
}
