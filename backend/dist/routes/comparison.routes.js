"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comparison_controller_1 = require("../controllers/comparison.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Allow authenticated comparison
router.post('/', auth_middleware_1.authenticateJwt, comparison_controller_1.ComparisonController.compare);
exports.default = router;
