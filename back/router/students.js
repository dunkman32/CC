const express = require('express')
const mongoose = require('mongoose')
const Student = require('../db/student')

const router = express.Router()

router.post('/', function (req, res, next) {
  var student = new Student(req.body)
  student.save().then(() => res.send()).catch(next)
})

router.get('/', async (req, res, next) => {
  // let student = await Student.find().exec()
  let page = parseInt(req.query.page)
  let limit = parseInt(req.query.limit)
  console.log(page, limit)
  Student.paginate({}, {
    page: page,
    limit: limit,
    sort: '-addDate',
  }).then(results => res.send(results)).catch(next)
  // res.send(student)
})

function parseString (tmpString) {
  return tmpString === 'true'
}

router.get('/list', async (req, res, next) => {

  let query = {}

  if (req.query.id && req.query.id !== '') query.id = req.query.id
  if (req.query.name && req.query.name !== '') query.name = req.query.name
  if (req.query.lastname && req.query.lastname !==
    '') query.lastname = req.query.lastname
  if (req.query.year && req.query.year !== '') query.year = parseInt(req.query.year)
  if (req.query.gpa && req.query.gpa !== '') query.GPA = parseFloat(req.query.gpa)
  if (req.query.work && req.query.work !== '') query.isWorking = parseString(
    req.query.work)

  console.log(query)

  Student.paginate(query, {
    page: 1,
    limit: 5,
    sort: "-addDate",
  }).then(results => {
    console.log(results)
    res.send(results.docs)
  }).catch(next);


  // let student = await Student.find().exec()
  // let page = parseInt(req.query.page);
  // let limit = parseInt(req.query.limit);
  // console.log(page, limit)
  // Student.paginate({}, {
  //   page: page,
  //   limit: limit,
  //   sort: "-addDate"
  // }).then(results => res.send(results)).catch(next);
  // res.send(student)
})

router.delete('/:id', (req, res, next) => {
  Student.findByIdAndRemove(mongoose.Types.ObjectId(req.params.id)).
    exec().
    then(() => res.send()).
    catch(next)
})

router.put('/:id', (req, res, next) => {
  Student.findOneAndUpdate({
    _id: mongoose.Types.ObjectId(req.params.id),
  }, req.body, {
    upsert: true,
  }).
    exec().
    then(s => res.send(s)).
    catch(next)
})

module.exports = router
