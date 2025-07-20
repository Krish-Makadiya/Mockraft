const { Router } = require("express");
const { paymentOrderController } = require("../controllers/payment.controller");
const router = Router();

router.post("/create-order", paymentOrderController);

module.exports = router;