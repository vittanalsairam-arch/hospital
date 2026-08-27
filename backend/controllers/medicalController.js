const Department = require('../models/Department');
const HealthIssue = require('../models/HealthIssue');

exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({});
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getHealthIssues = async (req, res) => {
  try {
    const issues = await HealthIssue.find({}).populate('departmentId');
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
