const uuid = require("node-uuid");
const users = [];
const tasks = [];
const endedTasks = [];

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

const getTaskByID = ({ task_id }) => {
  let index = tasks.findIndex((ttask) => ttask.id === task_id);
  if (index !== -1) {
    return tasks[index].task;
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

    const tmpTask = { id: id_task, task: task, assigned: 0, username: null };
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
    tasks[index].username = username;
    data.task = tasks[index].task;
  } else {
    return { message: "Task doesn't exist anymore." };
  }
  const taskName = tasks[index].task;
  index = users.findIndex((user) => user.username === username);
  if (index !== -1) {
    users[index].task = taskName;
    users[index].online = 2;
    data.userId = users[index].id;
  } else {
    return { message: "User Offline." };
  }
  return data;
};

const unassignTask = ({ task }) => {
  let index = tasks.findIndex((ttask) => ttask.task === task);
  let data = {
    task: "",
    userId: "",
  };
  if (index !== -1) {
    tasks[index].username = null;
    tasks[index].assigned = 0;
    data.task = null;
  } else {
    return { message: "Task doesn't exist anymore." };
  }
  const taskName = tasks[index].task;
  index = users.findIndex((user) => user.task === taskName);
  if (index !== -1) {
    users[index].task = null;
    if (users[index].online === 2) {
      users[index].online = 1;
    }
    data.userId = users[index].id;
  }
  return data;
};

const deleteTask = ({ task }) => {
  let index = tasks.findIndex((ttask) => ttask.task === task);
  if (index !== -1) {
    tasks.splice(index, 1)[0];
  }
};

const validTask = (data) => {
  let index = tasks.findIndex((ttask) => ttask.task === data.task);
  if (index !== -1) {
    endedTask = {
      task: tasks[index],
      problem: null,
    };
    endedTasks.push(endedTask);
    tasks.splice(index, 1)[0];
    console.log("task Validate");
  }
  index = users.findIndex((uuser) => uuser.username === data.username);
  if (index !== -1) {
    users[index].online = 1;
    users[index].task = null;
    console.log("User now free for work");
  }
};

const reportProblem = (data) => {
  let index = tasks.findIndex((ttask) => ttask.task === data.task);
  if (index !== -1) {
    endedTask = {
      task: tasks[index],
      problem: data.problem,
    };
    endedTasks.push(endedTask);
    tasks[index].assigned = 2;
    tasks[index].username = null;
  }
  index = users.findIndex((uuser) => uuser.username === data.username);
  if (index !== -1) {
    users[index].online = 1;
    users[index].task = null;
    console.log("User now free for work");
  }
  return users[index].id;
};

const getTask = () => {
  return tasks;
};

const getUser = () => {
  const userSorted1 = users.filter((user) => user.online === 1);
  const userSorted2 = userSorted1.concat(users.filter((user) => user.online === 2));
  const userSorted = userSorted2.concat(users.filter((user) => user.online === 0));
  return userSorted;
};

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
  getTaskByID,
  unassignTask,
  deleteTask,
  reportProblem,
};
