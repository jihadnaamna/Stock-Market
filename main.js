let table = null
const shareData = []
for (const [key, value] of Object.entries(shareValue)) {
	let percentage = ((100 * (value[3] - value[2])) / value[2]).toFixed(2)
	shareData.push({
		key,
		name			: value[0],
		sign			: value[1],
		num				: key,
		sector		: sectors[key] ? sectors[key][1] : 'אין',
		open_val	: value[2],		
		close_val	:	value[3],
		change		: percentage,
		arrow			: percentage > 0 ? 'up' : 'down'
	})
}

$(document).ready(() => {
	table = $('#datatable').DataTable({
		data: shareData,
		columns: [
			{ data: 'name' },
			{ data: 'sign' },
			{ data: 'num' },
			{ data: 'sector' },
			{ data: 'open_val' },
			{ data: 'close_val' },
			{ data: 'change' },
			{ data: 'arrow' }
		],
		columnDefs: [
			{
				targets: 7,
				data: 'arrow',
				render: function(data, type, row, meta) {
					return `<img src="${data}-arrow.png" width="20">`
				}
			}
		],
		initComplete: function () {
			const api = this.api()
			const $select = $('#filterBySector')
			const set = new Set
			for (const { sector } of shareData) set.add(sector)
			for (const sector of set) $('#filterBySector').append(`<option value="${sector}">${sector}</option>`)
			$select.on('change', function () {
				api.columns(3).search($(this).val()).draw()
			})
		}
	})


	$.fn.dataTable.ext.search.push(
    function( settings, data, dataIndex ) {
			const val = $('input[type=radio][name="up-down"]:checked').val()
			const percentage = ((100 * (data[5] - data[4])) / data[4]).toFixed(2) 
			if (val == 'up') {
				return percentage > 0
			}
			else if (val == 'down') {
				return percentage < 0
			}
			else if (val == 'dramatyChange') {	
				return Math.abs(data[6]) >= 0.1
			}
			else {
				return true
			}
		}
	)

	$('input[type=radio][name="up-down"]').on('change', function() {
		table.draw()
	})
})


