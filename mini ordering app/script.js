document.addEventListener('DOMContentLoaded', () => {

    const navLinks = document.querySelectorAll('.nav-links a');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartSection = document.getElementById('cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // --- Main function to handle all cart updates ---
    const updateCart = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartTotal();
    };

    // --- Renders the cart UI ---
    const renderCart = () => {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            return;
        }

        cart.forEach((item, index) => {
            const cartItemEl = document.createElement('div');
            cartItemEl.classList.add('cart-item');
            cartItemEl.innerHTML = `
                <span>${item.name} (x${item.quantity})</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
                <button class="remove-btn" data-index="${index}">Remove</button>
            `;
            cartItemsContainer.appendChild(cartItemEl);
        });
    };

    // --- Updates the total price ---
    const updateCartTotal = () => {
        const total = cart.reduce((accumulator, currentItem) => accumulator + (currentItem.price * currentItem.quantity), 0);
        cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
    };

    // --- Event listener for "Add to Cart" buttons ---
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.menu-card');
            const itemName = card.querySelector('h3').textContent;
            const itemPrice = parseFloat(card.querySelector('.price').textContent.replace('$', ''));

            const existingItem = cart.find(item => item.name === itemName);
            
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ name: itemName, price: itemPrice, quantity: 1 });
            }

            updateCart();
        });
    });

    // --- Event listener for "Remove" buttons within the cart ---
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) {
            const indexToRemove = parseInt(e.target.dataset.index);

            if (cart[indexToRemove].quantity > 1) {
                cart[indexToRemove].quantity--;
            } else {
                cart.splice(indexToRemove, 1);
            }

            updateCart();
        }
    });

    // --- Event listener for smooth navigation ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
        });
    });

    // --- Initial setup on page load ---
    renderCart();
    updateCartTotal();
});