window.addEventListener('load', function() {
    const form = document.querySelector('#new-task-form');
    const input = document.querySelector('#new-task-input');
    const list_el = document.querySelector('#tasks');

    // Load tasks from local storage
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTaskToDOM(task.text, task.completed));

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const task = input.value.trim();
        if (task === '') {
            alert('Please write a task in need of completion');
            return;
        }

        // Add task to local storage
        tasks.push({ text: task, completed: false });
        localStorage.setItem('tasks', JSON.stringify(tasks));

        // Add task to DOM
        addTaskToDOM(task, false);

        // Clear input
        input.value = '';
    });

    function addTaskToDOM(task, completed) {
        const task_el = document.createElement('div');
        task_el.classList.add('task');

        const task_content_el = document.createElement('span');
        task_content_el.classList.add('content');

        const checkbox_el = document.createElement('input');
        checkbox_el.type = 'checkbox';
        checkbox_el.classList.add('task-checkbox');
        checkbox_el.checked = completed;

        const task_input_el = document.createElement('input');
        task_input_el.classList.add('text');
        task_input_el.type = 'text';
        task_input_el.value = task;
        task_input_el.setAttribute('readonly', 'readonly');
        if (completed) task_input_el.style.textDecoration = 'line-through';

        const edit_button_el = document.createElement('button');
        edit_button_el.classList.add('edit');
        edit_button_el.textContent = 'Edit';

        const delete_button_el = document.createElement('button');
        delete_button_el.classList.add('delete');
        delete_button_el.textContent = 'Delete';

        task_content_el.appendChild(checkbox_el);
        task_content_el.appendChild(task_input_el);
        task_content_el.appendChild(edit_button_el);
        task_content_el.appendChild(delete_button_el);

        task_el.appendChild(task_content_el);
        list_el.appendChild(task_el);

        checkbox_el.addEventListener('change', function() {
            task_input_el.style.textDecoration = checkbox_el.checked ? 'line-through' : 'none';
            updateTaskLocalStorage(task, checkbox_el.checked);
            if (checkbox_el.checked) {
                list_el.appendChild(task_el);
            } else {
                list_el.insertBefore(task_el, list_el.firstChild);
            }
        });

        edit_button_el.addEventListener('click', function() {
            if (edit_button_el.textContent === 'Edit') {
                task_input_el.removeAttribute('readonly');
                task_input_el.focus();
                edit_button_el.textContent = 'Save';
            } else {
                task_input_el.setAttribute('readonly', 'readonly');
                editTaskLocalStorage(task, task_input_el.value);
                edit_button_el.textContent = 'Edit';
            }
        });

        delete_button_el.addEventListener('click', function() {
            list_el.removeChild(task_el);
            removeTaskFromLocalStorage(task);
        });
    }

    function updateTaskLocalStorage(task, completed) {
        const taskIndex = tasks.findIndex(t => t.text === task);
        if (taskIndex > -1) {
            tasks[taskIndex].completed = completed;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }

    function editTaskLocalStorage(oldTask, newTask) {
        const taskIndex = tasks.findIndex(t => t.text === oldTask);
        if (taskIndex > -1) {
            tasks[taskIndex].text = newTask;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }

    function removeTaskFromLocalStorage(task) {
        const newTasks = tasks.filter(t => t.text !== task);
        localStorage.setItem('tasks', JSON.stringify(newTasks));
    }
});