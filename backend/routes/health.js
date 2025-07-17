const express = require("express");
const router = express.Router();
const {
  getHealthStatus,
  getDetailedHealthStatus,
} = require("../controllers/healthController");

// GET /api/health - Basic health check
router.get("/", getHealthStatus);

// GET /api/health/detailed - Detailed health check
router.get("/detailed", getDetailedHealthStatus);

module.exports = router;
