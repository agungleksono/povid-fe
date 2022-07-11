/** Function untuk get semua data */
// function getData() {
// 	fetch('https://povid.herokuapp.com/api/v1/records')
// 		.then(response => response.json())
// 		.then(response => {
// 			const records = response.data.data;
// 			let table_records = '';
// 			let num = 0;

// 			records.forEach(record => {
// 				num++
// 				table_records += showTableRecord(record, num)
// 			});
// 			const recordContainer = document.querySelector('.record-container');
// 			recordContainer.innerHTML = table_records;
// 		})
// 		.catch(err => console.log('Request Failed', err));
// }

// function getDataById(id) {
// 	fetch('https://povid.herokuapp.com/api/v1/records/' + id)
// 		.then(response => response.json())
// 		.then(record => {
// 			const data = record.data;
// 			const recordDetail = showRecordDetail(data);
// 			const modalBody = document.querySelector('.modal-detail-body');
// 			modalBody.innerHTML = recordDetail;
// 		})
// 		.catch(err => console.log('Request Failed', err));
// }

function getData() {
	return fetch('https://povid.herokuapp.com/api/v1/records')
		.then(response => response.json())
		.then(response => response.data.data)
}

async function showData() {
	const records = await getData();
	const recordContainer = document.querySelector('.record-container');
	let table_records = '';
	let num = 0;

	records.forEach(record => {
		num++
		table_records += showTableRecord(record, num)
	});
	recordContainer.innerHTML = table_records;
}

function getDetailData(id) {
	return fetch('https://povid.herokuapp.com/api/v1/records/' + id)
		.then(response => response.json())
		.then(response => response.data)
}

async function showDetailData(id) {
	const data = await getDetailData(id);
	const modalBody = document.querySelector('.modal-detail-body');
	modalBody.innerHTML = showRecordDetail(data);
}

function getStatisticData() {
	return fetch('https://povid.herokuapp.com/api/v1/records/statistics')
			.then(response => response.json())
			.then(response => response.data)
}

async function showStatistic() {
	const statistics = await getStatisticData();
	console.log(statistics)
	const statisticContainer = document.querySelector('.statistik-container');
	statisticContainer.innerHTML = showStatisticCard(statistics);
}

// Event binding
document.addEventListener('click', function(e) {
	if (e.target.classList.contains('modal-detail-btn')) {
		const record_id = e.target.dataset.recordid;
		showDetailData(record_id);
	} else if (e.target.classList.contains('modal-edit-btn')) {
		const record_id = e.target.dataset.recordid;
		getEditData(record_id);
	}
})

window.addEventListener('DOMContentLoaded', showData(), showStatistic());

/** Mengambil element dari select jurusan, prodi, dan kelas */
const selectJurusan = document.querySelector('select#jurusan');
const selectProdi = document.querySelector('select#prodi');
const selectKelas = document.querySelector('select#kelas');

function getJurusan() {
	return fetch('https://povid.herokuapp.com/api/v1/jurusans')
			.then(response => response.json())
			.then(response => response.data)
}

function getProdi(jurusanId) {
	return fetch(`https://povid.herokuapp.com/api/v1/jurusan/${jurusanId}/prodi`)
			.then(response => response.json())
			.then(response => response.data)
}

function getKelas(prodiId) {
	return fetch(`https://povid.herokuapp.com/api/v1/prodi/${prodiId}/kelas`)
			.then(response => response.json())
			.then(response => response.data)
}

async function showAddJurusan() {
	const jurusans = await getJurusan()
	selectJurusan.innerHTML = '<option selected disabled>Pilih Jurusan...</option>';
	jurusans.forEach(jurusan => {
		selectJurusan.innerHTML += `<option value="${jurusan.id}">${jurusan.name}</option>`;
	});
}

const modalAddBtn = document.querySelector('.modal-add-btn');
modalAddBtn.addEventListener('click', showAddJurusan());

selectJurusan.addEventListener('change', async event => {
	const jurusanId = event.target.value;
	const prodis = await getProdi(jurusanId);
	console.log(prodis);
	selectProdi.innerHTML = '<option selected disabled>Pilih Prodi...</option>';
	prodis.forEach(prodi => {
		selectProdi.innerHTML += `<option value="${prodi.id}">${prodi.name}</option>`
	})
})

