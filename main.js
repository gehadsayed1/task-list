document.addEventListener("DOMContentLoaded", function () {
  let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(function (task) {
    addTaskToList(task.text, task.image, task.url);
  });
});

function addTask() {
  let taskInput = document.getElementById("taskInput");
  let taskText = taskInput.value.trim();
  let imageInput = document.getElementById("imageInput");
  let taskImage = imageInput.files[0];

  if (taskText !== "") {
    addTaskToList(taskText, taskImage);
    saveTaskToLocalStorage(taskText, taskImage);
    taskInput.value = "";
    imageInput.value = "";
  }
}

function addTaskToList(taskText, taskImage) {
  let taskList = document.getElementById("taskList");
  let taskItem = document.createElement("li");
  taskItem.className = "task-item";

  // Check if taskImage is available in localStorage
  let imageURL = getImageURLFromLocalStorage(taskText);

  // Add HTML elements based on retrieved data
  if (taskImage && taskImage instanceof Blob) {
    let reader = new FileReader();
    reader.onload = function (event) {
      imageURL = event.target.result;
      createTaskItem(taskItem, taskText, imageURL);
    };
    reader.readAsDataURL(taskImage);
  } else {
    createTaskItem(taskItem, taskText, imageURL);
  }

  // Function to create task item HTML
  function createTaskItem(taskItem, taskText, imageURL) {
    taskItem.innerHTML = `
          <input type="checkbox" onchange="toggleTask(this)">
          <span>${taskText}</span>
          ${imageURL ? `<img src="${imageURL}" alt="Task Image">` : ""}
          <button class="bted" onclick="editTask(this)">Edit</button>
          <button class="btdan" onclick="deleteTask(this)">Delete</button>
      `;
    taskList.appendChild(taskItem);
  }
}

function toggleTask(checkbox) {
  let taskItem = checkbox.parentElement;
  if (checkbox.checked) {
    taskItem.classList.add("completed");
  } else {
    taskItem.classList.remove("completed");
  }
  updateLocalStorage();
}

function saveTaskToLocalStorage(taskText, taskImage) {
  let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let task = {
    text: taskText,
    image: taskImage ? taskImage.name : null,
  };
  savedTasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(savedTasks));
}

function updateLocalStorage() {
  let tasks = [];
  let taskItems = document.querySelectorAll(".task-item");
  taskItems.forEach(function (taskItem) {
    let taskText = taskItem.querySelector("span").textContent;
    let taskImage = taskItem.querySelector("img");
    let imageName = taskImage ? taskImage.alt : null;
    let imageURL = getImageURLFromLocalStorage(taskText); // Get image URL from localStorage
    tasks.push({ text: taskText, image: imageName, url: imageURL }); // Include image URL in the task data
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Save image URL to localStorage
function saveImageURLToLocalStorage(taskText, imageURL) {
  let savedImages = JSON.parse(localStorage.getItem("images")) || {};
  savedImages[taskText] = imageURL;
  localStorage.setItem("images", JSON.stringify(savedImages));
}

// Get image URL from localStorage
function getImageURLFromLocalStorage(taskText) {
  let savedImages = JSON.parse(localStorage.getItem("images")) || {};
  return savedImages[taskText] || "";
}

function editTask(button) {
  let taskItem = button.parentElement;
  let taskText = taskItem.querySelector("span");
  let taskImage = taskItem.querySelector("img");
  let newTaskText = prompt("Edit Task:", taskText.textContent);
  if (newTaskText !== null) {
    taskText.textContent = newTaskText;
    let taskTextValue = newTaskText;
    let imageURL = taskImage ? taskImage.src : null;
    saveImageURLToLocalStorage(taskTextValue, imageURL); // حفظ الصورة في localStorage مع النص الجديد
    updateLocalStorage();
  }
}

function deleteTask(button) {
  let taskItem = button.parentElement;
  taskItem.remove();
  updateLocalStorage();
}

function deleteAllTasks() {
  let taskList = document.getElementById("taskList");
  taskList.innerHTML = ""; // Remove all task items from the taskList element
  localStorage.removeItem("tasks"); // Remove the tasks from localStorage
}
