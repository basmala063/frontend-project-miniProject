
const loginPage = document.getElementById("loginPage");
const signupPage = document.getElementById("signupPage");
const profilePage = document.getElementById("profilePage");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const profileForm = document.getElementById("profileForm");

const loginMessage = document.getElementById("loginMessage");
const signupMessage = document.getElementById("signupMessage");
const profileMessage = document.getElementById("profileMessage");

const editButton = document.getElementById("editButton");
const saveButton = document.getElementById("saveButton");
const logoutButton = document.getElementById("logoutButton");

let currentUser = null;

// Show a specific page
function showPage(pageId) {
    loginPage.classList.add("hidden");
    signupPage.classList.add("hidden");
    profilePage.classList.add("hidden");

    document.getElementById(pageId).classList.remove("hidden");

    clearMessages();
}

// Clear all messages
function clearMessages() {
    loginMessage.textContent = "";
    signupMessage.textContent = "";
    profileMessage.textContent = "";

    loginMessage.className = "message";
    signupMessage.className = "message";
    profileMessage.className = "message";
}

// Display a message
function showMessage(element, message, type) {
    element.textContent = message;
    element.className = "message " + type;
}

// Get the saved account
function getAccount() {
    const savedAccount = localStorage.getItem("savoraAccount");

    if (savedAccount) {
        return JSON.parse(savedAccount);
    }

    return null;
}

// Save the account
function saveAccount(account) {
    localStorage.setItem("savoraAccount", JSON.stringify(account));
}

// Email validation
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ---------------- SIGN UP ----------------

signupForm.addEventListener("submit", function (event) {
    event.preventDefault();
    clearMessages();

    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("signupEmail").value.trim().toLowerCase();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!name || !email || !phone || !password || !confirmPassword) {
        showMessage(signupMessage, "Please fill in all required fields.", "error");
        return;
    }

    if (!isValidEmail(email)) {
        showMessage(signupMessage, "Please enter a valid email address.", "error");
        return;
    }

    if (password.length < 6) {
        showMessage(signupMessage, "Password must be at least 6 characters.", "error");
        return;
    }

    if (password !== confirmPassword) {
        showMessage(signupMessage, "Passwords do not match.", "error");
        return;
    }

    const existingAccount = getAccount();

    if (existingAccount) {
        showMessage(
            signupMessage,
            "An account already exists. Please log in.",
            "error"
        );
        return;
    }

    const account = {
        name: name,
        email: email,
        phone: phone,
        password: password,
        address: ""
    };

    saveAccount(account);

    signupForm.reset();

    showMessage(
        loginMessage,
        "Account created successfully! Please log in.",
        "success"
    );

    showPage("loginPage");

    // Show the success message after switching pages
    showMessage(
        loginMessage,
        "Account created successfully! Please log in.",
        "success"
    );
});

// ---------------- LOGIN ----------------

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    clearMessages();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        showMessage(loginMessage, "Please enter your email and password.", "error");
        return;
    }

    if (!isValidEmail(email)) {
        showMessage(loginMessage, "Please enter a valid email address.", "error");
        return;
    }

    const account = getAccount();

    if (!account) {
        showMessage(
            loginMessage,
            "No account found. Please create an account first.",
            "error"
        );
        return;
    }

    if (account.email !== email || account.password !== password) {
        showMessage(
            loginMessage,
            "Incorrect email or password. Please try again.",
            "error"
        );
        return;
    }

    currentUser = account;

    localStorage.setItem("savoraLoggedIn", "true");

    loginForm.reset();
    loadProfile();
});

// ---------------- PROFILE ----------------

function loadProfile() {
    if (!currentUser) {
        return;
    }

    document.getElementById("profileName").value = currentUser.name;
    document.getElementById("profileEmail").value = currentUser.email;
    document.getElementById("profilePhone").value = currentUser.phone;
    document.getElementById("profileAddress").value = currentUser.address || "";

    setProfileEditing(false);
    showPage("profilePage");
}

// Enable or disable profile editing
function setProfileEditing(editing) {
    document.getElementById("profileName").disabled = !editing;
    document.getElementById("profileEmail").disabled = !editing;
    document.getElementById("profilePhone").disabled = !editing;
    document.getElementById("profileAddress").disabled = !editing;

    saveButton.disabled = !editing;
    editButton.disabled = editing;
}

// Edit Profile button
editButton.addEventListener("click", function () {
    clearMessages();
    setProfileEditing(true);

    showMessage(
        profileMessage,
        "You can now edit your profile information.",
        "success"
    );
});

// Save Changes button
profileForm.addEventListener("submit", function (event) {
    event.preventDefault();
    clearMessages();

    if (!currentUser) {
        return;
    }

    const name = document.getElementById("profileName").value.trim();
    const email = document.getElementById("profileEmail").value.trim().toLowerCase();
    const phone = document.getElementById("profilePhone").value.trim();
    const address = document.getElementById("profileAddress").value.trim();

    if (!name || !email || !phone) {
        showMessage(
            profileMessage,
            "Name, email and phone number are required.",
            "error"
        );
        return;
    }

    if (!isValidEmail(email)) {
        showMessage(profileMessage, "Please enter a valid email address.", "error");
        return;
    }

    currentUser.name = name;
    currentUser.email = email;
    currentUser.phone = phone;
    currentUser.address = address;

    saveAccount(currentUser);

    setProfileEditing(false);

    showMessage(
        profileMessage,
        "Your profile has been saved successfully!",
        "success"
    );
});

// ---------------- LOGOUT ----------------

logoutButton.addEventListener("click", function () {
    currentUser = null;

    localStorage.removeItem("savoraLoggedIn");

    profileForm.reset();
    loginForm.reset();

    clearMessages();
    showPage("loginPage");

    showMessage(loginMessage, "You have logged out successfully.", "success");
});

// ---------------- RESTORE SESSION ----------------

// Restore the logged-in page after refreshing
function restoreSession() {
    const account = getAccount();
    const loggedIn = localStorage.getItem("savoraLoggedIn");

    if (account && loggedIn === "true") {
        currentUser = account;
        loadProfile();
    } else {
        showPage("loginPage");
    }
}

// Start the application
restoreSession();
