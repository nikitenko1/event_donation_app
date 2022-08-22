require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');

const path = require('path');
const connectDB = require('./utils/db');

const app = express();

// Cloud Mongodb Atlas
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/api/v1/auth', require('./routes/auth.route'));
app.use('/api/v1/donor', require('./routes/donor.route'));
app.use('/api/v1/event', require('./routes/event.route'));
app.use('/api/v1/news', require('./routes/news.route'));
app.use('/api/v1/user', require('./routes/user.route'));
app.use('/api/v1/dashboard', require('./routes/dashboard.route'));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(process.env.PORT, () =>
  console.log(`Server is running on PORT ${process.env.PORT}`)
);
