const pwaAssetGenerator = require('pwa-asset-generator');
const fs = require('fs');


const DIR_PATH = './public/pwa';
const LOGO_PATH = './src/assets/Logo.svg';
const MANIFEST_PATH = './src/manifest.json';
const INDEX_HTML = `./index.html`
const PATH_OVERRIDE = "/pwa"



/**
 * remove all files in a directory
 * @param {string} dir
 * @returns {Promise<void>}
 */
async function removeFiles(dir) {
	// check if directory exists
	if (!fs.existsSync(dir)) {
		return;
	}

	const files = await fs.promises.readdir(dir);
	for (const file of files) {
		await fs.promises.unlink(`${dir}/${file}`);
	}
}


const generateAssets = async () => {
	await removeFiles(DIR_PATH);
	await pwaAssetGenerator.generateImages(
		LOGO_PATH,
		DIR_PATH,
		{
			scrape: false,
			log: false,
			opaque: false,
			darkMode: true,
			manifest: MANIFEST_PATH,
			favicon: true,
			mstile: true,
			pathOverride: PATH_OVERRIDE,
			index: INDEX_HTML,
			maskable: false,
			padding: 4,
		});
}




generateAssets()
.then(() => {
	console.log(`Successfully generated assets`)
}).catch(err => {
	console.error(`Error generating assets: ${err}`)
})