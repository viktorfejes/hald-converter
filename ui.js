const faqBtn = document.querySelector(".faq-header");
const collapsible = document.querySelector(".collapsible");
const downloadBtn = document.getElementById("btn-hald");

faqBtn.addEventListener("click", function () {
    faqBtn.classList.toggle("down");

    if (collapsible.style.maxHeight) {
        collapsible.style.maxHeight = null;
        collapsible.style.opacity = 0;
    } else {
        collapsible.style.maxHeight = collapsible.scrollHeight + 80 + "px";
        collapsible.style.opacity = 1;
    }
});

// Download image by push of button
downloadBtn.addEventListener("click", function () {
    const link = document.createElement('a');
    link.download = "neutral_hald_512.png";
    link.href = "assets/neutral_hald_512.png";
    link.click();
});