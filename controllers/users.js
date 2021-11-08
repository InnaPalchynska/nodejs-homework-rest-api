const jwt = require('jsonwebtoken');
const fs = require('fs/promises');
const path = require('path');
const mkdirp = require('mkdirp');
const UploadService = require('../services/fileUpload');
const Users = require('../repository/users');
const { HttpCode } = require('../config/constants');
const EmailService = require('../services/email/service');
const { CreateSenderSendGrid } = require('../services/email/sender');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

const signup = async (req, res) => {
  const { password, email } = req.body;
  const user = await Users.findByEmail(email);
  if (user) {
    return res.status(HttpCode.CONFLICT).json({
      status: 'error',
      code: HttpCode.CONFLICT,
      message: 'Email in use',
    });
  }
  const newUser = await Users.create({ email, password });
  const emailService = new EmailService(
    process.env.NODE_ENV,
    new CreateSenderSendGrid(),
  );
  const statusEmail = await emailService.sendVerifyEmail(
    newUser.email,
    newUser.name,
    newUser.verifyToken,
  );
  return res.status(HttpCode.CREATED).json({
    status: 'success',
    code: HttpCode.CREATED,
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatar,
      verifyEmail: statusEmail,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findByEmail(email);
  const isValidPassword = await user.isValidPassword(password);
  if (!user || !isValidPassword || !user.verify) {
    return res.status(HttpCode.UNAUTHORIZED).json({
      status: 'error',
      code: HttpCode.UNAUTHORIZED,
      message: 'Email or password is wrong',
    });
  }
  const id = user._id;
  const payload = { id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
  await Users.updateToken(id, token);
  return res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const logout = async (req, res) => {
  const id = req.user._id;
  await Users.updateToken(id, null);
  return res.status(HttpCode.NO_CONTENT).json();
};

const current = async (req, res) => {
  const { token } = req.body;
  const user = await Users.findByToken(token);
  if (!user) {
    return res.status(HttpCode.UNAUTHORIZED).json({
      status: 'error',
      code: HttpCode.UNAUTHORIZED,
      message: 'Not authorized',
    });
  }
  return res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

// Local storage
const uploadAvatar = async (req, res, next) => {
  const id = String(req.user._id);
  const file = req.file;
  const USERS_AVATARS = process.env.USERS_AVATARS;
  const destination = path.join(USERS_AVATARS, id);
  await mkdirp(destination);
  const uploadService = new UploadService(destination);
  const avatarUrl = await uploadService.save(file, id);
  await Users.updateAvatar(id, avatarUrl);

  return res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    date: {
      avatar: avatarUrl,
    },
  });
};

const verifyUser = async (req, res, next) => {
  const user = await Users.findUserByVerifyToken(req.params.token);
  if (user) {
    await Users.updateTokenVerify(user._id, true, null);
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        message: 'Success',
      },
    });
  }
  return res.status(HttpCode.BAD_REQUEST).json({
    status: 'error',
    code: HttpCode.BAD_REQUEST,
    message: 'Invalid token',
  });
};

const repeatEmailForVerifyUser = async (req, res, next) => {
  const { email } = req.body;
  const user = await Users.findByEmail(email);
  if (user) {
    const { email, name, verifyToken } = user;
    const emailService = new EmailService(
      process.env.NODE_ENV,
      new CreateSenderSendGrid(),
    );
    const statusEmail = await emailService.sendVerifyEmail(
      email,
      name,
      verifyToken,
    );
  }
  return res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    data: {
      message: 'Success',
    },
  });
};

module.exports = {
  signup,
  login,
  logout,
  current,
  uploadAvatar,
  verifyUser,
  repeatEmailForVerifyUser,
};
