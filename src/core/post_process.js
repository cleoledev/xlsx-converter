const _ = require('lodash')
// const path = require('path')
// const regex = require('../utils/fileRegex')
// const { INPUT_SRC_DIR, OUTPUT_DIR_STATIC } = require('../config/path')
// const { getFiles } = require('../utils/file')
// const ULID = require('ulid')

// const resolve = (dir) => path.join(__dirname, '../..', dir)

// const cache = (exports.post_process_data = [])
const cache = (exports.post_process_data = new Map([
	[
		'職缺連結',
		{
			data: [],
			filename: 'jobs',
			dirname: ''
		}
	]
]))

exports.post_process = new Map([
	[
		'職缺連結',
		{
			process: ({ list }) => {
				const formatted = list.reduce((result, item, idx) => {
					const hasRegion = result.find((o) => o.name === item.region)

					if (hasRegion) {
						hasRegion.zips.push(_.pick(item, ['name', 'url']))
					} else {
						result.push({
							name: item.region,
							zips: [_.pick(item, ['name', 'url'])]
						})
					}

					return result
				}, [])
				_.set(cache.get('職缺連結'), 'data', formatted)
			}
		}
	]
])
