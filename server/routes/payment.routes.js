const { Router } = require("express");
const { paymentOrderController, paymentSignatureValidation } = require("../controllers/payment.controller");
const router = Router();

router.post("/create-order", paymentOrderController);
router.post("/verify-signature", paymentSignatureValidation);

module.exports = router;