selectProdi.addEventListener('change', async event => {
	const prodiId = event.target.value;
	const kelass = await getKelas(prodiId);
	console.log(kelass);
	selectKelas.innerHTML = '<option selected disabled>Pilih Kelas...</option>';
	kelass.forEach(kelas => {
		selectKelas.innerHTML += `<option value="${kelas.id}">${kelas.name}</option>`
	})
})

function addData() {
	let data = {
		full_name : document.getElementById('full_name').value,
		gender : document.getElementById('gender').value,
		place_of_birth : document.getElementById('place_of_birth').value,
		date_of_birth : document.getElementById('date_of_birth').value,
		city_origin : document.getElementById('city_origin').value,
		kelas_id : document.getElementById('kelas').value,
		confirmed_date : document.getElementById('confirmed_date').value,
		status : document.getElementById('status').value
	}

	fetch("https://povid.herokuapp.com/api/v1/records", {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	})
	.then(function(response) {
		return response.json()
	})
	.then(function(data) {
		console.log(data)
		alert('Data berhasil ditambahkan.')
		showData();
	})
}

/** Menampilkan data yang akan diedit ke modal */
async function getEditData(id) {
	const data = await getDetailData(id);
	const modalEditBody = document.querySelector('.modal-edit-body');
	modalEditBody.innerHTML = showEditData(data);

	const selectJurusan = document.querySelector('select#jurusanEdit');
	const selectProdi = document.querySelector('select#prodiEdit');
	const selectKelas = document.querySelector('select#kelasEdit');
	const jurusans = await getJurusan();
	const prodis = await getProdi(data.jurusan.id);
	const kelass = await getKelas(data.prodi.id);
	
	selectJurusan.innerHTML = '<option selected disabled>Pilih Jurusan...</option>';
	jurusans.forEach(jurusan => {
		selectJurusan.innerHTML += `<option value="${jurusan.id}" ${data.jurusan.id == jurusan.id ? 'selected' : ''}>${jurusan.name}</option>`;
	})
	selectProdi.innerHTML = '<option selected disabled>Pilih Prodi...</option>';
	prodis.forEach(prodi => {
		selectProdi.innerHTML += `<option value="${prodi.id}" ${data.prodi.id == prodi.id ? 'selected' : ''}>${prodi.name}</option>`;
	})
	selectKelas.innerHTML = '<option selected disabled>Pilih Kelas...</option>';
	kelass.forEach(kelas => {
		selectKelas.innerHTML += `<option value="${kelas.id}" ${data.kelas.id == kelas.id ? 'selected' : ''}>${kelas.name}</option>`;
	})

	selectJurusan.addEventListener('change', async event => {
		const jurusanId = event.target.value;
		const prodis = await getProdi(jurusanId);
		console.log(prodis);
		selectProdi.innerHTML = '<option selected disabled>Pilih Prodi...</option>';
		selectKelas.innerHTML = '<option selected disabled>Pilih Kelas...</option>';
		prodis.forEach(prodi => {
			selectProdi.innerHTML += `<option value="${prodi.id}">${prodi.name}</option>`
		})
	})

	selectProdi.addEventListener('change', async event => {
		const prodiId = event.target.value;
		const kelass = await getKelas(prodiId);
		console.log(kelass);
		selectKelas.innerHTML = '<option selected disabled>Pilih Kelas...</option>';
		kelass.forEach(kelas => {
			selectKelas.innerHTML += `<option value="${kelas.id}">${kelas.name}</option>`
		})
	})
}

// async function showEditJurusan() {
// 	const jurusans = await getJurusan()
// 	selectJurusan.innerHTML = '<option selected disabled>Pilih Jurusan...</option>';
// 	jurusans.forEach(jurusan => {
// 		selectJurusan.innerHTML += `<option value="${jurusan.id}">${jurusan.name}</option>`;
// 		selectElement.innerHTML += `<option value="${data.id}" ${userData.jurusan.id == data.id ? 'selected' : ''}>${data.name}</option>`;
// 	});
// }

