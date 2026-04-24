const express = require('express');
const cors = require('cors');

const { processData } = require('./utils/graph');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/bfhl', (req, res) => {
    try {
        const data = req.body.data;

        if (!Array.isArray(data)) {
            return res.status(400).json({ error: "Invalid input format" });
        }

        const result = processData(data);

        res.json({
            user_id: "smitajoshi_17032005",
            email_id: "sj5805@srmist.edu.in",
            college_roll_number: "RA2311030010232",
            ...result
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});