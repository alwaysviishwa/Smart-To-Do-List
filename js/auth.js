function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

// SIGNUP
const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name =
            document.getElementById("signupName").value.trim();

        const email =
            document.getElementById("signupEmail").value.trim();

        const password =
            document.getElementById("signupPassword").value;

        const users = getUsers();

        const existingUser = users.find(function(user) {
            return user.email === email;
        });

        if (existingUser) {
            document.getElementById("signupMessage").textContent =
                "This email is already registered.";
            return;
        }

        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            password: password,
            role: "user"
        };

        users.push(newUser);

        saveUsers(users);

        alert("Signup successful. Please login.");

        window.location.href = "login.html";
    });
}

// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;

        // ADMIN LOGIN
        if (
            email === "admin@smarttodo.com" &&
            password === "admin123"
        ) {

            const admin = {
                name: "Administrator",
                email: email,
                role: "admin"
            };

            localStorage.setItem(
                "currentUser",
                JSON.stringify(admin)
            );

            window.location.href = "admin-dashboard.html";

            return;
        }

        // USER LOGIN
        const users = getUsers();

        const user = users.find(function(account) {

            return (
                account.email === email &&
                account.password === password
            );

        });

        if (!user) {

            document.getElementById("loginMessage").textContent =
                "Invalid email or password.";

            return;
        }

        localStorage.setItem(
            "currentUser",
            JSON.stringify(user)
        );

        window.location.href = "user-dashboard.html";
    });
}
