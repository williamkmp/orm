export function normSay(strings) {
	let isfirst = true;
	if (Array.isArray(strings)) {
		if (strings.length === 0) return;
		strings.forEach((message) => {
			if (isfirst) {
				console.log("\n\t[EPEK] : " + message);
				isfirst = false;
			} else {
				console.log(`\t         ` + message);
			}
		});
	} else {
		console.log("\n\t[EPEK] : " + strings);
	}
	console.log("");
}

export function constFormat(name){
    return name.replace(" ", "_").replace(/\W/g, "").toUpperCase();
}