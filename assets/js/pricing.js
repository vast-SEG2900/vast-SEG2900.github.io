function togglePrice() {
    const isYearly = document.getElementById("togglePricing").checked;
    const prices = document.querySelectorAll(".price");
    const toggleCircle = document.getElementById("toggleCircle");

    if (isYearly) {
        prices[0].innerHTML = "$499";
        prices[1].textContent = "$699";
        toggleCircle.style.transform = "translateX(24px)";
    } else {
        prices[0].innerHTML = "$42 <span class=\"text-sm\">/ month</span>";
        prices[1].innerHTML = "$52 <span class=\"text-sm\">/ month</span>";
        toggleCircle.style.transform = "translateX(0)";
    }
}

function addToCart(product) {
    alert(`${product} has been added to your cart.`);
}