const { spawn } = require("child_process");

const action = process.argv[2];
const package = process.argv[3];

//rest args
const restArgs = process.argv.slice(4);



if (action && package) {
	const command = spawn(`${/^win/.test(process.platform) ? 'pnpm.cmd' : 'pnpm'}`, [action, `--filter=@app/${package}`, ...restArgs]);

	command.stdout.on("data", data => {
		process.stdout.write(data.toString())
	});

	command.stderr.on("data", data => {
		process.stdout.write(data.toString())
	});

	command.on('error', (error) => {
		console.error(error.message.toString());
	});

	command.on("close", code => {
		console.log(`child process exited with code ${code}`);
	});

} else {
	console.log("Usage: node build.js <action> <package>");
	console.log("Actions: build, install, uninstall");
	console.log("Packages: client, server, all");
	process.exit();
}