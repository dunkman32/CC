var modal = document.getElementById('myModal')
var deleteModal = document.getElementById('deleteModal')
var e_modal = document.getElementById('editModal')
var filterModal = document.getElementById('filterModal')
var infoModal = document.getElementById('infoModal')
var dropFileForm = document.getElementById('myForm')
var droppedFiles = null
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

function closeEditModal () {
  e_modal.style.display = 'none'
}

function renderTable (docs) {
  studentsData = docs
  var cards = '<tr>' +
    '<th>სამსახური</th>' +
    '<th>პირადი ნომერი</th>' +
    '<th>სახელი</th>' +
    '<th>გვარი</th>' +
    '<th>GPA</th>' +
    '<th>დასრულების წელი</th>' +
    '<th>ქმედება</th>' +
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
      '<span class="info fa fa-info-circle" onclick="openInfoModal(\'' +
      student._id + '\')"></span>' +
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

function openInfoModal (_id) {
  infoModal.style.display = 'block'
  if (_id) {

    var currentStudent = studentsData.filter(function (student) {
      return student._id === _id
    })
    if (currentStudent && currentStudent.length) {
      delete currentStudent[0]['__v']
      delete currentStudent[0]['_id']
      delete currentStudent[0]['addDate']
      var student = ''
      document.getElementById('studentPic').src = '/api/student/download/'+currentStudent[0]['photo']
      delete currentStudent[0]['photo']
      for (let [key, value] of Object.entries(currentStudent[0])) {
        if (key === 'isWorking') value = getWorkStatus(value)
        student += '<div class="studentInfoElement">' +
          '<p class="elKey">' + key + '</p>' +
          '<p class="elValue">: ' + value + '</p>' +
          '</div>'
      }
      document.getElementById('infoDiv').innerHTML = student
    }
  }
}

function closeInfoModal () {
  infoModal.style.display = 'none'
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

// async function uploadFiles (event) {
//   event.preventDefault()
//   addStatus('Uploading...')
//   var formData = new FormData()
//   formData.append('drag', file, file.name)
//
//   var xhr = new XMLHttpRequest()
//
//   xhr.open(dropFileForm.method, dropFileForm.action, true)
//   xhr.send(formData)
//
//   xhr.onreadystatechange = function (data) {
//     if (xhr.status === 200) {
//       setTimeout(function () {
//         getFiles()
//         deleteStatus('')
//       }, 1000)
//     }
//   }
// }

function addStudent (event) {
  event.preventDefault()
  var formData = new FormData()
  var pic = document.getElementById('pic').files[0]

  var XHR = new XMLHttpRequest()
  formData.append('drag', pic, pic.name)
  formData.append('id', document.getElementById('SID').value)
  formData.append('name', document.getElementById('name').value)
  formData.append('lastname', document.getElementById('lname').value)
  formData.append('year', document.getElementById('year').value)
  formData.append('GPA', document.getElementById('gpa').value)
  formData.append('isWorking', document.getElementById('addCheckbox').checked)
  console.log(formData)
  XHR.open('POST', '/api/student/')
  XHR.send(formData)
  XHR.onreadystatechange = function () {
    if (XHR.status === 200) {
      closeModal()
    }
  }
  studentsTable()
}
