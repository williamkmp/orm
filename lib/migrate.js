async function migrate(database, schemas){
    let creates = [];
    let downs = [];

    for(let name in schemas){
        let schema = schemas[name];
        creates.push(schema.create);
		downs.push(schema.down);
    }

    console.log(creates.join("\n"));
    try {
        await database.execute("SET foreign_key_checks=0;");
        downs.forEach(async (script) =>{
            await database.execute(script)
        })
        await database.execute("SET foreign_key_checks=1;");
        creates.forEach(async (script) => {
			await database.execute(script);
		});

    } catch (error) {
        console.log("[SERVER] - fail to migrate");
        console.log(error)
    }

}
export default migrate;