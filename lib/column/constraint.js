import { COLTYPE, COL_SCHEMA } from "./column.js";
import COL_INTERFACE from "./col_interface.js";

export class CONSTRAINT extends COL_INTERFACE {
	#schema;

	constructor(schema) {
		super();
		if (schema instanceof COL_SCHEMA) {
			this.#schema = schema;
		}
	}

	unique() {
		this.#schema.addQuery("UNIQUE");
		return this;
	}

	notnull(){
		this.#schema.addQuery("NOT NULL");
		return this;
	}

	unsigned() {
		this.#schema.addQuery("UNSIGNED");
		return this;
	}

	increment() {
		this.#schema.addQuery("AUTO_INCREMENT");
		return this;
	}

	default(value) {
		if (typeof value === "number") this.#schema.addQuery(`DEFAULT ${value}`);
		if (typeof value === "string") this.#schema.addQuery(`DEFAULT "${value}"`);
		return this;
	}

	primary() {
		this.#schema.isPrimary = true;
		return this;
	}

	references(table_name) {
		this.#schema.isForeign = true;
		this.#schema.referenceTableName = table_name;
		return new FORKEY(this.#schema);
	}

	_schema() {
		return this.#schema;
	}
}

class FORKEY extends COL_INTERFACE {
	#schema;

	constructor(schema) {
		super();
		if (schema instanceof COL_SCHEMA) this.#schema = schema;
	}

	on(col_name) {
		this.#schema.referenceTableCol = col_name;
		return new CONSTRAINT(this.#schema);
	}

	_schema() {
		return this.#schema;
	}
}
