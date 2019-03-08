var modal = document.getElementById('myModal')
var deleteModal = document.getElementById('deleteModal')
var e_modal = document.getElementById('editModal')
var filterModal = document.getElementById('filterModal')
var a = null
var studentId = null
var studentsData = []
var page = 1
var limit = 5
window.onload = studentsTable()

function openModal () {
  modal.style.display = 'block'
}

function closeModal () {
  modal.style.display = 'none'
}

function renderTable (docs) {
  studentsData = docs
  var cards = '<tr>' +
    '<th>Work</th>' +
    '<th>Id</th>' +
    '<th>Firstname</th>' +
    '<th>lastname</th>' +
    '<th>GPA</th>' +
    '<th>year</th>' +
    '<th>actions</th>' +
    '</tr>'
  studentsData.forEach(function (student) {
    cards += '<tr>' +
      '<td>' + getWorkStatus(student.isWorking) + '</td>' +
      '<td>' + student.id + '</td>' +
      '<td>' + student.name + '</td>' +
      '<td>' + student.lastname + '</td>' +
      '<td>' + student.GPA + '</td>' +
      '<td>' + student.year + '</td>' +
      '<td>' +
      '<span class="editButton fa fa-pencil" onclick="openEditModal(\'' +
      student._id + '\')"></span>' +
      '<span class="deleteButton fa fa-trash" onclick="openDeleteModal(\'' +
      student._id + '\')"></span>' +
      '</td>' +
      '</tr>'
  })
  document.getElementById('table').innerHTML = cards.toString()
}

function studentsTable () {
  var oReq = new XMLHttpRequest()

  oReq.open('GET', '/api/student?page=' + page + '&limit=' + limit)
  oReq.onreadystatechange = function () {
    if (oReq.readyState === 4) {
      var students = JSON.parse(oReq.response)
      renderTable(students.docs)
    }
  }
  oReq.send()
}

function getWorkStatus (isChecked) {
  return isChecked ? 'მუშაობს!' : 'არ მუშაობს!'
}

function addStudent (event) {
  event.preventDefault()
  var id = document.getElementById('SID')
  var name = document.getElementById('name')
  var lastname = document.getElementById('lname')
  var year = document.getElementById('year')
  var GPA = document.getElementById('gpa')
  var isWorking = document.getElementById('addCheckbox').checked
  var XHR = new XMLHttpRequest()

  var obj = {
    id: id.value,
    name: name.value,
    lastname: lastname.value,
    year: year.value,
    GPA: GPA.value,
    isWorking: isWorking,
  }

  XHR.open('POST', '/api/student/')
  XHR.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
  XHR.send(JSON.stringify(obj))
  XHR.onreadystatechange = function () {
    if (XHR.status === 200) {
      closeModal()
    }
  }
  studentsTable()
}

function deleteStudent () {
  if (studentId) {
    var XHR = new XMLHttpRequest()
    var url = '/api/student/' + studentId
    XHR.open('DELETE', url, true)
    XHR.send()

    XHR.onreadystatechange = function () {
      if (XHR.status === 200) {
        setTimeout(function () {
          studentsTable()
          closeDeleteModal()
        }, 100)
      } else {
        //TODO ALERT
      }
    }
  } else {
    //TODO ERROR ALERT
  }
}

function editStudent (event) {
  if (studentId) {

    event.preventDefault()
    console.log(event)
    var id = document.getElementById('ESID')
    var name = document.getElementById('ename')
    var lastname = document.getElementById('elname')
    var year = document.getElementById('eyear')
    var GPA = document.getElementById('egpa')
    var isWorking = document.getElementById('editCheckbox').checked

    var XHR = new XMLHttpRequest()

    var obj = {
      id: id.value,
      name: name.value,
      lastname: lastname.value,
      year: year.value,
      GPA: GPA.value,
      isWorking: isWorking,
    }
    XHR.open('PUT', '/api/student/' + studentId)
    XHR.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    // The data sent is what the user provided in the form
    XHR.send(JSON.stringify(obj))
    XHR.onreadystatechange = function () {
      if (XHR.status === 200) {
        closeEditModal()
      }
    }
    studentsTable()
  } else {
    //TODO ALERT
  }
}

function openEditModal (_id) {
  e_modal.style.display = 'block'
  if (_id) {

    var currentStudent = studentsData.filter(function (student) {
      return student._id === _id
    })
    console.log(currentStudent, 'zzz')
    if (currentStudent && currentStudent.length) {
      document.getElementById('ESID').value = currentStudent[0].id
      document.getElementById('ename').value = currentStudent[0].name
      document.getElementById('elname').value = currentStudent[0].lastname
      document.getElementById('eyear').value = currentStudent[0].year
      document.getElementById('egpa').value = currentStudent[0].GPA
      if (currentStudent[0].isWorking) document.getElementById(
        'editCheckbox').checked = true

    }
  }
  studentId = _id
}

function closeEditModal () {
  e_modal.style.display = 'none'
}

function openDeleteModal (_id) {
  deleteModal.style.display = 'block'
  studentId = _id
}

function closeDeleteModal () {
  deleteModal.style.display = 'none'
}

function openFilterModal (_id) {
  filterModal.style.display = 'block'
  studentId = _id
}

function closeFilterModal () {
  filterModal.style.display = 'none'
}

function change (e) {
  limit = document.getElementById('slct').value
  studentsTable()
}

function filterStudents (e) {
  e.preventDefault()
  var id = document.getElementById('FSID').value
  var name = document.getElementById('fname').value
  var lastname = document.getElementById('flname').value
  var year = document.getElementById('fyear').value
  var GPA = document.getElementById('fgpa').value
  var isWorking = document.getElementById('filterCheckbox').checked
  console.log(id, isWorking)
  var oReq = new XMLHttpRequest()

  oReq.open('GET',
    '/api/student/list?id=' + id + '&name=' + name + '&lastname=' + lastname +
    '&year=' + year + '&gpa=' + GPA +
    '&work=' + isWorking)
  oReq.onreadystatechange = function () {
    if (oReq.status === 200) {
      console.log(oReq.response)
      var students = JSON.parse(oReq.response)
      renderTable(students)
      closeFilterModal()
    }
  }
  oReq.send()
}



