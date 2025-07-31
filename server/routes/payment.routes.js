const { Router } = require("express");
const {
    paymentOrderController,
    paymentSignatureValidation,
} = require("../controllers/payment.controller");
const { db, admin } = require("../config/firebase");
const client = require("../config/redisClient");
const router = Router();

router.post("/create-order", paymentOrderController);
router.post("/verify-signature", paymentSignatureValidation);

router.post("/add-payment", async (req, res) => {
    const { userId, paymentData } = req.body;
    if (!userId || !paymentData) {
        return res.status(400).json({ error: "Missing userId or paymentData" });
    }

    try {
        const userRef = db.collection("users").doc(userId);

        await userRef.update({
            payments: admin.firestore.FieldValue.arrayUnion(paymentData),
        });

        res.status(200).json({ status: "Payment added" });
    } catch (error) {
        console.error("Error updating payment:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/user-plan/:userId", async (req, res) => {
    const { userId } = req.params;
    const cacheKey = `payment:${userId}`;

    if (!userId) {
        return res.status(400).json({ error: "Missing userId" });
    }

    try {
        // 1️⃣ Check Redis cache
        const cachedUser = await client.get(cacheKey);
        if (cachedUser) {
            const userData = JSON.parse(cachedUser);
            return res.status(200).json({
                plan: userData.plan || "free",
                from: "cache",
            });
        }

        // 2️⃣ If not cached, fetch from Firestore
        const userRef = db.collection("users").doc(userId);
        const docSnap = await userRef.get();

        if (!docSnap.exists) {
            return res.status(404).json({ error: "User not found" });
        }

        const userData = docSnap.data();

        // 3️⃣ Cache the full user object in Redis for 1 hour
        await client.set(cacheKey, JSON.stringify(userData.plan), "EX", 3600);

        return res.status(200).json({
            plan: userData.plan || "free",
            from: "firestore",
        });
    } catch (err) {
        console.error("Error fetching user plan:", err);
        return res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
