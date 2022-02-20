import mysql from "mysql2/promise";

let connection = null;
export default async function getConnection({host, database, user, password}) {
	if (connection === null) {
		connection = await mysql.createConnection({
			host: host || "loacalhost",
			database: database || "",
			user: user || "root",
			password: password || "",
		});
	}
	return connection;
}
