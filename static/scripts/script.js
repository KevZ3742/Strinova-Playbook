window.onhashchange = function () {
    const navLinks = document.querySelectorAll('a');
    navLinks.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add("active")
        } else {
            link.classList.remove("active")
        }
    });
};
