require('dotenv').config();
const app = require('express')();
const PORT = 3001;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');


// Import routes
const postsRoutes = require('./routes/posts');

// Define middleware
app.use(cors())
app.use(bodyParser.json()); // For every request run bodyParser
app.use('/posts', postsRoutes)

// Connect to database
mongoose.set('strictQuery', true);
mongoose.connect(
  process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  )
  .then(()=>console.log('connected'))
  .catch(e=>console.log(e));

app.get('/', (req, res) => {
    res.send('Home page');
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, function () {
    console.log('http://localhost: ', PORT);
});