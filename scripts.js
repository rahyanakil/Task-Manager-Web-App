document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
});

document.getElementById('taskForm').addEventListener('submit', function(event) {
    event.preventDefault();
    addTask();
});

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const priorityInput = document.getElementById('priorityInput');
    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value;
    const priority = priorityInput.value;
    if (taskText === '') return;

    const taskList = document.getElementById('taskList');
    const li = document.createElement('li');
    li.classList.add(priority.toLowerCase());
    li.innerHTML = `
        <span>${taskText}</span>
        <span>${dueDate ? 'Due: ' + dueDate : ''}</span>
        <button class="edit-button" onclick="editTask(this)">Edit</button>
        <button class="complete-button" onclick="toggleComplete(this)">Complete</button>
        <button onclick="deleteTask(this)">Delete</button>
    `;
    taskList.appendChild(li);
    taskInput.value = '';
    dueDateInput.value = '';
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

function searchTasks() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const taskList = document.getElementById('taskList');
    const tasks = taskList.getElementsByTagName('li');
    for (let task of tasks) {
        const taskText = task.querySelector('span').textContent.toLowerCase();
        if (taskText.includes(query)) {
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
            dueDate: li.querySelectorAll('span')[1]?.textContent.replace('Due: ', '') || '',
            priority: li.className.split(' ')[0],
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
        li.classList.add(task.priority);
        if (task.completed) {
            li.classList.add('completed');
        }
        li.innerHTML = `
            <span>${task.text}</span>
            <span>${task.dueDate ? 'Due: ' + task.dueDate : ''}</span>
            <button class="edit-button" onclick="editTask(this)">Edit</button>
            <button class="complete-button" onclick="toggleComplete(this)">Complete</button>
            <button onclick="deleteTask(this)">Delete</button>
        `;
        taskList.appendChild(li);
    });
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    document.querySelector('.container').classList.toggle('dark-mode');
}
