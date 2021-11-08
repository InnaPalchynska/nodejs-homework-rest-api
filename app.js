const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const { Limit } = require('./config/constants');
const usersRouter = require('./routes/users/users');
const contactsRouter = require('./routes/contacts/contacts');
const USERS_AVATARS = process.env.USERS_AVATARS;

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use('/avatars', express.static(USERS_AVATARS));
app.use(helmet());
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json({ limit: Limit.expressJSON }));

app.use('/api/users', usersRouter);
app.use('/api/contacts', contactsRouter);

app.use((req, res) => {
  res.status(404).json({ status: 'error', code: 404, message: 'Not found' });
});

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    status: statusCode === 500 ? 'fail' : 'error',
    code: statusCode,
    message: err.message,
  });
});

module.exports = app;
