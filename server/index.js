require('dotenv').config();
const app = require('express')();
const PORT = process.env.PORT;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');


// Import routes
const postsRoutes = require('./routes/posts');

// Define middleware
app.use(cors()) // enable CORS
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
  .then(()=>console.log('Connected to MongoDB'))
  .catch(e=>console.log(e));

// Set up Auth0
const { auth, requiresAuth } = require('express-openid-connect');
app.use(
  auth({
    authRequired: false,
    auth0Logout: true,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    secret: process.env.AUTH0_SECRET,
    idpLogout: true,
  })
);

// app.get('/status', (req, res) => {
//     res.send(req.oidc.isAuthenticated() ? 'Logged In' : 'Logged Out');
// });

// app.get('/profile', requiresAuth(), (req, res) => {
//     res.send(JSON.stringify(req.oidc.user));
// });

mongoose.connection.once('open', () => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})