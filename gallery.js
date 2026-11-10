/*jslint browser */
"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const track = document.getElementById("gallery-track");
    const slides = document.querySelectorAll(".gallery-slide");
    const prevButton = document.getElementById("gallery-prev");
    const nextButton = document.getElementById("gallery-next");
    const pagerContainer = document.getElementById("gallery-pager");
    const status = document.getElementById("gallery-status");

    if (!track || slides.length === 0 || !pagerContainer || !prevButton || !nextButton) {
        return;
    }

    let currentIndex = 0;

    function getVisibleCount() {
        return window.innerWidth < 768 ? 1 : 3;
    }

    function renderPager(totalPages) {
        if (pagerContainer.children.length === totalPages) {
            Array.from(pagerContainer.children).forEach(function (dot, index) {
                dot.classList.toggle("active", index === currentIndex);
                if (index === currentIndex) {
                    dot.setAttribute("aria-current", "page");
                } else {
                    dot.removeAttribute("aria-current");
                }
            });
            return;
        }

        pagerContainer.innerHTML = "";
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = "gallery-dot" + (i === currentIndex ? " active" : "");
            dot.setAttribute("aria-label", "Перейти на страницу " + (i + 1));
            dot.setAttribute("aria-controls", "gallery-track");
            if (i === currentIndex) {
                dot.setAttribute("aria-current", "page");
            }
            
            // Замыкание для сохранения индекса по клику
            dot.addEventListener("click", (function (index) {
                return function () {
                    currentIndex = index;
                    updateGallery();
                };
            })(i));

            pagerContainer.appendChild(dot);
        }
    }

    function updateGallery() {
        const visibleCount = getVisibleCount();
        const totalPages = Math.max(1, slides.length - visibleCount + 1);

        if (currentIndex > totalPages - 1) {
            currentIndex = totalPages - 1;
        }
        if (currentIndex < 0) {
            currentIndex = 0;
        }

        const slideWidth = slides[0].getBoundingClientRect().width;
        track.style.transform = "translateX(" + (-currentIndex * slideWidth) + "px)";

        renderPager(totalPages);
        if (status) {
            status.textContent = "Страница " + (currentIndex + 1) + " из " + totalPages;
        }
    }

    prevButton.addEventListener("click", function () {
        const visibleCount = getVisibleCount();
        const totalPages = slides.length - visibleCount + 1;
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = totalPages - 1;
        }
        updateGallery();
    });

    nextButton.addEventListener("click", function () {
        const visibleCount = getVisibleCount();
        const totalPages = slides.length - visibleCount + 1;
        currentIndex++;
        if (currentIndex >= totalPages) {
            currentIndex = 0;
        }
        updateGallery();
    });

    window.addEventListener("resize", function () {
        updateGallery();
    });

    // Инициализация
    updateGallery();
});
