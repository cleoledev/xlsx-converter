const XLSX = require('xlsx')
const FORMATTER = require('../config/format')

const _ = require('lodash')
const path = require('path')
const output = require('./output')
const regex = require('../utils/fileRegex')
const { getFiles } = require('../utils/file')
const {
	convertVerticalTable,
	convertListTable,
	convertHorizontalTable
} = require('./converter')
const { post_process } = require('./post_process')

exports.process_book = (config) => {
	const wb = XLSX.readFile(config.src_path)
	const data = [...config.sheets.entries()].reduce(
		(result, [sheetName, sheetInfo]) => {
			const ws = wb.Sheets[sheetName]
			const rawData = XLSX.utils.sheet_to_json(ws, { header: sheetInfo.header })
			const header = rawData[0]
			const body = rawData.slice(1)
			const formatter = FORMATTER.get(config.book)

			let convertedData
			if (sheetInfo.type === 'list') {
				convertedData = convertListTable(body, sheetInfo.prop, formatter)
			} else if (sheetInfo.type === 'vertical') {
				convertedData = convertVerticalTable(body, header, formatter)
			} else if (sheetInfo.type === 'horizontal') {
				convertedData = convertHorizontalTable(body, sheetInfo.keys, formatter)
			}

			return {
				...result,
				...convertedData
			}
		},
		{}
	)

	if (config.static) {
		process_static(config, data)
	}
	post_process.get(config.book) && post_process.get(config.book).process(data)

	const outputFileName = config.file_name || config.book
	const outputDirName = config.output || ''
	output.json(data, outputFileName, outputDirName)

	return data
}

const process_static = (config, data = {}) => {
	const { dir } = path.parse(config.src_path)
	const files = getFiles(dir)
		.filter((file) => !file.match(regex.xlsx))
		.map((file) => ({ ...path.parse(file), path: file }))

	for (let file of files) {
		const fileConfig = config.static.get(file.name)

		if (fileConfig) {
			_.set(data, fileConfig.insert, file.base)
			output.static(data, file, fileConfig.output)
		} else {
			console.log('❌ No matching data with static file:', file.path)
		}
	}
}
