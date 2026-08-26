require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json()); // Parse JSON bodies
const PORT = process.env.PORT ||4000;







//Error Handler
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Server error!' });
});

//const PORT = 4000;
app.listen(PORT, () => console.log(`Server on port: ${PORT}`));
