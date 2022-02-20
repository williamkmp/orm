import COL_INTERFACE from "../column/col_interface.js";
import { COL_SCHEMA } from "../column/column.js";

export class TABLE {
	name = ""; //  : string
	primary = undefined; //: class COL_DATA
	columns = []; //: class COL_DATA []
	query = ""; // : string

	constructor(name, schemas) {
		this.name = name;

		//making the create table query
		let queries = []; // : string[]
		let primary_query; //: string;
		let foreign_fields = []; // string[]
		if (Array.isArray(schemas)) {

			schemas.forEach((schema) => {
				if (schema instanceof COL_INTERFACE) {
					let col = schema._schema();
					this.columns.push(col);
					if (col instanceof COL_SCHEMA) {
						queries.push(col.query);

						//PRIMARY KEY
						if (col.isPrimary && !this.primary) {
							this.primary = col;
							primary_query = `PRIMARY KEY (\`${col.name}\`)`;
						}
						//ADD FOREIGN KEY
						else if (col.isForeign) {
							foreign_fields.push(
								`FOREIGN KEY (\`${col.name}\`) REFERENCES ${col.referenceTableName}(\`${col.referenceTableCol}\`)`,
							);
						}
					}
				}
			});
		}

		if(primary_query) queries.push(primary_query);
		foreign_fields.forEach((query) =>{
			queries.push(query)
		})

		this.query = `CREATE TABLE \`${name}\`(\n\t${queries.join(",\n\t")}\n);`

	}

	#getColNames(){
		let colNames = [];
		this.columns.forEach((column_schema) => {
			if (column_schema instanceof COL_SCHEMA) {
				colNames.push(column_schema.name);
			}
		});
		return colNames;
	}

	generateGetFunction(){
		let paramList = this.#getColNames();
		
		let getfunction = 
		`async function (${paramList.join(", ")}) =>{
			
		}`;
		return getfunction; 
	}
}
