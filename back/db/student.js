const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const StudentSchema = new Schema({
  id: String,
  name: String,
  lastname: String,
  GPA: Number,
  year: Number,
  isWorking: {
    default: false,
    type: Boolean
  },
  addDate: {
    type: Date,
    default:new Date()
  }
}, {collection: 'students'});

StudentSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Student', StudentSchema);
