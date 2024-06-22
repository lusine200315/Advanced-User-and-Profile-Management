const express = require("express");
const app = express();

const body_parser = require("body-parser");
const { updateUser } = require("./helper");

const fs = require("fs");

app.use(body_parser.json());

const PORT = 3001;

// create users
app.post("/users", (req, res) => {
  try {
    const { id, name, email, password } = req.body;
    // check if value is not only spaces
    if (!id.trim() || !name.trim() || !email.trim() || !password.trim()) {
      return res.status(400).send("doesnt exist");
    }

    let current_user = {
      id,
      name,
      email,
      password,
    };

    const users_data = fs.readFileSync("users.json");
    const users = JSON.parse(users_data);
    users.push(current_user);

    fs.writeFileSync("users.json", JSON.stringify(users));

    res.send(current_user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// get users
app.get("/users", (req, res) => {
  try {
    const all_users = fs.readFileSync("users.json");
    const result = JSON.parse(all_users);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// get user
app.get("/users/:id", (req, res) => {
  try {
    const id = req.params.id;
    const users_data = fs.readFileSync("users.json");
    const users = JSON.parse(users_data);
    const user = users.find((user) => user.id === id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// update user
app.put("/users/:id", (req, res) => {
  try {
    const { name, email, password } = req.body;
    const id = req.params.id;
    const users_data = fs.readFileSync("users.json");
    const users = JSON.parse(users_data);

    const updatedUser = updateUser(users, id, { name, email, password });

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    fs.writeFileSync("users.json", JSON.stringify(users));

    res.send(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// delete user
app.delete("/users/:id", (req, res) => {
  try {
    const id = req.params.id;
    const users_data = fs.readFileSync("Users.json");
    const users = JSON.parse(users_data);
    const userToDelete = users.findIndex((user) => user.id == id);

    if (userToDelete == -1) {
      return res.status(404).send("User not found");
    }

    const updatedUsers = users.filter((user) => user.id != id);
    fs.writeFileSync("users.json", JSON.stringify(updatedUsers));

    res.send(userToDelete);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// create user profile
app.post("/users/:id/profile", (req, res) => {
  try {
    const id = req.params.id;
    const { bio, picture } = req.body;
    const users_data = fs.readFileSync("Users.json");
    const users = JSON.parse(users_data);

    const updatedUser = updateUser(users, id, { profile: { bio, picture } });

    fs.writeFileSync("users.json", JSON.stringify(users));

    res.send(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// get user profile
app.get("/users/:id/profile", (req, res) => {
  try {
    const id = req.params.id;
    const users_data = fs.readFileSync("Users.json");
    const users = JSON.parse(users_data);
    const user = users.find((user) => user.id === id);

    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user.profile);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// user profile update
app.put("/users/:id/profile", (req, res) => {
  try {
    const id = req.params.id;
    const { bio, picture } = req.body;
    const users_data = fs.readFileSync("Users.json");
    const users = JSON.parse(users_data);

    const updatedUser = updateUser(users, id, { profile: { bio, picture } });

    fs.writeFileSync("users.json", JSON.stringify(users));
    res.send(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// user profile delete
app.delete("/users/:id/profile", (req, res) => {
  try {
    const id = req.params.id;
    const users_data = fs.readFileSync("Users.json");
    const users = JSON.parse(users_data);
    const user = users.find((user) => user.id === id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    const updatedUsers = users.filter((user) => user.id != id);
    fs.writeFileSync("users.json", JSON.stringify(updatedUsers));

    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// update picture url
app.put("/users/:id/profile/picture", (req, res) => {
  try {
    const id = req.params.id;
    const { picture } = req.body;
    const users_data = fs.readFileSync("Users.json");
    const users = JSON.parse(users_data);
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return res.status(404).send("User not found");
    }

    const existingProfile = users[userIndex].profile || {};
    const updatedProfile = { ...existingProfile, picture };

    const updatedUser = updateUser(users, id, { profile: updatedProfile });

    fs.writeFileSync("users.json", JSON.stringify(users));
    res.send(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT);
