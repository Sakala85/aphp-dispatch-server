const uuid = require("node-uuid");
const users = [];
const tasks = [];

const consultUsers = ({}) => {
  console.log("USERS : ");
  console.log(users);
};

const setUserOffline = ({ username }) => {
  let index = users.findIndex((user) => user.username === username);
  if (index !== -1) {
    users[index].online = 0;
    console.log("User is now OFFLINE");
  }
};

const addUser = ({ id, username }) => {
  let index = users.findIndex((user) => user.username === username);
  if (index !== -1) {
    users[index].id = id;
    if (users[index].task !== null) {
      users[index].online = 2;
    } else {
      users[index].online = 1;
    }
    console.log(username + " is now ONLINE");
    return users[index];
  } else {
    const user = { id: id, username: username, online: 1, task: null };
    users.push(user);
    console.log(username + " is now ONLINE");
    return user;
  }
};

const removeUser = (id) => {
  let index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    users.splice(index, 1)[0];
    console.log("User removed");
  }
};

const addTask = ({ task }) => {
  const existingTask = tasks.find((ttask) => ttask.task === task);
  if (existingTask) {
    return { message: "Task already exist." };
  } else {
    const id_task = uuid.v1();

    const tmpTask = { id: id_task, task: task, assigned: 0 };
    tasks.push(tmpTask);
  }
};

const assignTask = ({ username, task }) => {
  let index = tasks.findIndex((ttask) => ttask.id === task);
  let data = {
    task: "",
    userId: "",
  };
  if (index !== -1) {
    tasks[index].assigned = 1;
    data.task = tasks[index].task;
  } else {
    return { message: "Task doesn't exist anymore." };
  }
  index = users.findIndex((user) => user.username === username);
  if (index !== -1) {
    users[index].task = task;
    users[index].online = 2;
    data.userId = users[index].id;
  } else {
    return { message: "User Offline." };
  }
  return data;
};

const validTask = (data) => {
  let index = tasks.findIndex((ttask) => ttask.task === data.task);
  if (index !== -1) {
    tasks[index].assigned = 2;
    console.log("task Validate");
  }
  index = users.findIndex((uuser) => uuser.username === data.username);
  if (index !== -1) {
    users[index].online = 1;
    console.log("User now free for work");
  }
};

const getTask = () => {
  return tasks;
};

const getUser = () => {
  return users;
};

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = {
  addUser,
  setUserOffline,
  consultUsers,
  removeUser,
  addTask,
  getTask,
  assignTask,
  getUser,
  validTask,
};
