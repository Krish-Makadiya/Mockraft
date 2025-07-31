const express = require("express");
const { userClerkController } = require("../controllers/user.controller");
const client = require("../config/redisClient");
const { db } = require("../config/firebase");
const router = express.Router();

router.post("/clerk-user-webhook", userClerkController);

router.post("/initialize-user", async (req, res) => {
    const { user } = req.body;
    if (!user || !user.id)
        return res.status(400).json({ error: "Missing user data" });

    const userId = user.id;
    const userRef = db.collection("users").doc(userId);

    try {
        const cacheKey = `user:${userId}`;
        const cachedUser = await client.get(cacheKey);

        if (cachedUser) {
            return res.json({
                status: "exists (cached)",
                data: JSON.parse(cachedUser),
            });
        }

        const userSnap = await userRef.get();
        if (!userSnap.exists) {
            const userData = {
                plan: "free",
                points: 0,
                email: user.emailAddresses?.[0]?.emailAddress || "",
                firstname: user.firstName,
                fullname: user.fullName,
                lastname: user.lastName,
                id: user.id,
                avtaar: user.imageUrl,
                createdAt: user.createdAt,
            };

            await userRef.set(userData);
            await client.set(cacheKey, JSON.stringify(userData));
            await client.expire(cacheKey, 3600);

            return res.json({ status: "created", data: userData });
        } else {
            const existingUser = userSnap.data();
            await client.set(cacheKey, JSON.stringify(existingUser));
            await client.expire(cacheKey, 3600);
            
            return res.json({ status: "exists", data: existingUser });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
