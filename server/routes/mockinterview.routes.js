const { Router } = require("express");
const { db, admin } = require("../config/firebase");
const client = require("../config/redisClient");

const router = Router();

const QUESTION_TYPES = [
    "technical",
    "behavioral",
    "system_design",
    "curveball",
];

router.get("/mock-stats/:userId", async (req, res) => {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const cacheKey = `mock_stats:${userId}`;

    try {
        // Try to fetch from Redis cache
        const cached = await client.get(cacheKey);
        if (cached) {
            return res.status(200).json(JSON.parse(cached));
        }

        // Not in cache, compute stats
        const ref = db
            .collection("users")
            .doc(userId)
            .collection("mock-interviews");
        const snapshot = await ref.get();

        const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        const now = new Date();
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);

        const total = data.length;

        const last7Days = data.filter(
            (mi) => mi.createdAt?.toDate?.() >= weekAgo
        ).length;

        const scores = data
            .map((mi) => mi.analysis?.overallScore)
            .filter((score) => typeof score === "number");

        const avgScore = scores.length
            ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
            : 0;

        const totalPoints = data.reduce((sum, mi) => sum + (mi.points || 0), 0);

        const recent = [...data]
            .sort((a, b) => b.createdAt?.toDate?.() - a.createdAt?.toDate?.())
            .slice(0, 3);

        const typeStats = {};
        QUESTION_TYPES.forEach((type) => {
            typeStats[type] = {
                total: 0,
                attempted: 0,
                avgScore: 0,
                scoreSum: 0,
            };
        });

        data.forEach((mi) => {
            if (Array.isArray(mi.questions)) {
                mi.questions.forEach((q) => {
                    const type = (q.type || "").toLowerCase().replace(" ", "_");
                    if (typeStats[type]) {
                        typeStats[type].total += 1;
                        if (q.answer && q.answer.trim() !== "") {
                            typeStats[type].attempted += 1;
                            if (typeof q.analysis?.score === "number") {
                                typeStats[type].scoreSum += q.analysis.score;
                            }
                        }
                    }
                });
            }
        });

        QUESTION_TYPES.forEach((type) => {
            typeStats[type].avgScore = typeStats[type].attempted
                ? Math.round(typeStats[type].scoreSum / typeStats[type].attempted)
                : 0;
            delete typeStats[type].scoreSum;
        });

        const stats = {
            total,
            last7Days,
            avgScore,
            totalPoints,
            recent,
            typeStats,
        };

        // Save to Redis with TTL of 3 hours (10800 seconds)
        await client.set(cacheKey, JSON.stringify(stats), "EX", 3600);

        return res.status(200).json(stats);
    } catch (err) {
        console.error("Error fetching mock stats:", err);
        return res.status(500).json({ error: "Server Error" });
    }
});

router.get("/all-interviews/:userId", async (req, res) => {
    const { userId } = req.params;
    const cacheKey = `interviews:${userId}`;

    try {
        // Try to get data from Redis
        const cachedData = await client.get(cacheKey);
        if (cachedData) {
            return res.status(200).json({ source: "cache", data: JSON.parse(cachedData) });
        }

        // Fetch from Firestore
        const ref = db.collection("users").doc(userId).collection("mock-interviews").orderBy("createdAt", "desc");
        const snapshot = await ref.get();

        const interviews = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAtMs: doc.data().createdAt?.toDate?.().getTime() || Date.now(),
        }));

        // Cache the data for 3 hours
        await client.set(cacheKey, JSON.stringify(interviews), "EX", 60 * 60 * 1);

        res.status(200).json({ source: "firestore", data: interviews });
    } catch (err) {
        console.error("Error fetching interviews:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/create-mock-interview", async (req, res) => {
    const { userId, formState } = req.body;

    if (!userId || !formState) {
        return res.status(400).json({ error: "Missing userId or formState" });
    }

    try {
        const newDocRef = await db
            .collection("users")
            .doc(userId)
            .collection("mock-interviews")
            .add({
                interviewName: formState.interviewName,
                jobDescription: formState.jobDescription,
                programmingLanguage: formState.programmingLanguage,
                technologyStack: formState.technologyStack,
                experienceLevel: formState.experienceLevel,
                notifications: formState.notifications,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                userId: userId,
                isBookmarked: false,
            });

        await db.collection("users").doc(userId).update({
            interviewsCreated: admin.firestore.FieldValue.increment(1),
        });

        // Invalidate the user's interview cache
        await client.del(`interviews:${userId}`);
        await client.del(`mock_stats:${userId}`);

        res.status(200).json({ status: "Interview created", docId: newDocRef.id });
    } catch (err) {
        console.error("Error creating interview:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
