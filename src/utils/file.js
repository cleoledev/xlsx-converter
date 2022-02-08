const fs = require('fs')
const path = require('path')

const getFiles = (exports.getFiles = (dir, fileList = []) => {
	const files = fs.readdirSync(dir)
	for (const file of files) {
		if (/^\./.test(file)) continue

		const stat = fs.statSync(path.join(dir, file))
		if (stat.isDirectory()) {
			fileList = getFiles(path.join(dir, file), fileList)
		} else {
			fileList.push(path.join(dir, file))
		}
	}
	return fileList
})
