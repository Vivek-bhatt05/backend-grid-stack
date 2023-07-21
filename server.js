const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB Atlas
const dbURI = 'mongodb+srv://vivek:bhattg@cluster0.vut9bj3.mongodb.net/widget?retryWrites=true&w=majority';
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once('open', () => console.log('Connected to MongoDB Atlas'));
db.on('error', (err) => console.error('MongoDB connection error:', err));

// Define the schema and model for widgets
const widgetSchema = new mongoose.Schema({
  x: Number,
  y: Number,
  width: Number,
  height: Number,
  content: String,
});

const Widget = mongoose.model('Widget', widgetSchema);

// API endpoints
app.get('/api/widgets', async (req, res) => {
  try {
    const widgets = await Widget.find();
    res.json(widgets);
  } catch (err) {
    console.error('Error fetching widgets:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/widgets', async (req, res) => {
  const { x, y, width, height, content } = req.body;

  try {
    const newWidget = new Widget({
      x,
      y,
      width,
      height,
      content,
    });

    await newWidget.save();
    res.status(201).json(newWidget);
  } catch (err) {
    console.error('Error creating widget:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
app.listen(port, () => console.log(`Server is running on port ${port}`));