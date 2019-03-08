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
  let page = parseInt(req.query.page);
  let limit = parseInt(req.query.limit);
  console.log(page, limit)
  Student.paginate({}, {
    page: page,
    limit: limit,
    sort: "-addDate"
  }).then(results => res.send(results)).catch(next);
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
