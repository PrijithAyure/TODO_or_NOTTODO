const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');

// Load tasks from storage
function loadTasks() {
  chrome.storage.local.get(['tasks'], (result) => {
    if (result.tasks) {
      result.tasks.forEach((task) => addTaskToUI(task.text, task.completed));
    }
  });
}

// Save tasks to storage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll('#task-list li').forEach((li) => {
    tasks.push({
      text: li.querySelector('.task-text').innerText,
      completed: li.classList.contains('completed'),
    });
  });
  chrome.storage.local.set({ tasks });
}

// Add Task to UI
function addTaskToUI(taskText, completed = false) {
  const li = document.createElement('li');
  li.innerHTML = `
    <span class="task-text">${taskText}</span>
    <button class="delete-btn">✖</button>
  `;
  if (completed) li.classList.add('completed');

  li.addEventListener('click', () => {
    li.classList.toggle('completed');
    saveTasks();
  });

  li.querySelector('.delete-btn').addEventListener('click', () => {
    li.remove();
    saveTasks();
  });

  taskList.appendChild(li);
}

// Add Task
addBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  if (taskText) {
    addTaskToUI(taskText);
    saveTasks();
    taskInput.value = '';
  }
});

// Initialize
loadTasks();
