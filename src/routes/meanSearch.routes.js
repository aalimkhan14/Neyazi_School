const express = require("express");
const router = express.Router();
const searchController = require("../controller/meanSearch.controller");

router.get("/students/search", searchController.searchStudents);
router.get("/teachers/search", searchController.searchTeachers);
router.get("/employees/search", searchController.searchEmployees);

module.exports = router;
