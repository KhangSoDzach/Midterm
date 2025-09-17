const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(bodyParser.json());

app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});