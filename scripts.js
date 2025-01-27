document.addEventListener('DOMContentLoaded', loadTasks);

document.getElementById('taskForm').addEventListener('submit', function(event) {
    event.preventDefault();
    addTask();
});

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const taskList = document.getElementById('taskList');
    const li = document.createElement('li');
    li.innerHTML = `
        <span>${taskText}</span>
        <button class="edit-button" onclick="editTask(this)">Edit</button>
        <button class="complete-button" onclick="toggleComplete(this)">Complete</button>
        <button onclick="deleteTask(this)">Delete</button>
    `;
    taskList.appendChild(li);
    taskInput.value = '';
    saveTasks();
}

function deleteTask(button) {
    const li = button.parentElement;
    li.remove();
    saveTasks();
}

function toggleComplete(button) {
    const li = button.parentElement;
    li.classList.toggle('completed');
    saveTasks();
}

function editTask(button) {
    const li = button.parentElement;
    const taskText = li.querySelector('span').textContent;
    const newTaskText = prompt('Edit task:', taskText);
    if (newTaskText !== null) {
        li.querySelector('span').textContent = newTaskText;
        saveTasks();
    }
}

function filterTasks(status) {
    const taskList = document.getElementById('taskList');
    const tasks = taskList.getElementsByTagName('li');
    for (let task of tasks) {
        if (status === 'all') {
            task.style.display = '';
        } else if (status === 'completed' && task.classList.contains('completed')) {
            task.style.display = '';
        } else if (status === 'pending' && !task.classList.contains('completed')) {
            task.style.display = '';
        } else {
            task.style.display = 'none';
        }
    }
}

function saveTasks() {
    const taskList = document.getElementById('taskList');
    const tasks = [];
    taskList.querySelectorAll('li').forEach(li => {
        tasks.push({
            text: li.querySelector('span').textContent,
            completed: li.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskList = document.getElementById('taskList');
    tasks.forEach(task => {
        const li = document.createElement('li');
        if (task.completed) {
            li.classList.add('completed');
        }
        li.innerHTML = `
            <span>${task.text}</span>
            <button class="edit-button" onclick="editTask(this)">Edit</button>
            <button class="complete-button" onclick="toggleComplete(this)">Complete</button>
            <button onclick="deleteTask(this)">Delete</button>
        `;
        taskList.appendChild(li);
    });
}
