#!/usr/bin/node

import fs from "fs";

fs.writeFile(`${__dirname}/schema/`, "Learn Node FS module", function (err) {
	if (err) throw err;
	console.log("File is created successfully.");
});
