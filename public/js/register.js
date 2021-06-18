const email = document.querySelector("#email");
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const submitBtn = document.querySelector(".submit-btn");

const emailErr = document.querySelector(".error.email");
const usernameErr = document.querySelector(".error.username");
const passwordErr = document.querySelector(".error.password");

submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  // reset errors
  usernameErr.innerHTML = "";
  emailErr.innerHTML = "";
  passwordErr.innerHTML = "";

  const data = {
    email: email.value,
    username: username.value,
    password: password.value,
  };

  try {
    const res = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resp = await res.json();

    if (resp.userId) {
      location.assign("/dashboard");
    }

    if (resp.errors) {
      usernameErr.innerHTML = resp.errors.username;
      emailErr.innerHTML = resp.errors.email;
      passwordErr.innerHTML = resp.errors.password;
    }
  } catch (err) {
    console.log(err);
  }
});
