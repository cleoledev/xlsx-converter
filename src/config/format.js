// const dayjs = require('dayjs')
// const { CATEGORY } = require('./mappings')

module.exports = new Map([
	[
		'職缺連結',
		(key, value) => {
			switch (key) {
				case 'url':
					return value.trim()
				default:
					return value
			}
		}
	]
	// [
	// 	'2021半導體特輯_職缺列表',
	// 	(key, value) => {
	// 		switch (key) {
	// 			case 'custno':
	// 				return +value
	// 			default:
	// 				return value
	// 		}
	// 	}
	// ],
	// [
	// 	'2021半導體特輯_高階觀點文章格式',
	// 	(key, value) => {
	// 		switch (key) {
	// 			case 'update_date':
	// 				return dayjs(
	// 					new Date(Math.round((value - 25569) * 86400 * 1000))
	// 				).format('YYYY/M/DD')
	// 			default:
	// 				return value
	// 		}
	// 	}
	// ]
])
