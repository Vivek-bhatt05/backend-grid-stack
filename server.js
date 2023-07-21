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


// const contentType = new mongoose.Schema({
//     title: String,
//     type: String,
// })

// Define the schema and model for widgets
const widgetSchema = new mongoose.Schema({
  x: Number,
  y: Number,
  w: Number,
  h: Number,
  content: String,
});

const Widget = mongoose.model('Widget', widgetSchema);

// API endpoints
app.get('/widgets', async (req, res) => {
  try {
    const widgets = await Widget.find();
    res.json(widgets);
  } catch (err) {
    console.error('Error fetching widgets:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/widgets', async (req, res) => {
  const { x, y, w, h, content } = req.body;

  try {
    const newWidget = new Widget({
      x,
      y,
      w,
      h,
      content,
    });

    await newWidget.save();
    res.status(201).json(newWidget);
  } catch (err) {
    console.error('Error creating widget:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.patch('/widgets/:_id', async (req, res) => {
    const { _id } = req.params;
    const { x, y, w, h } = req.body;
  
    try {
      const updatedWidget = await Widget.findByIdAndUpdate(_id, {
        x,
        y,
        w,
        h,
      }, { new: true });
  
      if (!updatedWidget) {
        return res.status(404).json({ message: 'Widget not found' });
      }
  
      res.json(updatedWidget);
    } catch (error) {
      console.error('Error updating widget:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

// Start the server
app.listen(port, () => console.log(`Server is running on port ${port}`));