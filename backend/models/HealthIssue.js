const mongoose = require('mongoose');

const healthIssueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true }
}, { timestamps: true });

module.exports = mongoose.model('HealthIssue', healthIssueSchema);
