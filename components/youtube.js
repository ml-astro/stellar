document.querySelectorAll(".video-wrapper").forEach(wrapper => {
    wrapper.addEventListener("click", function () {
        const videoId = this.getAttribute("data-video");
        const iframe = document.createElement("iframe");
        iframe.setAttribute("src", `https://www.youtube.com/embed/${videoId}?autoplay=1`);
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("allow", "autoplay; encrypted-media");
        iframe.setAttribute("allowfullscreen", "true");
        this.innerHTML = ""; // Убираем картинку и кнопку
        this.appendChild(iframe);
    });
});