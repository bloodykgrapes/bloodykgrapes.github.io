/*jslint browser */
"use strict";

document.addEventListener("DOMContentLoaded", function ()
{
    const form = document.getElementById("calc-form");
    const typeRadios = document.querySelectorAll("input[name='calc-type']");
    const selectWrap = document.getElementById("calc-property-select-wrap");
    const checkboxWrap = document.getElementById("calc-property-checkbox-wrap");
    const productSelect = document.getElementById("calc-select");
    const productCheckbox = document.getElementById("calc-checkbox");
    const quantityInput = document.getElementById("calc-quantity");
    const resultBox = document.getElementById("calc-result");
    const minusButton = document.getElementById("calc-minus");
    const plusButton = document.getElementById("calc-plus");

    const basePrices =
    {
        "1": 500,
        "2": 999,
        "3": 100
    };

    function updateVisibility() {
        let selectedType = "1";
        typeRadios.forEach(function (radio)
        {
            if (radio.checked) selectedType = radio.value;
        });

        if (selectedType === "1")
        {
            selectWrap.style.display = "none";
            checkboxWrap.style.display = "none";
        }
        else if (selectedType === "2")
        {
            selectWrap.style.display = "block";
            checkboxWrap.style.display = "none";
        }
        else if (selectedType === "3")
        {
            selectWrap.style.display = "none";
            checkboxWrap.style.display = "block";
        }
    }

    function getQuantity()
    {
        const val = parseInt(quantityInput.value, 10);
        if (isNaN(val) || val < 1) return 1;

        return val;
    }

    function calculate()
    {
        let selectedType = "1";
        typeRadios.forEach(function (radio)
        {
            if (radio.checked) selectedType = radio.value;
        });

        let price = basePrices[selectedType] || 0;

        if (selectedType === "2")
            price += parseInt(productSelect.value, 10) || 0;

        if (selectedType === "3" && productCheckbox.checked)
            price += parseInt(productCheckbox.value, 10) || 0;

        const total = price * getQuantity();
        resultBox.textContent = "Стоимость доставки: " + total.toLocaleString("ru-RU") + " ₽";
    }

    function changeQuantity(delta)
    {
        const currentQty = getQuantity();
        const newQty = Math.max(1, currentQty + delta);
        quantityInput.value = String(newQty);
        calculate();
    }

    typeRadios.forEach(function (radio)
    {
        radio.addEventListener("change", function ()
        {
            updateVisibility();
            calculate();
        });
    });

    productSelect.addEventListener("change", calculate);
    productCheckbox.addEventListener("change", calculate);

    quantityInput.addEventListener("input", function ()
    {
        quantityInput.value = quantityInput.value.replace(/[^1-9]/g, "");
        
        if (quantityInput.value !== "") calculate();
        else resultBox.textContent = "";
    });

    quantityInput.addEventListener("blur", function ()
    {
        if (quantityInput.value === "" || parseInt(quantityInput.value, 10) < 1)
            quantityInput.value = "1";
        calculate();
    });

    minusButton.addEventListener("click", function ()
    {
        changeQuantity(-1);
    });

    plusButton.addEventListener("click", function ()
    {
        changeQuantity(1);
    });

    form.addEventListener("submit", function (event)
    {
        event.preventDefault();
        calculate();
    });

    updateVisibility();
    calculate();
});