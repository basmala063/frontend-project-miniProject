(() => {
  const A = FoodApp;
  const $ = id => document.getElementById(id);
  let active = "login";
  
  const auth = $("auth-view");
  const profile = $("profile-view");
  const login = $("login-form");
  const signup = $("signup-form");

  function current() {
    return A.getUser();
  }

  function showAuth(mode) {
    active = mode;
    auth.classList.remove("hidden");
    profile.classList.add("hidden");
    login.classList.toggle("hidden", mode !== "login");
    signup.classList.toggle("hidden", mode !== "signup");
    
    document.querySelectorAll("[data-auth]").forEach(b => 
      b.classList.toggle("active", b.dataset.auth === mode)
    );
    
    $("login-message").textContent = "";
    $("signup-message").textContent = "";
  }

  function showProfile() {
    const u = current();
    if (!u) return;
    
    auth.classList.add("hidden");
    profile.classList.remove("hidden");
    $("profile-name").value = u.name || "";
    $("profile-email").value = u.email || "";
    $("profile-phone").value = u.phone || "";
    $("profile-address").value = u.address || "";
  }

  document.querySelectorAll("[data-auth]").forEach(b => 
    b.addEventListener("click", () => showAuth(b.dataset.auth))
  );

  login.addEventListener("submit", e => {
    e.preventDefault();
    const email = $("login-email").value.trim().toLowerCase();
    const password = $("login-password").value;
    const account = A.read("foodAppAccount", null);
    
    if (!account || account.email !== email || account.password !== password) {
      $("login-message").textContent = "Email or password is incorrect. Create an account first if needed.";
      return;
    }
    
    const user = {
      name: account.name,
      email: account.email,
      phone: account.phone || "",
      address: account.address || ""
    };
    
    A.write(A.USER_KEY, user);
    showProfile();
  });

  signup.addEventListener("submit", e => {
    e.preventDefault();
    const name = $("signup-name").value.trim();
    const email = $("signup-email").value.trim().toLowerCase();
    const password = $("signup-password").value;
    
    if (name.length < 2) {
      $("signup-message").textContent = "Please enter your full name.";
      return;
    }
    if (password.length < 6) {
      $("signup-message").textContent = "Password must be at least 6 characters.";
      return;
    }
    
    const existing = A.read("foodAppAccount", null);
    if (existing && existing.email === email) {
      $("signup-message").textContent = "An account with this email already exists.";
      return;
    }
    
    const account = { name, email, password, phone: "", address: "" };
    A.write("foodAppAccount", account);
    A.write(A.USER_KEY, { name, email, phone: "", address: "" });
    showProfile();
  });

  $("profile-form").addEventListener("submit", e => {
    e.preventDefault();
    const user = {
      name: $("profile-name").value.trim(),
      email: $("profile-email").value.trim().toLowerCase(),
      phone: $("profile-phone").value.trim(),
      address: $("profile-address").value.trim()
    };
    
    if (!user.name || !user.email) {
      $("profile-message").textContent = "Name and email are required.";
      return;
    }
    
    A.write(A.USER_KEY, user);
    const account = A.read("foodAppAccount", null);
    
    if (account && account.email === user.email) {
      A.write("foodAppAccount", { ...account, ...user });
    }
    
    $("profile-message").textContent = "Profile saved.";
  });

  $("logout-btn").addEventListener("click", () => {
    localStorage.removeItem(A.USER_KEY);
    showAuth("login");
  });

  if (current()) {
    showProfile();
  } else {
    showAuth("login");
  }
})();