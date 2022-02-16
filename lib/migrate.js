import getConnection from "./connection.js";
import userSchema from "../schemas/userSchema.js";

async function migrate(){
    let database = await getConnection();
    let schemas = [userSchema];
    
    let creates = [];
    let downs = [];
    schemas.forEach((schema)=>{
        creates.push(schema.create);
        downs.push(schema.down);
    });

    try {
        await database.execute("SET foreign_key_checks=0;");
        await database.execute(downs.join("\n"));
        await database.execute("SET foreign_key_checks=1;");
        await database.execute(creates.join("\n"));
    } catch (error) {
        console.log("[SERVER] - fail to migrate");
    }

}
export default migrate;