const express = require('express');
const router = express.Router();
const {
  getContacts,
  getContact,
  saveContact,
  removeContact,
  updateContact,
  updateStatusFavoriteContact,
} = require('../../controllers/contacts');
const {
  validateContact,
  validateId,
  validateFavoriteContact,
} = require('./validation');
const guard = require('../../helpers/guard');
const wrapError = require('../../helpers/errorHandler');

router.get('/', guard, getContacts);

router.get('/:contactId', guard, validateId, wrapError(getContact));

router.post('/', guard, validateContact, wrapError(saveContact));

router.delete('/:contactId', guard, validateId, wrapError(removeContact));

router.put(
  '/:contactId',
  guard,
  [(validateId, validateContact)],
  wrapError(updateContact),
);

router.patch(
  '/:contactId/favorite',
  guard,
  [(validateId, validateFavoriteContact)],
  wrapError(updateStatusFavoriteContact),
);

module.exports = router;
