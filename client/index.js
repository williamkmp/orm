import mysql from "mysql2/promise";

let _connection_ = null;
async function _connection() {
	if (_connection_ === null) {
		_connection_ = await mysql.createConnection({
			host: `${config.host || "loacalhost"}`,
			database: `${config.database || ""}`,
			user: `${config.user || "root"}`,
			password: `${config.password || ""}`,
		});
	}
	return _connection_;
}

export let ORM = {
	message: "Hi from epek",
};