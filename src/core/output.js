const _ = require('lodash')
const path = require('path')
const fse = require('fs-extra')

const { OUTPUT_DIR_JSON, OUTPUT_DIR_STATIC } = require('../config/path')

exports.json = (data, _filename, _dirname = '') => {
	const fileName = getOutputName(_filename, data)
	const folder = getOutputName(_dirname, data)
	const outputDir = path.join(__dirname, '../..', OUTPUT_DIR_JSON, folder)
	const outputFilePath = path.join(outputDir, `${fileName}.json`)

	fse.outputJSONSync(outputFilePath, data)
	console.log(`✅ Output File: ${outputFilePath}`)
}

exports.static = (data, file, dirname) => {
	const folder = getOutputName(dirname, data)
	const outputFilePath = path.join(
		__dirname,
		'../..',
		OUTPUT_DIR_STATIC,
		folder,
		file.base
	)

	fse.copySync(file.path, outputFilePath)
	console.log(`✅ Output File: ${outputFilePath}`)
}

function getOutputName(_name, data) {
	const regex = /^\{(.*)\}$/
	const matchDataVar = _name.match(regex)
	const name = matchDataVar ? _.get(data, matchDataVar[1]) : _name

	return name.toString()
}
