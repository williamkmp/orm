import { DATA_TYPE } from "./data_type.js";

export function createColumn(name) {
	return new DATA_TYPE(name);
}

export class COL_SCHEMA {
	constructor(field_name) {
		this.name = field_name;
		this.type = "";
		this.isPrimary = false;
		this.isForeign = false;
		this.referenceTableName = "";
		this.referenceTableCol = "";
		
		this.query = field_name;
	}

	addQuery(string) {
		if (this.query === "") {
			this.query += string;
		} else {
			this.query += " " + string;
		}
	}
}

export const COLTYPE = {
	STRING: "string",
	NUMERIC: "numeric",
	BOOLEAN: "boolean",
	BINARY: "binary",
};