const fse = require('fs-extra')
const path = require('path')
// const _ = require('lodash')
const { process_book } = require('./core/process')
const { getFiles } = require('./utils/file')
const { post_process_data } = require('./core/post_process')
const output = require('./core/output')
const resolve = (dir) => path.join(__dirname, '..', dir)

const regex = require('./utils/fileRegex')
const books = require('./config/book')
const { INPUT_SRC_DIR, OUTPUT_DIR } = require('./config/path')
const sourcePath = resolve(INPUT_SRC_DIR)
const outputPath = resolve(OUTPUT_DIR)
const booksName = [...books.keys()]

console.log('✨ Cleaning up output folder: ', outputPath)
fse.removeSync(outputPath)
const files = getFiles(sourcePath)

for (let file of files) {
	// const isImage = file.match(/\.(gif|jpe?g|tiff|png|webp)$/)
	const isXlsx = file.match(regex.xlsx)

	if (isXlsx) {
		const book = booksName.find((name) => file.includes(name))
		try {
			const config = books.get(book)
			process_book({
				src_path: file,
				book,
				...config
			})
		} catch (e) {
			console.log(e)
			console.log('❌ Cannot match Book Name with', file)
		}
	}
}

for (const data of post_process_data.values()) {
	output.json(data.data, data.filename, data.dirname)
}

console.log('✨ Process Complete!')
