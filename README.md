# **EPEK**

EPEK is an open source Object Relational Mapper for MySQL database using [mysql2](https://github.com/sidorares/node-mysql2) npm package. <b>epek only supports module type NodeJS</b>. This project is developed to help the owner(me) to learn about MySQL, NodeJS, npm, JavaScript and GitHub inspired by [prismajs](https://www.prisma.io/).

## Table of contents

- [Installation](#Installation)
- [Initialize](#Initialize)
- [Schema](#Schema)
- [Migrate](#Migrate)
- [Generate](#Generate)
- [CRUD](#CRUD)

___

## Installation

___
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

___
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

___
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
___
to migrate the schema we can run below script

```bash
npx epek migrate
```

this script will reset your database and migrate your schema

## Generate
___
after creating your schema and migrating it to your database via `npx epek migrate` you can then run `npx epek generate` to create custom tailoren orm code from your schema. to use this the generated orm code you can import epek.

```js
import database from "epek";
```

you can then access methods from your table schema, for example if we create schema like this:

```js
import { col } from "epek"

//DO NOT REMOVE OR CHANGE THIS CONST NAME but you can change the content
export const DATABASE_CONFIG = {
    host : "localhost",
    database : "Database_name",
    user : "root",
    password : "password"
}

//sample table delete or replace this with your schema
export const employees = [
    col("id").integer().increment().primary(),
    col("name").string().notnull(),
    col("salary").integer("DEF").default(0)
]
```

and then run 

```bash
npx epek generate
```

in our main file we can import the epek node module and call methods

```js
import database from "epek";

async function main(){
    let resposnse = await database.EMPLOYEES.get();
    console.log(resposnse); 
}

main();
```

notice to acces the employee table and perform the `get` function, we access the `EMPLOYEE` object from the EPEK module. This object are auto generated from your schema. The name of this object follows the schema exported const table_name capitalized, removed special chars and converting spaces to underscores.

note : all the methods from the ORM is `async function`

## CRUD

___
EPEK orm provides methods to support simple CRUD (Create, Read, Update and Delete) operations. To access this methods you must have `scheme.js` which you can generate via running this command in the terminal.

```bash
npx epek init
```

after that you can modify `schema.js` and then run migrate your schema by running

```bash
npx epek migrate
```

after that you can generate the client code by running

```bash
npx epek generate
```

after all of this you can then import the orm in your application to perform simple CRUD.

```js
import database from "epek"
```

for example we have craeted the below `schema.js` and run all the above commands.

```js
import { col } from "epek"

export const DATABASE_CONFIG = {
    host : "localhost",
    database : "database_name",
    user : "root",
    password : "pass"
}

export const products = [
  col("id").integer().increment().primary(),
  col("prroduct_name").string().notnull(),
  col("quantity").integer("BIG").unsigned().notnull(),
  col("price").integer("BIG").unsigned().notnull()
];

```

### Create
to create we can use the `create method`, for example if we want to insert data to the example table we can write and run the below script.

```js
import database from "epek";

await database.PRODUCTS.create({
    prroduct_name : "juice box",
    price : 5,
    quantity : 10
})

await database.PRODUCTS.create({
    prroduct_name: "shoe",
    price: 15,
    quantity: 3,
});

await database.PRODUCTS.create({
    prroduct_name: "chiken breats",
    price: 6,
    quantity: 21,
});


database.END();
```

note : the column `id` is not listed because it is auto incremented 

### Read

to read data from table we can use the `get` method. this method arguments is an object and if we give it an empty argument it will get all the data. the argument :

```js
create args  = {
  select : { 
    /* [optional] - list of the selected col [col_name] : [boolean]*/
     },
  where : { 
    /* [optional] - list the where conditions [col_name] : [string]*/ 
    },
  orderby : { 
    /* [optional] - list the orderby conditions true for ASC false for DESC[col_name] : [boolean]*/ 
    },
  skip : 0 /* [optional] skip the first n-rows, used in conjungtion with limit for pagination*/,
  limit : 0 /*[optional] limit the read to the n-rows used in conjungtion with skip for pagination*/
}
```

for example from the given example schema to get all the data: 

```js
import database from "epek";

let res = await database.PRODUCTS.get();
console.log(res);
```

the response

```js
[
  { id: 1, prroduct_name: 'juice box', quantity: 10, price: 5 },
  { id: 2, prroduct_name: 'shoe', quantity: 3, price: 15 },
  { id: 3, prroduct_name: 'chiken breats', quantity: 21, price: 6 }
]
```

to select only the id, product_name, quantity and order it by quantity

```js
import database from "epek";

let res = await database.PRODUCTS.get({
    select : {
        id : true,
        prroduct_name : true,
        quantity : true
    },
    orderBy : {
        quantity : true
    }
});

console.log(res);

database.END();
```

the response

```js
[
  { id: 2, prroduct_name: 'shoe', quantity: 3 },
  { id: 1, prroduct_name: 'juice box', quantity: 10 },
  { id: 3, prroduct_name: 'chiken breats', quantity: 21 }
]
```

to select a certain data based on where conditions

```js
import database from "epek";

let res = await database.PRODUCTS.get({
    select : {
        id : true,
        prroduct_name : true,
        quantity : true
    },
    where : {
        quantity : `<= 10`
    },
    orderBy : {
        quantity : true
    }
});

console.log(res);

database.END();
```

the response

```js
[
  { id: 2, prroduct_name: 'shoe', quantity: 3 },
  { id: 1, prroduct_name: 'juice box', quantity: 10 }
]
```

### update

to update inserted data we can use the `update` methods this methods arguemnt is an object with below fields:

```js
update args  = {
  set : { 
    /* list of the col_name we want to update and the values [col_name] : [any]*/
     },
  where : { 
    /* [optional] - list the where conditions [col_name] : [string]*/ 
    }
}
```

for example from the eaxample schema we want to upate the `product_name` and `quantity` where the product id is `2`.

```js
import database from "epek";

console.log("BEFORE UPDATE : ")
console.log(await database.PRODUCTS.get());

await database.PRODUCTS.update({
    set : {
        prroduct_name : "UPDATED_shoe",
        quantity : 33
    },
    where : {
        id : `= 2`
    }
})

console.log(";\nAFTER UPDATE : ");
console.log(await database.PRODUCTS.get());

database.END();
```

the console :

```js
BEFORE UPDATE : 
[
  { id: 1, prroduct_name: 'juice box', quantity: 10, price: 5 },
  { id: 2, prroduct_name: 'shoe', quantity: 3, price: 15 },
  { id: 3, prroduct_name: 'chiken breats', quantity: 21, price: 6 }
];

AFTER UPDATE :
[
  { id: 1, prroduct_name: 'juice box', quantity: 10, price: 5 },
  { id: 2, prroduct_name: 'UPDATED_shoe', quantity: 33, price: 15 },
  { id: 3, prroduct_name: 'chiken breats', quantity: 21, price: 6 }
]
```

### delete

to delete data from table we can use the `delete` method which have one argument in the form of object with one field, if we pass no argument this will delete every data inside the table:

```js
update args  = {
  where : { 
    /* [optional] - list the delete where conditions [col_name] : [string]*/ 
    }
}
```

for example we want to delete product with id equals to 2.

```js
import database from "epek";

console.log("BEFORE DELETE : ")
console.log(await database.PRODUCTS.get());

await database.PRODUCTS.delete({where : {
    id : `= 2`
}})

console.log(";\nAFTER DELETE : ");
console.log(await database.PRODUCTS.get());

database.END();
```

the result :

```js
BEFORE DELETE : 
[
  { id: 1, prroduct_name: 'juice box', quantity: 10, price: 5 },
  { id: 2, prroduct_name: 'UPDATED_shoe', quantity: 33, price: 15 },
  { id: 3, prroduct_name: 'chiken breats', quantity: 21, price: 6 }
];

AFTER DELETE : 
[
  { id: 1, prroduct_name: 'juice box', quantity: 10, price: 5 },
  { id: 3, prroduct_name: 'chiken breats', quantity: 21, price: 6 }
]
```
