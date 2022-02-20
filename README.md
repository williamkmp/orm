# **EPEK**

EPEK is an open source Object Relational Mapper for MySQL database using [mysql2](https://github.com/sidorares/node-mysql2) npm package. <b>epek only supports module type NodeJS</b>. This project is developed to help the owner(me) to learn about MySQL, NodeJS, npm, JavaScript and GitHub.
___

## Table of contents

- [Installation](#Installation)
- [Initialize](#Initialize)
- [Schema](#Schema)
- [Migrate](#Migrate)

___

## Installation

first step in getting started using worm is to create a node project, run the script below in your terminal.

```bash
npm init
```

after that you can install worm using npm using script below, a javascript package manager bundled with NodeJS.

```bash
npm install epek --save
```

after installing config the `package.json` file in your node project byd adding the property below to enable ES6 `import`, because worm doesn't support `commonjs`.

```json
{
  "type": "module"
}
```

your `package.json` should look similar to this

```json
{
  "name": "test",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```

every command can be executed using script `npx epek`

## Initialize

After installation to initialize a worm project you can run the below script

```bash
npx epek init
```

this command will create `schema` directory with a `schema.js` file in it.

```txt
project_root
│   package.json
│   package-lock.json
└───schema
    └───schema.js
```

inside the `schema.js` is where you can write and create your database schema

```js
import { col } from "epek"

//DO NOT REMOVE OR CHANGE THIS CONST NAME but you can change the content
export const DATABASE_CONFIG = {
  host : "localhost",
  database : "william",
  user : "root",
  passowrd : ""
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
```

## Schema

writing the database schema can be doen in the `schema.js` file inside the `schema` directory. Inside this file there are two main thing a table_schema and database config.

```js
export const DATABASE_CONFIG = {
  host: "localhost",
  database: "database_name",
  user: "root",
  passowrd: "password",
};
```

The `DATABASE_CONFIG` is an object that hold information for the connection to your database. the database config must be there and cannot be name anythong other than `DATABASE_CONFIG`.

```js
export const table_name_1 = [
  col("col_name_1").integer().primary().increment(),
  col("col_name_2").string().notnull().unique(),
  col("col_name_3").integer("TINY").unsigned(),
];

export const table_name_2 = [
  col("col_name_1").integer().primary().increment(),
  col("fro_key").integer().references("table_name_1").on("col_name_1"),
  col("col_name_3").dateTime(),
];
```

a schema is the representation of your table, for example the above schema will be turned into below table

```sql
CREATE TABLE `table_name_1`(
  col_name_1 INT(255) AUTO_INCREMENT,     
  col_name_2 VARCHAR(255) NOT NULL UNIQUE,
  col_name_3 TINYINT(255) UNSIGNED,       
  PRIMARY KEY (`col_name_1`)
);
CREATE TABLE `table_name_2`(
  col_name_1 INT(255) AUTO_INCREMENT,
  fro_key INT(255),
  col_name_3 DATETIME,
  PRIMARY KEY (`col_name_1`),
  FOREIGN KEY (`fro_key`) REFERENCES table_name_1(`col_name_1`)
);
```

to create more table just add more schema.

## Migrate

to migrate the schema we can run below script

```bash
npx epek migrate
```

this script will reset your database and migrate your schema