function deleteConfirmation(id) {
	let confirmAction = confirm('You want to delete?');
	return confirmAction ? deleteData(id) : false;
}

function deleteData(id) {
	return fetch('https://povid.herokuapp.com/api/v1/records/' + id, {
		method: 'DELETE',
		headers: {
			'Content-type': 'application/json; charset=UTF-8'
		 },
	})
	.then(response => response.json())
	.then(data => {
		console.log(data);
		showData();
	})
	.catch(err => console.log(err))
}




// selectProdi.addEventListener('change', event => {
// 	const prodiId = event.target.value;
// 	fetch(`https://povid.herokuapp.com/api/v1/prodi/${prodiId}/kelas`)
// 		.then(response => response.json())
// 		.then(response => {
// 			const kelas = response.data;
// 			console.log(kelas);
// 			selectKelas.innerHTML = '<option selected disabled>Pilih Kelas...</option>';
// 			kelas.forEach(data => {
// 				selectKelas.innerHTML += `<option value="${data.id}">${data.name}</option>`
// 			})
// 		})
// })

// function getJurusan() {
// 	fetch('https://povid.herokuapp.com/api/v1/jurusans')
// 		.then(response => response.json())
// 		.then(response => {
// 			const jurusan = response.data;
// 			selectJurusan.innerHTML = '<option selected disabled>Pilih Jurusan...</option>';
// 			jurusan.forEach(data => {
// 				selectJurusan.innerHTML += `<option value="${data.id}">${data.name}</option>`;
// 			});
// 		});
// }


/** Ketika page di load, jalankan fungsi getData & getJurusan */
// window.addEventListener('DOMContentLoaded', getData);
// window.addEventListener('DOMContentLoaded', getJurusan);

// function getProdi(id) {
// 	fetch(`https://povid.herokuapp.com/api/v1/jurusan/${id}/prodi`)
// 		.then(response => response.json())
// 		.then(response => {
// 			const prodi = response.data;
// 			return prodi;
// 		});
// }

// async function getProdi(id) {
//     let response = await fetch(`https://povid.herokuapp.com/api/v1/jurusan/${id}/prodi`);
//     let data = await response.json();
//     return data.data;
// }

// function geKelas(id) {
// 	fetch(`https://povid.herokuapp.com/api/v1/prodi/${id}/kelas`)
// 		.then(response => response.json())
// 		.then(response => {
// 			return response.data
// 		})
// 		.catch(err => console.log(err))
// }


// function getJurusanEdit(userData, selectElement) {
// 	fetch('https://povid.herokuapp.com/api/v1/jurusans')
// 		.then(response => response.json())
// 		.then(response => {
// 			const jurusan = response.data;
// 			// console.log(selectElement);
// 			// console.log(userData)
// 			selectElement.innerHTML = '<option selected disabled>Pilih Jurusan...</option>';
// 			jurusan.forEach(data => {
// 				selectElement.innerHTML += `<option value="${data.id}" ${userData.jurusan.id == data.id ? 'selected' : ''}>${data.name}</option>`;
// 			});
// 		});
// }

// function getProdiEdit(userData, selectElement) {
// 	fetch(`https://povid.herokuapp.com/api/v1/jurusan/${userData.jurusan.id}/prodi`)
// 		.then(response => response.json())
// 		.then(response => {
// 			const prodi = response.data;
// 			selectElement.innerHTML = '<option selected disabled>Pilih Jurusan...</option>';
// 			prodi.forEach(data => {
// 				selectElement.innerHTML += `<option value="${data.id}" ${userData.prodi.id == data.id ? 'selected' : ''}>${data.name}</option>`;
// 			});
// 		});
// }

// function getKelasEdit(userData, selectElement) {
// 	fetch(`https://povid.herokuapp.com/api/v1/prodi/${userData.prodi.id}/kelas`)
// 		.then(response => response.json())
// 		.then(response => {
// 			const kelas = response.data;
// 			selectElement.innerHTML = '<option selected disabled>Pilih Jurusan...</option>';
// 			kelas.forEach(data => {
// 				selectElement.innerHTML += `<option value="${data.id}" ${userData.kelas.id == data.id ? 'selected' : ''}>${data.name}</option>`;
// 			});
// 		});
// }




