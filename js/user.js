let tasks =
    JSON.parse(localStorage.getItem("tasks")) || [];

const currentUser =
    JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "user") {
    window.location.href = "login.html";
}

const welcomeName =
    document.getElementById("welcomeName");

if (welcomeName) {
    welcomeName.textContent = currentUser.name;
}

function saveTasks() {
    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

function getUserTasks() {

    return tasks.filter(function(task) {
        return task.userEmail === currentUser.email;
    });

}

function renderTasks() {

    const taskList =
        document.getElementById("taskList");

    const userTasks = getUserTasks();

    taskList.innerHTML = "";

    if (userTasks.length === 0) {

        taskList.innerHTML =
            "<p>No tasks yet. Click Add Task to create one.</p>";

        updateStatistics();

        return;
    }

    userTasks.forEach(function(task) {

        const taskCard =
            document.createElement("div");

        taskCard.className = "task-card";

        if (task.completed) {
            taskCard.classList.add("completed");
        }

        taskCard.innerHTML = `

            <div>

                <h3>${task.title}</h3>

                <p>
                    Category: ${task.category}
                    |
                    Priority: ${task.priority}
                </p>

                <small>
                    Deadline:
                    ${new Date(task.deadline).toLocaleString()}
                </small>

            </div>

            <div class="task-actions">

                <button onclick="completeTask(${task.id})">
                    ${task.completed ? "Undo" : "Complete"}
                </button>

                <button onclick="deleteTask(${task.id})">
                    Delete
                </button>

            </div>
        `;

        taskList.appendChild(taskCard);

    });

    updateStatistics();
}

function addTask() {

    const title =
        prompt("Enter task name:");

    if (!title) {
        return;
    }

    const category =
        prompt(
            "Enter category: Study / Project / Assignment / Personal"
        ) || "Other";

    const priority =
        prompt(
            "Enter priority: High / Medium / Low"
        ) || "Medium";

    const deadlineInput =
        prompt(
            "Enter deadline: YYYY-MM-DDTHH:MM"
        );

    if (!deadlineInput) {
        return;
    }

    const deadline =
        new Date(deadlineInput);

    if (isNaN(deadline.getTime())) {
        alert("Invalid date format.");
        return;
    }

    const task = {

        id: Date.now(),

        userEmail: currentUser.email,

        title: title,

        category: category,

        priority: priority,

        deadline: deadline.toISOString(),

        completed: false,

        completedDate: null

    };

    tasks.push(task);

    saveTasks();

    renderTasks();
}

function completeTask(id) {

    const task =
        tasks.find(function(item) {
            return item.id === id;
        });

    if (!task) {
        return;
    }

    task.completed =
        !task.completed;

    if (task.completed) {

        task.completedDate =
            new Date().toISOString();

    } else {

        task.completedDate = null;

    }

    saveTasks();

    renderTasks();
}

function deleteTask(id) {

    const confirmation =
        confirm("Delete this task?");

    if (!confirmation) {
        return;
    }

    tasks =
        tasks.filter(function(task) {
            return task.id !== id;
        });

    saveTasks();

    renderTasks();
}

function updateStatistics() {

    const userTasks =
        getUserTasks();

    const total =
        userTasks.length;

    const completed =
        userTasks.filter(function(task) {
            return task.completed;
        }).length;

    const pending =
        total - completed;

    const productivity =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
              );

    document.getElementById("totalTasks")
        .textContent = total;

    document.getElementById("completedTasks")
        .textContent = completed;

    document.getElementById("pendingTasks")
        .textContent = pending;

    document.getElementById("productivity")
        .textContent = productivity + "%";

    drawProgressChart();
}

document.getElementById("addTaskBtn")
    .addEventListener("click", addTask);

document.getElementById("logoutBtn")
    .addEventListener("click", function() {

        localStorage.removeItem("currentUser");

        window.location.href = "login.html";
    });

renderTasks();
