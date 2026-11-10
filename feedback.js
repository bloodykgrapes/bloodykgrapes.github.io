/*jslint browser */
document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    // Paste your Formcarry form URL here: https://formcarry.com/s/yourFormId
    const endpoint = "https://formcarry.com/s/Rp5V4bdoxuH";
    const storageKey = "exercise8.feedbackDraft";
    const dialog = document.getElementById("feedback-dialog");
    const form = document.getElementById("feedback-form");
    const fieldset = document.getElementById("feedback-fields");
    const consent = document.getElementById("feedback-consent");
    const submit = document.getElementById("feedback-submit");
    const status = document.getElementById("feedback-status");
    const close = document.getElementById("feedback-close");
    const openButtons = document.querySelectorAll("[data-feedback-open]");
    const controls = Array.from(form.querySelectorAll("input, textarea"));
    let opener = null;
    let sending = false;

    function setStatus(message, state) {
        status.textContent = message;
        status.dataset.state = state;
    }

    function formValues() {
        const values = {};
        controls.forEach(function (control) {
            if (control.type === "checkbox") {
                values[control.name] = control.checked;
            } else {
                values[control.name] = control.value;
            }
        });
        return values;
    }

    function saveDraft() {
        try {
            localStorage.setItem(storageKey, JSON.stringify(formValues()));
        } catch (ignore) {
            // The form also works when browser storage is unavailable.
        }
    }

    function restoreDraft() {
        try {
            const draft = JSON.parse(localStorage.getItem(storageKey));
            if (draft && typeof draft === "object") {
                controls.forEach(function (control) {
                    if (control.type === "checkbox") {
                        control.checked = draft[control.name] === true;
                    } else if (typeof draft[control.name] === "string") {
                        control.value = draft[control.name];
                    }
                });
            }
        } catch (ignore) {
            // Ignore an unreadable draft and leave the fields empty.
        }
    }

    function clearDraft() {
        try {
            localStorage.removeItem(storageKey);
        } catch (ignore) {
            // Storage may be disabled by browser settings.
        }
    }

    function syncDialog() {
        if (window.location.hash === "#feedback") {
            if (!dialog.open) {
                opener = document.activeElement;
                dialog.showModal();
                document.body.classList.add("feedback-open");
            }
        } else if (dialog.open) {
            dialog.close();
            document.body.classList.remove("feedback-open");
            if (opener && opener.isConnected) {
                opener.focus({preventScroll: true});
            }
        }
    }

    function openDialog() {
        if (window.location.hash !== "#feedback") {
            window.history.pushState({feedbackPopup: true}, "", "#feedback");
        }
        syncDialog();
    }

    function closeDialog() {
        if (
            window.history.state
            && window.history.state.feedbackPopup === true
        ) {
            window.history.back();
        } else {
            const url = new URL(window.location.href);
            url.hash = "";
            window.history.replaceState(window.history.state, "", url);
            syncDialog();
        }
    }

    function setSending(value) {
        sending = value;
        fieldset.disabled = value;
        consent.disabled = value;
        submit.disabled = value;
        if (value) {
            submit.textContent = "Отправляем…";
        } else {
            submit.textContent = "Отправить";
        }
        form.setAttribute("aria-busy", String(value));
    }

    function showError() {
        setStatus(
            "Не удалось отправить. Проверьте соединение "
            + "и попробуйте ещё раз.",
            "error"
        );
    }

    async function sendForm(event) {
        event.preventDefault();
        if (sending) {
            return;
        }
        const name = form.elements.namedItem("name");
        const message = form.elements.namedItem("message");
        name.value = name.value.trim();
        message.value = message.value.trim();
        if (!form.reportValidity()) {
            return;
        }
        saveDraft();
        if (!endpoint) {
            setStatus("Отправка пока не настроена. Попробуйте позже.", "error");
            return;
        }

        const values = formValues();
        const controller = new AbortController();
        const timeout = window.setTimeout(function () {
            controller.abort();
        }, 20000);
        setSending(true);
        setStatus("Отправляем сообщение…", "sending");
        try {
            const response = await fetch(endpoint, {
                body: JSON.stringify(values),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                method: "POST",
                signal: controller.signal
            });
            const result = await response.json();
            if (response.ok && result.code === 200) {
                form.reset();
                clearDraft();
                setStatus(
                    "Сообщение отправлено. Спасибо за обращение!",
                    "success"
                );
            } else {
                showError();
            }
        } catch (ignore) {
            showError();
        } finally {
            window.clearTimeout(timeout);
            setSending(false);
        }
    }

    openButtons.forEach(function (button) {
        button.addEventListener("click", openDialog);
    });
    close.addEventListener("click", closeDialog);
    dialog.addEventListener("cancel", function (event) {
        event.preventDefault();
        closeDialog();
    });
    dialog.addEventListener("click", function (event) {
        const bounds = dialog.getBoundingClientRect();
        if (
            event.target === dialog
            && (
                event.clientX < bounds.left
                || event.clientX > bounds.right
                || event.clientY < bounds.top
                || event.clientY > bounds.bottom
            )
        ) {
            closeDialog();
        }
    });
    window.addEventListener("popstate", syncDialog);
    window.addEventListener("hashchange", syncDialog);
    form.addEventListener("input", function () {
        saveDraft();
        if (!sending) {
            setStatus("", "");
        }
    });
    form.addEventListener("change", saveDraft);
    form.addEventListener("submit", sendForm);

    restoreDraft();
    syncDialog();
});
