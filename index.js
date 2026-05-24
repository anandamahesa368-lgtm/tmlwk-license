const express = require('express');
const app = express();
app.use(express.json());

// Database lisensi (tambah UserId pembeli di sini)
const licenses = {
    // "UserId": { active: true, expiry: null }  // null = permanent
    // Contoh:
    // "10230287186": { active: true, expiry: null },
    // "123456789": { active: true, expiry: 1716393600 }, // unix timestamp
};

// Secret key agar tidak bisa diakses sembarangan
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
