import mysql from "mysql2/promise";

let _connection_ = null;
async function _connection() {
	if (_connection_ === null) {
		_connection_ = await mysql.createConnection({
			host: "localhost",
			database: "database_name",
			user: "root",
			password: "password",
		});
	}
	return _connection_;
}

export let ORM = {
    name : "Hi from epek"
};