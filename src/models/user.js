let users = [];
let nextId = 1;

function createUser(email, password) {
  const user = { id: nextId++, email, password };
  users.push(user);
  return user;
}

function findUserByEmail(email) {
  return users.find(u => u.email === email);
}

function findUserById(id) {
  return users.find(u => u.id === id);
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};