// function getEditData(id) {
// 	fetch('https://povid.herokuapp.com/api/v1/records/' + id)
// 		.then(response => response.json())
// 		.then(record => {
// 			const data = record.data;
// 			const editData = showEditData(data);
// 			const modalBody = document.querySelector('.modal-edit-body');
// 			modalBody.innerHTML = editData;

// 			const selectEditJurusan = document.querySelector('select#jurusanEdit');
// 			const selectEditProdi = document.querySelector('select#prodiEdit');
// 			const selectEditKelas = document.querySelector('select#kelasEdit');

// 			getJurusanEdit(data, selectEditJurusan);
// 			getProdiEdit(data, selectEditProdi);
// 			getKelasEdit(data, selectEditKelas);
			
// 			selectEditJurusan.addEventListener('change', event => {
// 				const jurusanId = event.target.value;
// 				fetch(`https://povid.herokuapp.com/api/v1/jurusan/${jurusanId}/prodi`)
// 					.then(response => response.json())
// 					.then(response => {
// 						const prodi = response.data;
// 						console.log(prodi);
// 						selectEditProdi.innerHTML = '<option selected disabled>Pilih Prodi...</option>';
// 						selectEditKelas.innerHTML = '<option selected disabled>Pilih Kelas...</option>';
// 						prodi.forEach(data => {
// 							selectEditProdi.innerHTML += `<option value="${data.id}">${data.name}</option>`
// 						})
// 					})
// 			})

// 			selectEditProdi.addEventListener('change', event => {
// 				const prodiId = event.target.value;
// 				fetch(`https://povid.herokuapp.com/api/v1/prodi/${prodiId}/kelas`)
// 					.then(response => response.json())
// 					.then(response => {
// 						const kelas = response.data;
// 						console.log(kelas);
// 						selectEditKelas.innerHTML = '<option selected disabled>Pilih Kelas...</option>';
// 						kelas.forEach(data => {
// 							selectEditKelas.innerHTML += `<option value="${data.id}">${data.name}</option>`
// 						})
// 					})
// 			})
// 		})
// 		.catch(err => console.log('Request Failed', err));
// }

function editData(id) {
	// console.log(document.getElementById('edit_place_of_birth').value)
	let data = {
		full_name : document.getElementById('edit_full_name').value,
		gender : document.getElementById('edit_gender').value,
		place_of_birth : document.getElementById('edit_place_of_birth').value,
		date_of_birth : document.getElementById('edit_date_of_birth').value,
		city_origin : document.getElementById('edit_city_origin').value,
		kelas_id : document.getElementById('kelasEdit').value,
		confirmed_date : document.getElementById('edit_confirmed_date').value,
		status : document.getElementById('edit_status').value
	}

	fetch("https://povid.herokuapp.com/api/v1/records/" + id, {
		method: 'PUT',
		body: JSON.stringify(data),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	})
	.then(function(response) {
		return response.json()
	})
	.then(function(data) {
		console.log(data)
		alert("Data berhasil di edit.")
		showData();
	})
}

function showTableRecord(record, num) {
	return `
	<tr>
		<th scope="row">${num}</th>
		<td>${record.full_name}</td>
		<td>${record.jurusan.name}</td>
		<td>
			<button
				class="btn waves-effect waves-light btn-info btn-outline-info btn-sm modal-detail-btn" data-recordid="${record.id}" data-toggle="modal" data-target="#recordDetailModal"><i class="icofont icofont-info-square"></i>Detail</button>
			<button
				class="btn waves-effect waves-light btn-success btn-outline-success btn-sm modal-edit-btn" data-recordid="${record.id}" data-toggle="modal" data-target="#editDataModal"><i
					class="icofont icofont-edit-alt"></i>Edit</button>
			<button
				class="btn waves-effect waves-light btn-danger btn-outline-danger btn-sm delete-btn" data-recordid="${record.id}" onclick="deleteConfirmation(${record.id})"><i
					class="icofont icofont-delete-alt"></i>Hapus</button>

		</td>
	</tr>
	`
}

