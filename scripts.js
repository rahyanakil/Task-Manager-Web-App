document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
    checkNotifications();
});

document.getElementById('taskForm').addEventListener('submit', function(event) {
    event.preventDefault();
    addTask();
});

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const priorityInput = document.getElementById('priorityInput');
    const categoryInput = document.getElementById('categoryInput');
    const descriptionInput = document.getElementById('descriptionInput');
    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value;
    const priority = priorityInput.value;
    const category = categoryInput.value;
    const description = descriptionInput.value.trim();
    if (taskText === '') return;

    const taskList = document.getElementById('taskList');
    const li = document.createElement('li');
    li.classList.add(priority.toLowerCase(), category.toLowerCase());
    li.innerHTML = `
        <span>${taskText}</span>
        <span>${dueDate ? 'Due: ' + dueDate : ''}</span>
        <span>${category ? 'Category: ' + category : ''}</span>
        <span>${description ? 'Description: ' + description : ''}</span>
        <button class="edit-button" onclick="editTask(this)">Edit</button>
        <button class="complete-button" onclick="toggleComplete(this)">Complete</button>
        <button onclick="deleteTask(this)">Delete</button>
    `;
    taskList.appendChild(li);
    taskInput.value = '';
    dueDateInput.value = '';
    descriptionInput.value = '';
    saveTasks();
    checkNotifications();
}

function deleteTask(button) {
    const li = button.parentElement;
    li.remove();
    saveTasks();
    checkNotifications();
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

function sortTasks(criteria) {
    const taskList = document.getElementById('taskList');
    const tasks = Array.from(taskList.getElementsByTagName('li'));
    tasks.sort((a, b) => {
        if (criteria === 'dueDate') {
            const dueDateA = a.querySelectorAll('span')[1]?.textContent.replace('Due: ', '') || '';
            const dueDateB = b.querySelectorAll('span')[1]?.textContent.replace('Due: ', '') || '';
            return new Date(dueDateA) - new Date(dueDateB);
        } else if (criteria === 'priority') {
            const priorityA = a.classList.contains('high') ? 1 : a.classList.contains('medium') ? 2 : 3;
            const priorityB = b.classList.contains('high') ? 1 : b.classList.contains('medium') ? 2 : 3;
            return priorityA - priorityB;
        } else if (criteria === 'category') {
            const categoryA = a.classList.contains('work') ? 1 : a.classList.contains('personal') ? 2 : 3;
            const categoryB = b.classList.contains('work') ? 1 : b.classList.contains('personal') ? 2 : 3;
            return categoryA - categoryB;
        }
    });
    tasks.forEach(task => taskList.appendChild(task));
}

function saveTasks() {
    const taskList = document.getElementById('taskList');
    const tasks = [];
    taskList.querySelectorAll('li').forEach(li => {
        tasks.push({
            text: li.querySelector('span').textContent,
            dueDate: li.querySelectorAll('span')[1]?.textContent.replace('Due: ', '') || '',
            priority: li.className.split(' ')[0],
            category: li.className.split(' ')[1],
            description: li.querySelectorAll('span')[3]?.textContent.replace('Description: ', '') || '',
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
        li.classList.add(task.priority, task.category);
        if (task.completed) {
            li.classList.add('completed');
        }
        li.innerHTML = `
            <span>${task.text}</span>
            <span>${task.dueDate ? 'Due: ' + task.dueDate : ''}</span>
            <span>${task.category ? 'Category: ' + task.category : ''}</span>
            <span>${task.description ? 'Description: ' + task.description : ''}</span>
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

function checkNotifications() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const now = new Date();
    tasks.forEach(task => {
        if (task.dueDate) {
            const dueDate = new Date(task.dueDate);
            const timeDiff = dueDate - now;
            if (timeDiff > 0 && timeDiff <= 24 * 60 * 60 * 1000) {
                alert(`Task "${task.text}" is due soon!`);
            }
        }
    });
}
