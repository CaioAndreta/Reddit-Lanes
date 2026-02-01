let data = localStorage.getItem("lanes");
let lanes = [];

try {
  const parsed = JSON.parse(data);
  if (Array.isArray(parsed)) {
    console.log(parsed);
    lanes = parsed;
  }
} catch (error) {
  console.warn("Dados do localStorage eram inválidos, resetando para []");
}

document.addEventListener("DOMContentLoaded", async (event) => {
  /* gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    ScrollSmoother.create({
        smooth: 1,
        smoothTouch: 0.1,
    }); */
  console.log("Lanes from storage: " + lanes);

  if (lanes.length > 0) {
    lanes.forEach((lane) => {
      getData(lane);
    });
  }

  document
    .querySelector(".new-lane .add-lane")
    .addEventListener("click", () => {
      document.querySelector(".new-lane .new-sub").classList.toggle("active");
    });

  const form = document.getElementById("sub-form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const subredditInput = document.getElementById("subreddit");
    let value = subredditInput.value.toLowerCase().trim();
    if (value === "") {
      return;
    }
    console.log("Subreddit to add: " + value);
    getData(value);
    subredditInput.value = "";
  });
});

async function getData(value) {
  const url = `https://www.reddit.com/r/${value}/new.json`;
  console.log("Fetching data from: " + url);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    if (!lanes.includes(value)) {
      lanes.push(value);
      localStorage.setItem("lanes", JSON.stringify(lanes));
    }

    const result = await response.json();
    console.log(result);
    const posts = result.data.children;
    let innerHTML = `<div class="lane">
                      <div class="lane-header">
                        <h2 class="title">/r/${value}</h2>
                        <button class="options">
                          <i class="fa-solid fa-ellipsis-vertical"></i>
                        </button>
                      </div>
                      <div class="posts">`;
    posts.forEach((post) => {
      innerHTML += `<div class="post">
                      <div class="upvotes">${post.data.ups}</div>
                      <div class="post-title">${post.data.title}</div>
                  </div>`;
    });
    innerHTML += `</div></div>`;
    document.querySelector(".lanes").innerHTML += innerHTML;
  } catch (error) {
    console.error(error.message);
    alert(
      "Failed to fetch subreddit data. Please check the subreddit name and try again.",
    );
  }
}