function showStatisticCard(data) {
	return `
	<div class="col">
		<div class="card bg-c-red text-white text-center card-statistik">
			<div class="card-body">
				<h5 class="card-title">DATA POSITIF</h5><hr class="bg-light">
				<H2>${data.positive}</H2>
			</div>
		</div>
	</div>
	<div class="col">
		<div class="card bg-c-green text-white text-center card-statistik">
			<div class="card-body">
				<h5 class="card-title">DATA SEMBUH</h5><hr class="bg-light">
				<H2>${data.recover}</H2>
			</div>
		</div>
	</div>
	<div class="col">
		<div class="card bg-c-blue text-white text-center card-statistik">
			<div class="card-body">
				<h5 class="card-title">DATA MENINGGAL</h5><hr class="bg-light">
				<H2>${data.death}</H2>
			</div>
		</div>
	</div>
	<div class="col">
		<div class="card bg-secondary text-white text-center card-statistik">
			<div class="card-body">
				<h5 class="card-title">TOTAL</h5><hr class="bg-light">
				<H2>${data.total}</H2>
			</div>
		</div>
	</div>
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

function showEditData(data) {
	return `
	<div class="container-fluid">
		<div class="form-group">
			<label for="full_name">Name</label>
			<input type="full_name" value="${data.full_name}" class="form-control form-control-sm" id="edit_full_name">
		</div>
		<div class="form-group">
			<label for="gender">Gender</label>
			<select class="custom-select my-1 mr-sm-2" id="edit_gender">
				<option disabled>Choose...</option>
				<option value="1" ${data.gender == 1 ? 'selected' : ''}>Laki-Laki</option>
				<option value="2" ${data.gender == 2 ? 'selected' : ''}>Perempuan</option>
			</select>
		</div>
		<div class="form-group">
			<label for="place_of_birth">Place of Birth</label>
			<input type="place_of_birth" value="${data.place_of_birth}" class="form-control form-control-sm" id="edit_place_of_birth">
		</div>
		<div class="form-group">
			<label for="date_of_birth">Date of Birth</label>
			<input type="date" value="${data.date_of_birth}" class="form-control form-control-sm date-format" id="edit_date_of_birth">
		</div>
		<div class="form-group">
			<label for="city_origin">City origin</label>
			<input type="city_origin" value="${data.city_origin}" class="form-control form-control-sm" id="edit_city_origin">
		</div>
		<div class="form-group">
			<label for="jurusan">Jurusan</label>
			<select class="custom-select my-1 mr-sm-2" id="jurusanEdit">
				<option value="${data.jurusan.id}" selected>${data.jurusan.name}</option>
			</select>
		</div>
		<div class="form-group">
			<label for="prodi">Prodi</label>
			<select class="custom-select my-1 mr-sm-2" id="prodiEdit">
				<option value="${data.prodi.id}" selected>${data.prodi.name}</option>
			</select>
		</div>
		<div class="form-group">
			<label for="kelas">Kelas</label>
			<select class="custom-select my-1 mr-sm-2" id="kelasEdit">
				<option value="${data.kelas.id}" selected>${data.kelas.name}</option>
			</select>
		</div>
		<div class="form-group">
			<label for="confirmed_date">Confirmed Date</label>
			<input type="date" value="${data.confirmed_date}" class="form-control form-control-sm date-format" id="edit_confirmed_date">
		</div>
		<div class="form-group">
			<label for="status">Status</label>
			<select class="custom-select my-1 mr-sm-2" id="edit_status">
				<option disabled>Choose...</option>
				<option value="1" ${data.status == 1 ? 'selected' : ''}>Positif</option>
				<option value="2" ${data.status == 2 ? 'selected' : ''}>Sembuh</option>
				<option value="3" ${data.status == 3 ? 'selected' : ''}>Meninggal</option>
			</select>
		</div>
		<button type="button" class="btn btn-primary" onclick="editData(${data.id})" data-dismiss="modal">Submit</button>
	</div>
	`
}