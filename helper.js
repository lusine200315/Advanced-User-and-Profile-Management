function updateUser(users, id, newData) {
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) {
    return null;
  }

  users[userIndex] = {
    ...users[userIndex],
    ...newData,
  };

  return users[userIndex];
}

module.exports = { updateUser };
