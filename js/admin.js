const loggedInUser =
    JSON.parse(
        localStorage.getItem("currentUser")
    );

if (
    !loggedInUser ||
    loggedInUser.role !== "admin"
) {
    window.location.href = "login.html";
}

const users =
    JSON.parse(
        localStorage.getItem("users")
    ) || [];

const tasks =
    JSON.parse(
        localStorage.getItem("tasks")
    ) || [];

const completed =
    tasks.filter(function(task) {
        return task.completed;
    }).length;

const pending =
    tasks.length - completed;

document.getElementById("adminUsers")
    .textContent = users.length;

document.getElementById("adminTasks")
    .textContent = tasks.length;

document.getElementById("adminCompleted")
    .textContent = completed;

document.getElementById("adminPending")
    .textContent = pending;

const userList =
    document.getElementById("userList");

if (users.length === 0) {

    userList.innerHTML =
        "<p>No registered users.</p>";

} else {

    users.forEach(function(user) {

        const row =
            document.createElement("div");

        row.className = "task-card";

        row.innerHTML = `
            <div>
                <h3>${user.name}</h3>
                <p>${user.email}</p>
            </div>
            <strong>User</strong>
        `;

        userList.appendChild(row);

    });
}

const adminTaskList =
    document.getElementById("adminTaskList");

if (tasks.length === 0) {

    adminTaskList.innerHTML =
        "<p>No tasks found.</p>";

} else {

    tasks.forEach(function(task) {

        const row =
            document.createElement("div");

        row.className = "task-card";

        row.innerHTML = `
            <div>
                <h3>${task.title}</h3>
                <p>
                    ${task.category}
                    |
                    ${task.priority}
                </p>
                <small>
                    ${task.userEmail}
                </small>
            </div>

            <strong>
                ${task.completed
                    ? "Completed"
                    : "Pending"}
            </strong>
        `;

        adminTaskList.appendChild(row);

    });
}

function updateAdminClock() {

    const clock =
        document.getElementById("adminClock");

    clock.textContent =
        new Date().toLocaleTimeString();
}

setInterval(updateAdminClock, 1000);

updateAdminClock();

document.getElementById("adminLogout")
    .addEventListener(
        "click",
        function() {

            localStorage.removeItem(
                "currentUser"
            );

            window.location.href =
                "login.html";
        }
    );
