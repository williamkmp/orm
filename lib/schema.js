import fs from "fs";

export function schema(name, colArr) {
	let table_schema = createStructure(colArr);
	let SCHEMA = {
		name: null,
		create: null,
		down: null,
	};
	SCHEMA.name = name;
	SCHEMA.create = `CREATE TABLE ${name} (\n\t${table_schema}\n);`;
	SCHEMA.down = `DROP TABLE IF EXISTS ${name};`;
	return SCHEMA;
}



export function column(name) {
	return new COL(name);
}

function createStructure(table) {
	let constraints = [];
	let columns = [];
	if (Array.isArray(table)) {
		table.forEach((column) => {
			columns.push(column.Z_());
			if (column.Z__() !== "") constraints.push(column.Z__());
		});
	}
	let table_schema = [...columns, ...constraints].join(",\n\t");
	return table_schema;
}

class COLUMN {
	name;
	query;
	constraint;

	add(string) {
		if (this.query === "") {
			this.query += string;
		} else {
			this.query += " " + string;
		}
	}

	addCons(string) {
		if (this.constraint === "") {
			this.constraint += string;
		} else {
			this.constraint += " " + string;
		}
	}

	constructor(name) {
		this.query = `\`${name}\``;
		this.constraint = "";
		this.name = name;
	}
}

class base {
	Z_() {
		return "";
	}

	Z__() {
		return "";
	}


}

class COL extends base {
	#column;
	Z_() {
		return this.#column.query;
	}
	Z__() {
		return this.#column.constraint;
	}

	constructor(name) {
		super();
		this.#column = new COLUMN(name);
	}

	string(size) {
		let num = size || 255;
		this.#column.add(`VARCHAR(${num})`);
		return new CONSTRAINT(this.#column);
	}

	integer(size) {
		let num = size || 255;
		this.#column.add(`INT(${num})`);
		return new CONSTRAINT(this.#column);
	}

	boolean() {
		this.#column.add(`BOOLEAN`);
		return new CONSTRAINT(this.#column);
	}
}

class CONSTRAINT extends base {
	#column;
	Z_() {
		return this.#column.query;
	}
	Z__() {
		return this.#column.constraint;
	}

	constructor(column) {
		super();
		if (column instanceof COLUMN) {
			this.#column = column;
		}
	}

	primary() {
		this.#column.addCons(`PRIMARY KEY (\`${this.#column.name}\`)`);
		return this;
	}

	notnull() {
		this.#column.add(`NOT NULL`);
		return this;
	}

	unique() {
		this.#column.add(`UNIQUE`);
		return this;
	}

	increment() {
		this.#column.add("AUTO_INCREMENT NOT NULL");
		return this;
	}

	reference(table_name) {
		this.#column.addCons(`FOREIGN KEY (\`${this.#column.name}\`) REFRENCES \`${table_name}\``);
		return new FOREIGNKEY(this.#column);
	}
}

class FOREIGNKEY extends base {
	#column;
	Z_() {
		return this.#column.query;
	}
	Z__() {
		return this.#column.constraint;
	}

	constructor(column) {
		super();
		if (column instanceof COLUMN) {
			this.#column = column;
		}
	}

	on(field_name) {
		this.#column.addCons(`(\`${field_name}\`)`);
		return new CONSTRAINT(this.#column);
	}
}
