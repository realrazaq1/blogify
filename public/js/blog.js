const deleteBlogBtn = document.querySelector(".delete-blog-btn");
const editBlogBtn = document.querySelector(".edit-blog-btn");
const updateBlogContainer = document.querySelector(".update-blog-container");
const title = document.querySelector("#title");
const snippet = document.querySelector("#snippet");
const body = document.querySelector("#body");
const author = document.querySelector("#author");
const publishBtn = document.querySelector(".publish-btn");

// delete blog
deleteBlogBtn.addEventListener("click", async (e) => {
  const { blogId } = deleteBlogBtn.dataset;
  console.log(blogId);
  try {
    const res = await fetch("/blog", {
      headers: { "Content-Type": "application/json" },
      method: "DELETE",
      body: JSON.stringify({ blogId }),
    });

    const resp = await res.json();
    console.log(resp);

    if (resp.message == "blog deleted successfully") {
      location.assign("/dashboard");
    }
  } catch (err) {
    console.log(err);
  }
});

editBlogBtn.addEventListener("click", (e) => {
  updateBlogContainer.classList.add("show-update-container");
});
updateBlogContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("update-blog-container")) {
    updateBlogContainer.classList.remove("show-update-container");
  }
});

// update blog
publishBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const { blogId } = publishBtn.dataset;
  console.log(blogId);
  const data = {
    title: title.value,
    snippet: snippet.value,
    body: body.value,
    author: author.value,
    blogId,
  };

  try {
    const res = await fetch("/blog", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const resp = await res.json();
    console.log(resp);
    location.reload();
  } catch (err) {
    console.log(err);
  }
});
