document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("loader");

    // Simulating loading time
    setTimeout(() => {
        loader.style.display = "none";
    }, 2000); // Loader will disappear after 2 seconds
});