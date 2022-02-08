const BOOKS = (module.exports = new Map())

BOOKS.set('職缺連結', {
	output: '',
	file_name: 'jobs',
	sheets: new Map([
		[
			'工作表1',
			{
				type: 'list',
				prop: 'list',
				header: ['region', 'name', 'url']
			}
		]
	])
})
