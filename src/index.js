const express = require('express');
//const https = require('https');
//const fs = require('fs');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const auth = require('./middleware/auth.js');

const userRoutes = require('./routes/users.js');
const subredditRoutes = require('./routes/subreddits.js');
const postsRoutes = require('./routes/posts.js');
const votesRoutes = require('./routes/votes.js');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'https://lucas-4.github.io'],
  methods: 'GET, POST, PUT, DELETE',
  credentials: true
}));


app.get('/test', (req, res) => {
  res.send('test');
})
app.use(userRoutes);
app.use(subredditRoutes);
app.use(postsRoutes);
app.use(votesRoutes);

/* const options = {
  key: fs.readFileSync(path.join(__dirname, 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert.pem'))
}
 */
//https.createServer(options, app).

app.listen(process.env.PORT || 3000);