import { TABLE } from "../table/table.js";
import { constFormat } from "../util/util.js";

export function generateORM(table_object){
    let output_string; 
    if(table_object instanceof TABLE){
        
        //create function string
        let ORM_methods = [];
        ORM_methods.push(ORMgetFunction(table_object));
        output_string = `export const ${constFormat(table_object.name)} = {\n${ORM_methods.join("\n")}\n}`;
    }
    return output_string;
}

function ORMgetFunction(table_object){
    let output_string;
	if (table_object instanceof TABLE) { 
		output_string = 
        `get : async (query, skip, limit) => {
            let db = await _connection();
            let _query = \`SELECT * FROM ${table_object.name}\`;
            let response = [];
            try{
                let [rows, fields] = await db.execute(_query);
                if(rows) response = rows;
            } catch (error){
                //nothinhg
            } finally{
                await db.end();
                return response;
            }
        }`;
	}
    return output_string;
} 