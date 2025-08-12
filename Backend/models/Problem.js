import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  category: { type: String, required: true },
  description: { type: String, required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  escalatedPerson: { type: String },
  remarks: { type: String }
});

const Problem = mongoose.model('Problem', problemSchema);

export default Problem;