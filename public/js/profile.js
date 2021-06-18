const form = document.querySelector("form");
const fileInput = document.querySelector("#file");
const oldPw = document.querySelector("#oldpw");
const newPw = document.querySelector("#newpw");
const updateBtn = document.querySelector(".update-btn");
const pp = document.querySelector(".pp");
const uploadSuccess = document.querySelector(".upload-msg.success");
const uploadError = document.querySelector(".upload-msg.error");
const editPP = document.querySelector(".edit-pp");
const fileName = document.querySelector(".filename");
const username = document.querySelector("#username").value;
const feedback = document.querySelector(".feedback");

// edit pp button
editPP.addEventListener("click", (e) => {
  fileInput.click();
});

// upload profile picture
fileInput.addEventListener("change", async (e) => {
  // const nameSplit = fileInput.value.split('\\');
  // fileName.innerHTML = nameSplit[nameSplit.length - 1];

  // ...........................

  const data = new FormData();
  data.append("username", username);
  data.append("profile-pic", fileInput.files[0]);

  const res = await fetch("/profile/upload_pp", {
    method: "POST",
    body: data,
  });
  const resp = await res.json();
  console.log(resp);
  if (resp.message == "wrong file format") {
    feedback.innerHTML = "You can only upload images.";
    feedback.classList.add("error");
    feedback.style.display = "block";

    setTimeout(() => {
      feedback.style.display = "none";
    }, 5000);
  }
  if (resp.message == "File too large") {
    feedback.innerHTML = "File is too large. Should not be more than 3MB";
    feedback.classList.add("error");
    feedback.style.display = "block";

    setTimeout(() => {
      feedback.style.display = "none";
    }, 5000);
  }
  if (resp.message == "success") {
    // pp.setAttribute('src', `/uploads/${resp.filename}`)

    feedback.innerHTML = "Profile picture updated successfully...";
    feedback.classList.add("success");
    feedback.style.display = "block";

    setTimeout(() => {
      location.reload();
    }, 2500);
  }
});

// update password
updateBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  // send old pw and new pw to the server
  const data = {
    oldPw: oldPw.value,
    newPw: newPw.value,
    username,
  };
  const res = await fetch("/profile/update_pw", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const resp = await res.json();
  console.log(resp);
  if (resp.message == "password updated") {
    feedback.innerHTML = "password updated successfully...";
    feedback.classList.add("success");
    feedback.style.display = "block";

    setTimeout(() => {
      location.reload();
    }, 5000);
  }
  if (resp.message == "old password is invalid") {
    feedback.innerHTML = "old password didn't match the one in our record";
    feedback.classList.add("error");
    feedback.style.display = "block";

    setTimeout(() => {
      feedback.style.display = "none";
    }, 5000);
  }
});
