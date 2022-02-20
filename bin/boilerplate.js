export const schema_boilerplate = `import { col } from "epek"

//DO NOT REMOVE OR CHANGE THIS CONST NAME but you can change the content
export const DATABASE_CONFIG = {
    host : "localhost",
    database : "database_name",
    user : "root",
    password : "password"
}

//sample table delete or replace this with your schema
export const table_name_1 = [
    col("col_name_1").integer().primary().increment(),
    col("col_name_2").string().notnull().unique(),
    col("col_name_3").integer("TINY").unsigned()
];

export const table_name_2 = [
	col("col_name_1").integer().primary().increment(),
	col("fro_key").integer().references("table_name_1").on("col_name_1"),
	col("col_name_3").dateTime()
];
`;

