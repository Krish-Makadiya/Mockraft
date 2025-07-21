const Razorpay = require("razorpay");
const { validatePaymentVerification, validateWebhookSignature } = require("razorpay/dist/utils/razorpay-utils");

const paymentOrderController = async (req, res) => {
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
        amount: req.body.amount * 100,
        currency: "INR",
        receipt: "receipt#1",
    };

    // console.log("Creating Razorpay order with options:", options);
    try {
        const order = await razorpay.orders.create(options);
        console.log("Razorpay order created successfully:", order);
        if (!order) {
            return res
                .status(500)
                .json({ error: "Failed to create payment order" });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ error: "Failed to create payment order" });
    }
};

const paymentSignatureValidation = async (req, res) => {
    const { order_id, payment_id, signature } = req.body;

    // console.log("Validating payment signature with data:", { order_id, payment_id, signature });
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    try {
        // const generated_signature = hmac_sha256(
        //     order_id + "|" + payment_id,
        //     process.env.RAZORPAY_KEY_SECRET
        // );

        // const isValid = razorpay.validatePaymentSignature({
        //     order_id,
        //     payment_id,
        //     signature,
        // });
        // const isValid = generated_signature === signature;
        // console.log("Payment signature validation result:", isValid);

        // var { validatePaymentVerification, validateWebhookSignature } = require('./dist/utils/razorpay-utils');
        const result = validatePaymentVerification({"order_id": order_id, "payment_id": payment_id }, signature, process.env.RAZORPAY_KEY_SECRET);
        console.log("Payment verification result:", result);

        if (result) {
            res.status(200).json({
                success: true,
                message: "Payment verified successfully",
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid payment signature",
            });
        }
    } catch (error) {
        console.error("Error validating payment signature:", error);
        res.status(500).json({ error: "Failed to validate payment signature" });
    }
};

module.exports = { paymentOrderController, paymentSignatureValidation };
