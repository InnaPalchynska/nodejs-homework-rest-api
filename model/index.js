const crypto = require('crypto');
const DB = require('./db');
const db = new DB('./contacts.json');

const listContacts = async () => {
  return await db.read();
};

const getById = async contactId => {
  const contacts = await db.read();
  const index = contacts.findIndex(contact => contact.contactId === contactId);
  return contacts[index];
};

const removeContact = async contactId => {
  const contacts = await db.read();
  const index = contacts.findIndex(contact => contact.contactId === contactId);
  if (index !== -1) {
    const [removedContact] = contacts.splice(index, 1);
    await db.write(contacts);
    return removedContact;
  }
  return null;
};

const addContact = async body => {
  const contacts = await db.read();
  const newContact = {
    contactId: crypto.randomUUID(),
    ...body,
  };
  contacts.push(newContact);
  await db.write(contacts);
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await db.read();
  const index = contacts.findIndex(contact => contact.contactId === contactId);
  if (index !== -1) {
    const contact = contacts[index];
    contacts[index] = { ...contact, ...body };
    await db.write(contacts);
    return contacts[index];
  }
  return null;
};

module.exports = {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
};
