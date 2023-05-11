const fs = require('fs/promises')
const pach = require("path");
const { nanoid } = require("nanoid");

const contactsPach = pach.join(__dirname, "contacts.json");

const updtContact =  async (contacts)=>await fs.writeFile(contactsPach, JSON.stringify(contacts, null, 2));


const listContacts = async () => {
  const readFile = await fs.readFile(contactsPach);
    return JSON.parse(readFile);
}

const getContactById = async (contactId) => {
  const contacts = await listContacts();
     const result = contacts.find(item=> item.id === contactId); 
    return result||null;
}

const removeContact = async (contactId) => {
   const contacts = await listContacts();
     const index = contacts.findIndex(item=> item.id === contactId); // (item=> item.id === contactsId)
    if (index === -1) {
        return null;
    }
    const [result] = contacts.splice(index, 1);
    await updtContact(contacts);
    return result;
}

const addContact = async (body) => {
  const contacts = await listContacts();
    const newContact = {
        id:nanoid(),
        ...body,
        
    }
    contacts.push(newContact);
    await updtContact(contacts);
    return newContact;
}

const updateContact = async (id, body) => {
   const contacts = await listContacts();
    const index = contacts.findIndex(item => item.id === id); // (item=> item.id === contactsId)
    if (index === -1) {
        return null;
    }
    contacts[index] = { id, ...body };
    await updtContact(contacts);
    return contacts[index];
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
