const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const Student = require('../db/student')
const fs = require('fs')
const filesJs = require('../files')
const path = require('path')


const router = express.Router()

const upload = multer({
  dest: path.join(__dirname, '../../files'),
})

router.post('/', upload.single('drag'), async function (req, res, next) {
  try {

    let me = fs.createReadStream(req.file.path)
    let body = req.body
    let photoId = await filesJs.uploadFile(req.file.originalname, me)
    body.photo = photoId.toString()
    await filesJs.promisedRemoveFile(req.file.path)
  } catch (e) {
    res.status(403).send()
  }
  let student = new Student(body)
  student.save().then(() => res.send()).catch(next)
})

router.get('/', async (req, res, next) => {
  // let student = await Student.find().exec()
  let page = parseInt(req.query.page)
  let limit = parseInt(req.query.limit)
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
  if (req.query.year && req.query.year !== '') query.year = parseInt(
    req.query.year)
  if (req.query.gpa && req.query.gpa !== '') query.GPA = parseFloat(
    req.query.gpa)
  if (req.query.work && req.query.work !== '') query.isWorking = parseString(
    req.query.work)

  console.log(query)

  Student.paginate(query, {
    page: 1,
    limit: 5,
    sort: '-addDate',
  }).then(results => {
    res.send(results.docs)
  }).catch(next)
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


router.get('/download/:id', async (req, res, next) => {
  let stream;
  let id = req.params.id;
  if (id && id !== 'null') {
    stream = filesJs.downloadFile(id);
    await new Promise((resolve, reject) => {
      stream.pipe(res)
      .on('error', reject)
      .on('finish', resolve);
    });
  }
});

module.exports = router
