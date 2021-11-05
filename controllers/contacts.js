const Contacts = require('../repository/contacts');
const { HttpCode } = require('../config/constants');
const { CustomError } = require('../helpers/customError');

const getContacts = async (req, res) => {
  const userId = req.user._id;
  const contacts = await Contacts.listContacts(userId);
  res.json({ status: 'success', code: HttpCode.OK, data: { contacts } });
};

const getContact = async (req, res) => {
  const userId = req.user._id;
  const contact = await Contacts.getById(req.params.contactId, userId);
  if (contact) {
    return res
      .status(HttpCode.OK)
      .json({ status: 'success', code: HttpCode.OK, data: { contact } });
  }

  throw new CustomError(404, 'Not found');
};

const saveContact = async (req, res) => {
  const userId = req.user._id;
  const contact = await Contacts.addContact({ ...req.body, owner: userId });
  res
    .status(HttpCode.CREATED)
    .json({ status: 'success', code: HttpCode.CREATED, data: { contact } });
};

const removeContact = async (req, res) => {
  const userId = req.user._id;
  const contact = await Contacts.removeContact(
    req.params.contactId,
    req.body,
    userId,
  );
  if (contact) {
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      message: 'contact deleted',
      data: { contact },
    });
  }
  throw new CustomError(404, 'Not found');
};

const updateContact = async (req, res, next) => {
  const userId = req.user._id;
  const contact = await Contacts.updateContact(
    req.params.contactId,
    req.body,
    userId,
  );
  if (contact) {
    return res
      .status(HttpCode.OK)
      .json({ status: 'success', code: HttpCode.OK, data: { contact } });
  }
  throw new CustomError(404, 'Not found');
};

const updateStatusFavoriteContact = async (req, res) => {
  const userId = req.user._id;
  const contact = await Contacts.updateContact(
    req.params.contactId,
    req.body,
    userId,
  );
  if (contact) {
    return res
      .status(HttpCode.OK)
      .json({ status: 'success', code: HttpCode.OK, data: { contact } });
  }
  throw new CustomError(404, 'Not found');
};

module.exports = {
  getContacts,
  getContact,
  saveContact,
  removeContact,
  updateContact,
  updateStatusFavoriteContact,
};
