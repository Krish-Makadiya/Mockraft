const express = require("express");
const { Router } = require("express");
const app = express();
const { StreamChat } = require("stream-chat");
const { clerkClient } = require("@clerk/express");

const router = Router();

router.post("/generate-token", async (req, res) => {
    try {
        const { id, first_name, last_name, image_url } = req.body.data;
        const fullName = `${first_name || ""} ${last_name || ""}`.trim();

        const api_key = process.env.STREAM_API_KEY;
        const api_secret = process.env.STREAM_API_SECRET;

        const serverClient = StreamChat.getInstance(api_key, api_secret);
        const token = serverClient.createToken(id);

        await clerkClient.users.updateUser(id, {
            publicMetadata: {
                streamToken: token,
            },
        });

        await serverClient.upsertUser({
            id,
            name: fullName,
            image: image_url,
        });

        const channel = serverClient.channel(
            "messaging",
            process.env.STREAM_ID,
            {
                created_by_id: id,
            }
        );

        await channel.create().catch((e) => {
            if (e.code !== 16) throw e;
        });

        await channel.addMembers([id]);
        console.log(`Channel created or already exists: ${token}`);
        return res.json({ token });
    } catch (err) {
        console.error("Error in /generate-token:", err);
        return res.status(500).json({ error: err.message });
    }
});

router.get("/test", (req, res) => {
    return res.json({
        message: "Webhook route is working",
    });
});

module.exports = router;
