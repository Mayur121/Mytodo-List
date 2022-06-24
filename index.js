// On app load, get all tasks from localStorage
window.onload = loadTasks;
const deleteAllBtn = document.getElementById("clear");

// On form submit add task
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  addTask();
});

var numberOfTasks = 0;
var pendingTasks = 0;
var updateTask = document.getElementById("task-update");
// function for updating the number of tasks
function taskUpdate() {
  updateTask.innerText = "Task pending: " + pendingTasks;
}

function loadTasks() {
  taskUpdate();
  var tasks = getLocalStorage();
  if (!tasks) {
    return;
  }

  if (tasks.length !== 0) {
    deleteAllBtn.classList.add("active");
  } else {
    deleteAllBtn.classList.remove("active");
  }

  // Loop through the tasks and add them to the list
  const list = document.querySelector("ul");
  list.innerHTML = "";
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.innerHTML = `<input type="checkbox" onclick="taskComplete(this)" class="check" ${
      task.completed ? "checked" : ""
    }>
       <input type="text" value="${task.task}" class="task ${
      task.completed ? "completed" : ""
    }" onfocus="getCurrentTask(this)" onblur="editTask(this)">
       <i class="fa fa-trash" onclick="removeTask(this)"></i>`;
    list.insertBefore(li, list.children[0]);
  });
  taskUpdate();
}

function addTask() {
  const task = document.querySelector("form input");
  const list = document.querySelector("ul");
  // return if task is empty
  let userData = task.value;
  if (userData.trim() === "") {
    alert("Please add a task!");
    return;
  }
  // check if task already exist
  if (document.querySelector(`input[value="${task.value}"]`)) {
    alert("Task already exist!");
    return;
  }

  // add task to local storage
  addItem({ task: task.value, completed: false });

  // create list item, add innerHTML and append to ul
  const li = document.createElement("li");
  li.innerHTML = `<input type="checkbox" onclick="taskComplete(this)" class="check">
   <input type="text" value="${task.value}" class="task" onfocus="getCurrentTask(this)" onblur="editTask(this)">
   <i class="fa fa-trash" onclick="removeTask(this)"></i>`;
  list.insertBefore(li, list.children[0]);
  // clear input
  task.value = "";
  numberOfTasks++;
  pendingTasks++;
  taskUpdate();
}

function taskComplete(event) {
  let tasks = getLocalStorage();
  tasks.forEach((task) => {
    if (task.task === event.nextElementSibling.value) {
      task.completed = !task.completed;
      if (task.completed) {
        pendingTasks--;
      } else {
        pendingTasks++;
      }
    }
  });
  setLocalStorage(tasks);
  event.nextElementSibling.classList.toggle("completed");
  taskUpdate();
}

function removeTask(event) {
  let tasks = getLocalStorage();
  tasks.forEach((task) => {
    if (task.task === event.parentNode.children[1].value) {
      // delete task
      tasks.splice(tasks.indexOf(task), 1);
    }
  });
  setLocalStorage(tasks);
  event.parentElement.remove();
  if (pendingTasks !== 0) {
    numberOfTasks--;
    pendingTasks--;
  }

  taskUpdate();
}

// store current task to track changes
var currentTask = null;

// get current task
function getCurrentTask(event) {
  currentTask = event.value;
}

// edit the task and update local storage
function editTask(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  // check if task is empty
  if (event.value === "") {
    alert("Task is empty!");
    event.value = currentTask;
    return;
  }
  // task already exist
  tasks.forEach((task) => {
    if (task.task === event.value) {
      alert("Task already exist!");
      event.value = currentTask;
      return;
    }
  });
  // update task
  tasks.forEach((task) => {
    if (task.task === currentTask) {
      task.task = event.value;
    }
  });
  // update local storage
  setLocalStorage(tasks);
}

//delete all tasks function
deleteAllBtn.onclick = () => {
  tasks = []; //empty the array
  // after deletion of all tasks update local storage again
  setLocalStorage(tasks);
  pendingTasks = 0;
  numberOfTasks = 0;
  taskUpdate();
  loadTasks();
};

const _localStorage = window.localStorage;

function addItem(task) {
  var totalItem = getLocalStorage();
  if (!totalItem) {
    totalItem = [task];
  } else {
    totalItem = [task, ...totalItem];
  }

  setLocalStorage(totalItem);
}

function setLocalStorage(tasks) {
  _localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getLocalStorage() {
  return JSON.parse(_localStorage.getItem("tasks"));
}
