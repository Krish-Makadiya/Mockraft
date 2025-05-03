const { db } = require("../config/firebase");
const { Webhook } = require("svix");

const userClerkController = async (req, res) => {
    try {
        const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        const payload = req.body.toString();
        const headers = req.headers;

        const data = wh.verify(payload, {
            "svix-id": headers["svix-id"],
            "svix-timestamp": headers["svix-timestamp"],
            "svix-signature": headers["svix-signature"],
        });

        const {
            id,
            email_addresses,
            first_name,
            last_name,
            created_at,
            updated_at,
            image_url,
        } = data.data;

        switch (data.type) {
            case "user.created":
                await db
                    .collection("users")
                    .doc(id)
                    .set({
                        email: email_addresses[0].email_address,
                        firstName: first_name || "",
                        lastName: last_name || "",
                        clerkUserId: id,
                        imageUrl: image_url || "",
                        createdAt: created_at,
                    });
                break;

            case "user.updated":
                await db
                    .collection("users")
                    .doc(id)
                    .update({
                        email: email_addresses[0].email_address,
                        firstName: first_name || "",
                        lastName: last_name || "",
                        imageUrl: image_url || "",
                        updatedAt: updated_at,
                    });
                break;

            case "user.deleted":
                await db.collection("users").doc(id).delete();
                break;

            default:
                console.log("Unhandled event type:", data.type);
        }

        res.status(200).json({ success: true });
    } catch (err) {
        console.error("Webhook error:", err);
        res.status(400).json({ error: "Invalid webhook" });
    }
};

module.exports = {
    userClerkController
};