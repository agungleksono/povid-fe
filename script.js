fetch('https://povid.herokuapp.com/api/v1/records')
	.then(response => response.json())
	.then(response => {
		const records = response.data.data;
		let table_records = '';
		let num = 0;

		records.forEach(record => {
			num++
			table_records += showTableRecord(record, num)
		});
		const recordContainer = document.querySelector('.record-container');
		recordContainer.innerHTML = table_records;
	})
	.catch(err => console.log('Request Failed', err));


function showTableRecord(record, num) {
	return `
	<tr>
		<th scope="row">${num}</th>
		<td>${record.full_name}</td>
		<td>${record.jurusan.name}</td>
		<td>
			<button
				class="btn waves-effect waves-light btn-warning btn-outline-warning"><i
					class="icofont icofont-edit-alt"></i>Edit</button>
			<button
				class="btn waves-effect waves-light btn-danger btn-outline-danger"><i
					class="icofont icofont-delete-alt"></i>Hapus</button>

		</td>
	</tr>
	`
}