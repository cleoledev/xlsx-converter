const _ = require('lodash')
exports.convertVerticalTable = (body, configHeader, formatter = null) => {
	return Object.entries(configHeader).reduce((result, [path]) => {
		for (let rowData of body) {
			let _value = _.get(rowData, path)
			if (_.isUndefined(_value)) return result

			// REPLACE PLACEHOLDER WITH EMPTY STRING
			_value = /^(\*|-)$/.test(_value) ? '' : _value
			const pathResult = _.get(result, path)
			const value = formatter ? formatter(path, _value) : _value

			if (_.isUndefined(pathResult)) {
				_.set(result, path, value)
			} else {
				if (_.isArray(pathResult)) {
					_.set(
						result,
						path,
						[...pathResult, value].filter((s) => s) // filter out empty string
					)
				} else if (_.isObject(pathResult)) {
					_.set(result, path, value)
				} else if (_.isString(pathResult)) {
					_.set(
						result,
						path,
						[].concat(pathResult, value).filter((s) => s) // filter out empty string
					)
				}
			}
		}
		return result
	}, {})
}

exports.convertListTable = (body, configProp = 'data', formatter = null) => {
	return body.reduce((acc, row) => {
		const rowData = Object.entries(row).reduce((result, [path, _value]) => {
			// REPLACE PLACEHOLDER WITH EMPTY STRING
			_value = /^(\*|-)$/.test(_value) ? '' : _value
			const value = formatter ? formatter(path, _value) : _value
			const [prop, nestedProp] = _.toPath(path)

			if (nestedProp) {
				_.set(result, [prop, '0', nestedProp], value)
			} else {
				_.set(result, [configProp, '0', prop], value)
			}

			return result
		}, {})

		_.mergeWith(acc, rowData, mergeCustomizer)
		return acc
	}, {})
}

exports.convertHorizontalTable = (body, configHeader, formatter = null) => {
	return configHeader.reduce((result, path, idx) => {
		const _value = body[idx].value
		const value = formatter ? formatter(path, _value) : _value
		_.set(result, path, value)

		return result
	}, {})
}

function mergeCustomizer(objValue, srcValue) {
	if (_.isArray(objValue)) {
		return objValue.concat(srcValue)
	}
}
