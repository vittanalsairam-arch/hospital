const express = require('express');
const router = express.Router();
const { getDepartments, getHealthIssues } = require('../controllers/medicalController');

router.get('/departments', getDepartments);
router.get('/health-issues', getHealthIssues);

module.exports = router;
