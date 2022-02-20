import { COL_SCHEMA, COLTYPE } from "./column.js";
import COL_INTERFACE from "./col_interface.js";
import {CONSTRAINT} from "./constraint.js"

export class DATA_TYPE extends COL_INTERFACE {
	#schema;

	constructor(name) {
		super();
		this.#schema = new COL_SCHEMA(name);
	}

	integer(size, width) {
		let _width = width || 255;
		let SIZE = ["TINY", "SMALL", "MED", "DEF", "BIG"];
		if (!SIZE.includes(size) || typeof size !== "string") size = "DEF";

		this.#schema.type = COLTYPE.NUMERIC;
		switch (size) {
			case "TINY":
				this.#schema.addQuery(`TINYINT(${_width})`);
				break;
			case "SMALL":
				this.#schema.addQuery(`SMALLINT(${_width})`);
				break;
			case "MED":
				this.#schema.addQuery(`MEDIUMINT(${_width})`);
				break;
			case "DEF":
				this.#schema.addQuery(`INT(${_width})`);
				break;
			case "BIG":
				this.#schema.addQuery(`BIGINT(${_width})`);
				break;
		}

		return new CONSTRAINT(this.#schema);
	}

	string(size) {
		let _size = size || 255;
		this.#schema.type = COLTYPE.STRING;

		if (0 < _size && _size <= 65535) {
			this.#schema.addQuery(`VARCHAR(${_size})`);
		} else if (65536 < _size && _size <= 16777215) {
			this.#schema.addQuery(`MEDIUMTEXT`);
		} else if (16777216 < _size && _size <= 4294967295) {
			this.#schema.addQuery(`LONGTEXT`);
		}
		return new CONSTRAINT(this.#schema);
	}

	date() {
		this.#schema.type = COLTYPE.STRING;
		this.#schema.addQuery("DATE");
		return new CONSTRAINT(this.#schema);
	}

	year() {
		this.#schema.type = COLTYPE.STRING;
		this.#schema.addQuery("YEAR");
		return new CONSTRAINT(this.#schema);
	}

	time() {
		this.#schema.type = COLTYPE.STRING;
		this.#schema.addQuery("TIME");
		return new CONSTRAINT(this.#schema);
	}

	dateTime() {
		this.#schema.type = COLTYPE.STRING;
		this.#schema.addQuery("DATETIME");
		return new CONSTRAINT(this.#schema);
	}

	_schema() {
		return this.#schema;
	}
}
