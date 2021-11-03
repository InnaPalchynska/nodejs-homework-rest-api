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

router.get('/', getContacts);

router.get('/:contactId', validateId, getContact);

router.post('/', validateContact, saveContact);

router.delete('/:contactId', validateId, removeContact);

router.put('/:contactId', [validateId, validateContact], updateContact);

router.patch(
  '/:contactId/favorite',
  [validateId, validateFavoriteContact],
  updateStatusFavoriteContact,
);

module.exports = router;
