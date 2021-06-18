const title = document.querySelector("#title");
const snippet = document.querySelector("#snippet");
const body = document.querySelector("#body");
const author = document.querySelector("#author");
const publishBtn = document.querySelector(".publish-btn");
const publishedBlogsContent = document.querySelector(
  ".published-blogs-content"
);

// error
const titleErr = document.querySelector(".error.title");
const snippetErr = document.querySelector(".error.snippet");
const bodyErr = document.querySelector(".error.body");

publishBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    const data = {
      title: title.value,
      snippet: snippet.value,
      body: body.value,
      author: author.value.replace(" ", ""),
    };
    const res = await fetch("/blog", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(data),
    });

    const resp = await res.json();

    if (resp.message == "success") {
      location.assign("/dashboard");
    }

    if (resp.errors) {
      titleErr.innerHTML = resp.errors.title;
      snippetErr.innerHTML = resp.errors.snippet;
      bodyErr.innerHTML = resp.errors.body;
    }
  } catch (err) {
    console.log(err);
  }
});

// fetch all blogs posted by logged in user
const getBlogs = async () => {
  try {
    const res = await fetch("/user/blogs");
    const { blogs } = await res.json();

    if (blogs) {
      blogs.forEach((blog) => {
        publishedBlogsContent.innerHTML += ` 
        <a href="/blog/${blog.author}/${blog._id}" class="blog">
          <h2 class="blog-title">${blog.title}</h2>
          <p class="blog-snippet">
          ${blog.snippet}
          </p>
        </a> 
        `;
      });
    }
  } catch (err) {
    console.log(err);
  }
};

getBlogs();
