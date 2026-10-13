/*jslint browser */
"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("calc-form");
    const productSelect = document.getElementById("calc-product");
    const quantityInput = document.getElementById("calc-quantity");
    const resultBox = document.getElementById("calc-result");
    const button = document.getElementById("calc-button");
    const minusButton = document.getElementById("calc-minus");
    const plusButton = document.getElementById("calc-plus");

    function getQuantity() {
        return Math.max(0, parseInt(quantityInput.value, 10) || 0);
    }

    function calculate() {
        const price = parseInt(productSelect.value, 10);
        const total = price * getQuantity();

        resultBox.textContent = "Стоимость заказа: " + total.toLocaleString("ru-RU") + " ₽";
    }

    function changeQuantity(delta) {
        quantityInput.value = String(Math.max(0, getQuantity() + delta));
        resultBox.textContent = "";
    }

    quantityInput.addEventListener("input", function () {
        quantityInput.value = quantityInput.value.replace(/[^0-9]/g, "");
        resultBox.textContent = "";
    });
    button.addEventListener("click", calculate);
    minusButton.addEventListener("click", function () {
        changeQuantity(-1);
    });
    plusButton.addEventListener("click", function () {
        changeQuantity(1);
    });
    productSelect.addEventListener("change", function () {
        resultBox.textContent = "";
    });
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        calculate();
    });
});