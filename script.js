document.addEventListener("DOMContentLoaded", async (event) => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    ScrollSmoother.create({
        smooth: 1,
        smoothTouch: 0.1,
    });
    const data = await getData();
    const posts = data.data.children;
    console.log(posts);
    posts.forEach(element => {
        console.log(data.data.children[1].data.title);
        let innerHTML = `<div class="post">
                    <div class="upvotes">${element.data.ups}</div>
                    <div class="post-title">${element.data.title}</div>
                </div>`;
        document.querySelector(".posts").innerHTML += innerHTML;
    });
});

async function getData() {
  const url = "https://www.reddit.com/r/Piracy/new.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error.message);
  }
}