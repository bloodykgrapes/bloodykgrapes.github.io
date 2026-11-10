/*jslint browser */
"use strict";

document.addEventListener("DOMContentLoaded", function () {
    if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
        || !window.IntersectionObserver
    ) {
        return;
    }

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("page-enter");
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: "0px 0px -20px 0px",
        threshold: 0
    });

    document.querySelectorAll("#header, main section, #footer").forEach(
        function (element) {
            observer.observe(element);
        }
    );
});
