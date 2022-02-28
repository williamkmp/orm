import { TABLE } from "../table/table.js";
import { constFormat } from "../util/util.js";
import { COL_SCHEMA } from "../column/column.js";

export function generateORM(table_object) {
	let output_string;
	if (table_object instanceof TABLE) {
		//create function string
		let ORM_methods = [];
		ORM_methods.push(ORMgetFunction(table_object));
		ORM_methods.push(ORMcreateFunction(table_object));
        ORM_methods.push(ORMupdateFunction(table_object));
        ORM_methods.push(ORMdeleteFunction(table_object));
		output_string = `export const ${constFormat(table_object.name)} = {\n${ORM_methods.join(",\n")}\n}`;
	}
	return output_string;
}

function ORMgetFunction(table_object) {
	let output_string;
	if (table_object instanceof TABLE) {
		output_string = `get : async function (query) {
            let _db = await _connection();
            let _query = \`SELECT * FROM ${table_object.name}\`;
            let response;
            
            if(query){
                if(query.select){
                    let _selectQuery = [];
                    for(let col_name in query.select){
                        _selectQuery.push(\`\$\{col_name\}\`)
                    }
                    _selectQuery = _selectQuery.join(", ");
                    _query = \`SELECT \$\{_selectQuery\} FROM ${table_object.name}\`;
                }

                if(query.where){
                    let _whereQuery = []
                    for (let col_name in query.where){
                        _whereQuery.push(\`\$\{col_name\} \$\{query.where[col_name]\}\`);
                    }
                    _query += \` WHERE \$\{_whereQuery.join(" AND ")\}\`;
                }

                if(query.orderBy){
                    let _orderByQuery = [];
                    for(let col_name in query.orderBy){
                        let o = query.orderBy[col_name] ? \`\$\{col_name\} ASC\` : \`\$\{col_name\} DESC\`;
                        _orderByQuery.push(o)
                    }
                    _query += \` ORDER BY \$\{_orderByQuery.join(", ")\}\`
                }

                if(query.skip || query.limit){
                    let _skipQuery = skip || 0;
                    let _limitQuery = limit || 0;
                    _query += \` LIMIT\$\{_skipQuery\},\$\{_limitQuery\}\`;
                }
            }

            try{
                _query += ";";
                let [rows, fields] = await _db.execute(_query);
                if(rows) response = rows;
            } catch (error){
                response = error;
            } finally{
                return response;
            }
        }`;
	}
	return output_string;
}

function ORMcreateFunction(table_object) {
	let output_string;
	if (table_object instanceof TABLE) {
		let params = []; //string []
		table_object.columns.forEach((col_schema) => {
			if (col_schema instanceof COL_SCHEMA) {
				if (!col_schema.isIncremneted) params.push(col_schema.name);
			}
		});

		let questions = [];
		params.forEach((col) => {
			questions.push("?");
		});
		output_string = `create : async function ({${params.join(", ")}}){
            let _db = await _connection();
            let response = {};
            let _query = \`INSERT INTO ${table_object.name} (${params.join(", ")}) VALUES (${questions.join(", ")})\`;
            try{
                _query += ";";
                await _db.execute(_query, [${params.join(", ")}]);
                ${
					table_object.primary
						? `let [rows, fields] = await _db.execute("SELECT * FROM ${table_object.name} WHERE ${table_object.primary.name} = (SELECT LAST_INSERT_ID())");
                           if(rows) response = rows[0];`
						: ""
				}
            }catch (error){
                response = error;
            }
            return response; 
        }`;
	}
	return output_string;
}

function ORMupdateFunction(table_object){
    let output_string;
    if(table_object instanceof TABLE){
        output_string = `update : async function (query){
            let _db = await _connection();
            let _values = []; //any []
            let _query = "UPDATE ${table_object.name}";
            let _response;

            if(query.set){
                let _setStatements = []; //string []
                for(let col_name in query.set){
                    _setStatements.push(\`\$\{col_name\} = ?\`);
                    _values.push(query.set[col_name]);
                }
                _query += \` SET \$\{_setStatements.join(", ")\}\`;
            }

            if(query.where){
                let _whereQuery = []
                for (let col_name in query.where){
                    _whereQuery.push(\`\$\{col_name\} \$\{query.where[col_name]\}\`);
                }
                _query += \` WHERE \$\{_whereQuery.join(" AND ")\}\`;
            }

            try{
                _query += ";";
                let [rows, fields] = await _db.execute(_query, _values);
                _response = rows;
            }catch(error){
                _response = error;
            }

            return _response;
        }`;
    }
    return output_string;
}

function ORMdeleteFunction(table_object) {
	let output_string;
	if (table_object instanceof TABLE) {
		output_string = `delete : async function ({where = null}){
            let _db = await _connection();
            let _values = []; //any []
            let _query = "DELETE FROM ${table_object.name}";
            let _response;

            if(where){
                let _whereQuery = []
                for (let col_name in where){
                    _whereQuery.push(\`\$\{col_name\} \$\{where[col_name]\}\`);
                }
                _query += \` WHERE \$\{_whereQuery.join(" AND ")\}\`;
            }
            
            try{
                _query += ";";
                let [rows, fields] = await _db.execute(_query, _values);
                _response = rows;
            }catch(error){
                _response = error;
            }

            return _response;
        }`;
	}
	return output_string;
}
