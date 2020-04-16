const {
  addUser,
  setUserOffline,
  consultUsers,
  getTaskByID,
  addTask,
  getTask,
  assignTask,
  getUser,
  validTask,
  unassignTask,
  problemTask,
  reportProblem
} = require("../users");

const notificationSocket = (io, socket) => {
  io.on("connect", (socket) => {
    // Connect a New USER and ADD it to the BACK
    socket.on("connectNew", ({ username }, callback) => {
      socket.join("onlineUsers");
      const userId = addUser({ id: socket.id, username });
      if (userId.task) {
        const taskItem = getTaskByID(userId.task);
        io.to(userId.id).emit("sendTask", taskItem);
      }
      const taskList = getTask();
      const userList = getUser();
      io.emit("getTask", { task: taskList });
      io.emit("getUser", { user: userList });
      callback(userId);
    });
    // Disconnect an User for a While
    socket.on("disconnectUser", ({ username }, callback) => {
      setUserOffline({ username });
      const userList = getUser();
      io.emit("getUser", { user: userList });
      callback();
    });
    socket.on("assignTask", ({ user, task_id }, callback) => {
      let data = assignTask({ username: user, task: task_id });
      io.to(data.userId).emit("sendTask", data.task);
      const taskList = getTask();
      const userList = getUser();
      io.emit("getTask", { task: taskList });
      io.emit("getUser", { user: userList });
      callback();
    });
    socket.on("unassignTask", ({ task }, callback) => {
      let data = unassignTask({ task: task });
      if (data) {
        io.to(data.userId).emit("sendTask", null);
      }
      const taskList = getTask();
      const userList = getUser();
      io.emit("getTask", { task: taskList });
      io.emit("getUser", { user: userList });
      callback();
    });
    socket.on("reportProblem", ({ task, problem }, callback) => {
      reportProblem({ task: task, problem: problem });
      io.to(data.userId).emit("sendTask", null);
      const taskList = getTask();
      const userList = getUser();
      io.emit("getTask", { task: taskList });
      io.emit("getUser", { user: userList });
      callback();
    });
    socket.on("consultUsers", ({}, callback) => {
      consultUsers({});
      console.log("OK");
      callback();
    });
    socket.on("finishTask", ({ task, username }, callback) => {
      validTask({ username: username, task: task });
      const taskList = getTask();
      const userList = getUser();
      io.emit("getTask", { task: taskList });
      io.emit("getUser", { user: userList });
      callback();
    });
    socket.on("reportProblem", ({ task, username, problem }, callback) => {
      problemTask({ username: username, task: task });
      const taskList = getTask();
      const userList = getUser();
      io.emit("getTask", { task: taskList });
      io.emit("getUser", { user: userList });
      callback();
    });
    socket.on("addTask", ({ task }, callback) => {
      const error = addTask({ task });
      callback(error);
      const taskList = getTask();
      const userList = getUser();
      io.emit("getTask", { task: taskList });
      io.emit("getUser", { user: userList });
    });
    //Disconnect and Delete an USER
    socket.on("disconnect", ({ username }) => {
      setUserOffline({ username });
      const userList = getUser();
      io.emit("getUser", { user: userList });
    });
  });
};

exports.notificationSocket = notificationSocket;
