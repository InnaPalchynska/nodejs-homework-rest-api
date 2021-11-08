const express = require('express');
const router = express.Router();

const {
  signup,
  login,
  logout,
  current,
  uploadAvatar,
  verifyUser,
  repeatEmailForVerifyUser,
} = require('../../controllers/users');
const guard = require('../../helpers/guard');
const loginLimit = require('../../helpers/rate-limit-login');
const upload = require('../../helpers/uploads');
const wrapError = require('../../helpers/errorHandler');

router.post('/signup', wrapError(signup));
router.post('/login', loginLimit, wrapError(login));
router.post('/logout', guard, wrapError(logout));
router.post('/current', guard, wrapError(current));
router.patch(
  '/avatars',
  guard,
  upload.single('avatar'),
  wrapError(uploadAvatar),
);

router.get('/verify/:verificationToken', wrapError(verifyUser));
router.post('/verify ', wrapError(repeatEmailForVerifyUser));

module.exports = router;
