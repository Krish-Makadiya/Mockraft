const Razorpay = require("razorpay");

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
            return res.status(500).json({ error: "Failed to create payment order" });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ error: "Failed to create payment order" });
    }
};

module.exports = { paymentOrderController };