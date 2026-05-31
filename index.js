const express = require('express');
const app = express();
app.use(express.json());

const licenses = {
    "8930774745": { active: true, expiry: null },
    "10230287186": { active: true, expiry: null },
    "8650987998": { active: true, expiry: null},
    "9091575532": { active: true, expiry: null},
    "8919234205": {active: true, expiry: null},
};

const SECRET_KEY = "TMLWK_SECRET_8930774745";

app.get('/check', (req, res) => {
    const { userId, key } = req.query;
    
    if (key !== SECRET_KEY) {
        return res.json({ valid: false, reason: "Invalid key" });
    }
    
    if (!userId) {
        return res.json({ valid: false, reason: "No userId" });
    }
    
    const license = licenses[userId];
    
    if (!license || !license.active) {
        return res.json({ valid: false, reason: "Not registered" });
    }
    
    if (license.expiry && license.expiry < Math.floor(Date.now() / 1000)) {
        return res.json({ valid: false, reason: "Expired" });
    }
    
    return res.json({ valid: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`License API running on port ${PORT}`);
});
