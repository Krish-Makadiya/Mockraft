process.noDeprecation = true; // Add this at the top

require("dotenv").config();
const express = require("express");
const { Webhook } = require("svix");
const app = express();
const userRoutes = require("./routes/user.routes");
const aiRoutes = require("./routes/ai.routes");
const cors = require("cors");
const paymentRoutes = require("./routes/payment.routes");
const jwt = require("jsonwebtoken");

// app.use(express.raw({ type: "application/json" }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", userRoutes);
app.use("/ai", aiRoutes);
app.use("/payment", paymentRoutes);

const { StreamChat } = require("stream-chat");

// ✅ Use your actual Stream credentials
const STREAM_API_KEY = "mv99a4nsjsbb";
const STREAM_API_SECRET =
    "wysta3aj75pgaqffmp36meta8df2tw5xvfarjgwgejh5bzt2shqk2ufx4xjw7jhh"; // 🛡 Get from https://getstream.io/dashboard/

const streamServerClient = StreamChat.getInstance(
    STREAM_API_KEY,
    STREAM_API_SECRET
);

// Generate Stream-compatible JWT
app.post("/generate-token", (req, res) => {
    const { id } = req.body;

    const api_key = "mv99a4nsjsbb";
    const api_secret = "wysta3aj75pgaqffmp36meta8df2tw5xvfarjgwgejh5bzt2shqk2ufx4xjw7jhh";

    const serverClient = StreamChat.getInstance(api_key, api_secret);
    const token = serverClient.createToken(id);
    return res.json({
        token,
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
