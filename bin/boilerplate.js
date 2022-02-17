export const schema_boilerplate = 
`import { col } from "@williamkmp/w-orm"

//DO NOT REMOVE OR CHANGE THIS CONST NAME but you can change the content
export const DATABASE_CONFIG = {
    host : "localhost",
    database : "database_name",
    user : "root",
    passowrd : "password"
}

//sample table delet or replace this with your schema
export const table = [
    col("colName").integer().increment().primary(),
    col("colName2").string().notnull()
];
`;