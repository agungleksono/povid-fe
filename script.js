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

		// show detail record
		const modalDetailBtn = document.querySelectorAll('.modal-detail-btn');
		modalDetailBtn.forEach(btn => {
			btn.addEventListener('click', function() {
				const recordid = this.dataset.recordid;
				console.log(recordid);
				fetch('https://povid.herokuapp.com/api/v1/records/' + recordid)
					.then(response => response.json())
					.then(record => {
						const detail = record.data;
						const recordDetail = showRecordDetail(detail);
						const modalBody = document.querySelector('.modal-detail-body');
						modalBody.innerHTML = recordDetail;
					});
			})
		})
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
				class="btn waves-effect waves-light btn-info btn-outline-info modal-detail-btn" data-recordid="${record.id}" data-toggle="modal" data-target="#recordDetailModal"><i
					class="icofont icofont-edit-alt"></i>Detail</button>
			<button
				class="btn waves-effect waves-light btn-success btn-outline-success"><i
					class="icofont icofont-edit-alt"></i>Edit</button>
			<button
				class="btn waves-effect waves-light btn-danger btn-outline-danger"><i
					class="icofont icofont-delete-alt"></i>Hapus</button>

		</td>
	</tr>
	`
}

function showRecordDetail(detail) {
	return `
	<div class="container-fluid">
		<div class="form-group">
			<label for="full_name">Name</label>
			<input type="full_name" value="${detail.full_name}" class="form-control form-control-sm" id="full_name" disabled>
		</div>
		<div class="form-group">
			<label for="gender">Gender</label>
			<input type="gender" value="${detail.gender == 1 ? 'Laki-Laki' : detail.gender == 2 ? 'Perempuan' : 'Undefined'}" class="form-control form-control-sm" id="gender" disabled>
		</div>
		<div class="form-group">
			<label for="place_of_birth">Place of Birth</label>
			<input type="place_of_birth" value="${detail.place_of_birth}" class="form-control form-control-sm" id="place_of_birth" disabled>
		</div>
		<div class="form-group">
			<label for="date_of_birth">Date of Birth</label>
			<input type="text" value="${detail.date_of_birth}" class="form-control form-control-sm date-format" id="date_of_birth" disabled>
		</div>
		<div class="form-group">
			<label for="city_origin">City origin</label>
			<input type="city_origin" value="${detail.city_origin}" class="form-control form-control-sm" id="city_origin" disabled>
		</div>
		<div class="form-group">
			<label for="kelas_id">Kelas</label>
			<input type="kelas_id" value="${detail.kelas.name}" class="form-control form-control-sm" id="kelas_id" disabled>
		</div>
		<div class="form-group">
			<label for="kelas_id">Prodi</label>
			<input type="kelas_id" value="${detail.prodi.name}" class="form-control form-control-sm" id="kelas_id" disabled>
		</div>
		<div class="form-group">
			<label for="kelas_id">Jurusan</label>
			<input type="kelas_id" value="${detail.jurusan.name}" class="form-control form-control-sm" id="kelas_id" disabled>
		</div>
		<div class="form-group">
			<label for="confirmed_date">Confirmed Date</label>
			<input type="text" value="${detail.confirmed_date}" class="form-control form-control-sm date-format" id="confirmed_date" disabled>
		</div>
		<div class="form-group">
			<label for="status">Status</label>
			<input type="text" value="${detail.status == 1 ? 'Positif' : detail.status == 2 ? 'Sembuh' : detail.status == 3 ? 'Meninggal' : 'Undefined'}" class="form-control form-control-sm date-format" id="confirmed_date" disabled>
		</div>
	</div>
	`
}