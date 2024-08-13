const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://hritikarora875:eQl5M0RMkwt3xP5J@cluster0.vwss2yc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Error: ' + err));

app.use('/api/products', require('./routes/products'));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
