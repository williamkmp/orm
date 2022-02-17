import getConnection from "./connection.js";
import {TABLE_SCHEMA} from "./schema.js";

async function migrate(client_schema){
    let databaseConfig = client_schema.DATABASE_CONFIG;
    let database = await getConnection(databaseConfig);
    let creates = [];
    let downs = [];

    for(let name in client_schema){
        let schema = client_schema[name];
        if(schema instanceof TABLE_SCHEMA){
            creates.push(schema.create);
            downs.push(schema.down);
        }
    }

    try {
        await database.execute("SET foreign_key_checks=0;");
        downs.forEach(async (script) =>{
            await database.execute(script)
        })
        creates.forEach(async (script) => {
			await database.execute(script);
		});
        await database.execute("SET foreign_key_checks=1;");

    } catch (error) {
        return("sorry error to migrate \\(- _ -')/");
    }
    database.end();
    return("success to migrate schema to database \\(^ - ^)/");
}
export default migrate;