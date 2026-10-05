function updateDigitalClock() {

    const clock =
        document.getElementById("digitalClock");

    if (!clock) {
        return;
    }

    clock.textContent =
        new Date().toLocaleTimeString();
}

setInterval(updateDigitalClock, 1000);

updateDigitalClock();

function updateCountdown() {

    const currentUser =
        JSON.parse(
            localStorage.getItem("currentUser")
        );

    if (!currentUser) {
        return;
    }

    const tasks =
        JSON.parse(
            localStorage.getItem("tasks")
        ) || [];

    const upcomingTasks =
        tasks
        .filter(function(task) {

            return (
                task.userEmail === currentUser.email &&
                !task.completed &&
                new Date(task.deadline) > new Date()
            );

        })
        .sort(function(a, b) {

            return (
                new Date(a.deadline) -
                new Date(b.deadline)
            );

        });

    const nameElement =
        document.getElementById("nextTaskName");

    const countdownElement =
        document.getElementById("countdown");

    if (upcomingTasks.length === 0) {

        nameElement.textContent =
            "No upcoming task";

        countdownElement.textContent =
            "--:--:--";

        return;
    }

    const nextTask =
        upcomingTasks[0];

    nameElement.textContent =
        nextTask.title;

    const difference =
        new Date(nextTask.deadline) -
        new Date();

    const totalSeconds =
        Math.floor(
            difference / 1000
        );

    const days =
        Math.floor(
            totalSeconds / 86400
        );

    const hours =
        Math.floor(
            (totalSeconds % 86400) / 3600
        );

    const minutes =
        Math.floor(
            (totalSeconds % 3600) / 60
        );

    const seconds =
        totalSeconds % 60;

    countdownElement.textContent =
        `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

setInterval(updateCountdown, 1000);

updateCountdown();

function drawProgressChart() {

    const canvas =
        document.getElementById("progressChart");

    if (!canvas) {
        return;
    }

    const context =
        canvas.getContext("2d");

    const currentUser =
        JSON.parse(
            localStorage.getItem("currentUser")
        );

    const tasks =
        JSON.parse(
            localStorage.getItem("tasks")
        ) || [];

    const completedTasks =
        tasks.filter(function(task) {

            return (
                task.userEmail === currentUser.email &&
                task.completed &&
                task.completedDate
            );

        });

    const days =
        ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const values =
        days.map(function(day, index) {

            const today =
                new Date();

            const date =
                new Date(today);

            const currentDay =
                today.getDay();

            const mondayOffset =
                currentDay === 0
                    ? -6
                    : 1 - currentDay;

            date.setDate(
                today.getDate() +
                mondayOffset +
                index
            );

            const dateString =
                date.toISOString().split("T")[0];

            return completedTasks.filter(
                function(task) {

                    return task.completedDate
                        .startsWith(dateString);

                }
            ).length;

        });

    context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    const left = 50;
    const bottom = 250;
    const top = 30;
    const chartWidth = 700;
    const chartHeight = 200;

    const maximum =
        Math.max(...values, 1);

    context.font = "14px Arial";

    // axes
    context.beginPath();

    context.moveTo(left, top);

    context.lineTo(left, bottom);

    context.lineTo(
        left + chartWidth,
        bottom
    );

    context.stroke();

    // line
    context.beginPath();

    values.forEach(function(value, index) {

        const x =
            left +
            (index * chartWidth / 6);

        const y =
            bottom -
            (value / maximum) *
            chartHeight;

        if (index === 0) {
            context.moveTo(x, y);
        } else {
            context.lineTo(x, y);
        }

        context.fillText(
            days[index],
            x - 10,
            bottom + 20
        );

        context.fillText(
            value,
            x - 3,
            y - 10
        );

    });

    context.stroke();
}
