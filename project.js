document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const filterButtons = document.querySelectorAll('.filter-btn');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Load tasks on page load
    const loadTasks = (filter = 'all') => {
        taskList.innerHTML = '';
        tasks.filter(task => {
            if (filter === 'completed') return task.completed;
            if (filter === 'pending') return !task.completed;
            return true;
        }).forEach(addTaskToDOM);
    };

    // Save tasks to local storage
    const saveTasks = () => localStorage.setItem('tasks', JSON.stringify(tasks));

    // Add task to DOM
    const addTaskToDOM = task => {
        const li = document.createElement('li');
        li.classList.add('task');
        li.classList.toggle('completed', task.completed);
        li.setAttribute('data-id', task.id);
        li.innerHTML = `
            <span>${task.text}</span>
            <div>
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <button class="delete">Delete</button>
            </div>
        `;

        // Event listeners for checkbox and delete button
        li.querySelector('input[type="checkbox"]').addEventListener('click', () => toggleTask(task.id));
        li.querySelector('.delete').addEventListener('click', () => deleteTask(task.id));

        taskList.appendChild(li);
    };

    // Add task function
    const addTask = () => {
        const text = taskInput.value.trim();
        if (text) {
            const task = { id: Date.now(), text, completed: false };
            tasks.push(task);
            addTaskToDOM(task);
            saveTasks();
            taskInput.value = '';
        }
    };

    // Toggle task completed status
    const toggleTask = id => {
        tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
        saveTasks();
        loadTasks();
    };

    // Delete task
    const deleteTask = id => {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        loadTasks();
    };

    // Filter tasks
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            loadTasks(button.getAttribute('data-filter'));
        });
    });

    // Event listener for adding task
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', e => e.key === 'Enter' && addTask());

    // Initial load
    loadTasks();
});
