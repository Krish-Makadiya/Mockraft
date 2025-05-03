process.noDeprecation = true; // Add this at the top

require("dotenv").config();
const express = require("express");
const { Webhook } = require("svix");
const app = express();
const userRoutes = require("./routes/user.routes");
const aiRoutes = require("./routes/ai.routes");
const cors = require('cors')

app.use(express.raw({ type: "application/json" }));

app.use(cors());
app.use("/", userRoutes);
app.use("/ai", aiRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
