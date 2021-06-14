const username = document.querySelector("#username");
const password = document.querySelector("#password");
const submitBtn = document.querySelector(".submit-btn");

const usernameErr = document.querySelector(".error.username");
const passwordErr = document.querySelector(".error.password");

submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  // reset errors
  usernameErr.innerHTML = "";
  passwordErr.innerHTML = "";

  const data = {
    username: username.value,
    password: password.value,
  };

  try {
    const res = await fetch("/login", {
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
      passwordErr.innerHTML = resp.errors.password;
    }
  } catch (err) {
    console.log(err);
  }
});
