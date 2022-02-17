#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { schema_boilerplate } from "./boilerplate.js"
import { program } from "commander";
import { join } from "path" ;
import migrate from "../lib/migrate.js"

program
	.name('william-orm')
	.description("Mini ORM created by William KMP for learning purposes")
	.version(`1.0.0`);

program
	.command("init")
	.description("create your norm project and schema")
	.action(() =>{
		let messages = [];
		if (!existsSync("schema")) {
			mkdirSync("schema");
			messages.push("Thank you for using NORM - Not an ORM \\(^ - ^)/");
		}
		writeFileSync(
			"schema/schema.js",
			schema_boilerplate,
		);
		messages.push("Succes generating schmea/schema.js");
		normSay(messages);
	})

program
	.command("migrate")
	.description("migrate you schema to the database and generate client code")
	.action(async () => {
		let CLIENT_SCHEMA = null;
		let messages = []
		try {
			CLIENT_SCHEMA = await import("file:///"+ join(process.cwd(), "/schema/schema.js"));
			if(CLIENT_SCHEMA){
				let response = await migrate(CLIENT_SCHEMA);
				messages.push(response);
			}else{
				messages.push(`schema not found, please run "npx norm init" to create schema file`);
			}
		} catch (error) {
			messages.push("uh oh there's an error \\(*@ _ @*)/");
			console.log(error)
		}
		normSay(messages);
	});

program.parse(process.argv);


export function normSay(strings){
	let isfirst = true;
	if(Array.isArray(strings)){
		if(strings.length === 0) return; 
		strings.forEach((message) => {
			if(isfirst){
				console.log("\n\t[NORM] : " + message);
				isfirst = false;
			}else{
				console.log(`\t         ` + message);
			}
		});
	}else{
		console.log("\n\t[NORM] : " + strings);
	}
	console.log("");
}
