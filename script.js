document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const categoryItems = document.querySelectorAll('.category-item');
    const categorySections = document.querySelectorAll('.category-section');
    let cart = [];
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.querySelector('.cart-count');
    const cartElement = document.querySelector('.cart');
    const cartToggle = document.querySelector('.cart-toggle');
    const closeCartBtn = document.querySelector('.close-cart');

    // Initially hide all category sections except the first one
    categorySections.forEach((section, index) => {
        if (index !== 0) {
            section.style.display = 'none';
        }
    });

    // Category selection functionality
    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            const selectedCategory = item.getAttribute('data-category');
            
            // Remove active class from all categories and add to the clicked one
            categoryItems.forEach(cat => cat.classList.remove('active'));
            item.classList.add('active');
            
            // Show only the selected category section
            categorySections.forEach(section => {
                if (section.id === `${selectedCategory}-section`) {
                    section.style.display = 'block';
                    section.style.animation = 'fadeIn 0.5s ease';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });

    // Add click event to each product card's "Adicionar ao Carrinho" button
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.classList.contains('add-to-cart-btn')) {
                const descriptionElement = this.querySelector('p');
                const product = {
                    id: Date.now(),
                    name: this.querySelector('h3').textContent,
                    description: descriptionElement ? descriptionElement.textContent : "", // valor padrão se não existir
                    price: parseFloat(this.querySelector('.price').textContent.replace('R$ ', '').replace(',', '.'))
                };

                cart.push(product);
                updateCart();
                showCart();
                showNotification('Produto adicionado ao carrinho!');
            }
        });
    });

    // Update cart contents and totals
    function updateCart() {
        cartItems.innerHTML = '';
        let total = 0;
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
        } else {
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.description}</p>
                        <div class="cart-item-price-row">
                            <span class="cart-item-price">R$ ${item.price.toFixed(2)}</span>
                            <button onclick="removeFromCart(${item.id})" class="remove-item">Remover</button>
                        </div>
                    </div>
                `;
                cartItems.appendChild(itemElement);
                total += item.price;
            });
        }
        cartTotal.textContent = total.toFixed(2);
        cartCount.textContent = cart.length;
    }

    // Remove an item from the cart
    window.removeFromCart = function(id) {
        cart = cart.filter(item => item.id !== id);
        updateCart();
        showNotification('Item removido do carrinho!');
    }

    // Show the cart by adding the 'active' class
    function showCart() {
        cartElement.classList.add('active');
    }
    // Hide the cart by removing the 'active' class
    function hideCart() {
        cartElement.classList.remove('active');
    }

    // Toggle cart visibility when clicking the cart icon
    cartToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        cartElement.classList.toggle('active');
    });
    
    // Close cart when clicking the close button
    closeCartBtn.addEventListener('click', hideCart);

    // Hide cart if clicking outside of it
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.cart') && !e.target.closest('.cart-toggle')) {
            hideCart();
        }
    });

    // Show a simple notification message
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    }

    // Ensure cart is updated on load
    updateCart();

    // Seleciona os elementos do modal de checkout
    const checkoutBtn = document.querySelector('.checkout-btn');
    const checkoutModal = document.getElementById('checkout-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const checkoutForm = document.getElementById('checkout-form');

    // Ao clicar em "Finalizar Compra", exibe o modal, caso o carrinho não esteja vazio
    checkoutBtn.addEventListener('click', function() {
        // Se necessário, verifique se o carrinho tem itens
        if (cart.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }
        checkoutModal.style.display = 'block';
    });

    // Fecha o modal ao clicar no "x"
    closeModalBtn.addEventListener('click', function() {
        checkoutModal.style.display = 'none';
    });

    // Fecha o modal se o usuário clicar fora do conteúdo
    window.addEventListener('click', function(e) {
        if (e.target === checkoutModal) {
            checkoutModal.style.display = 'none';
        }
    });

    // Ao enviar o formulário, captura os dados de endereço e pagamento
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Captura os dados do formulário
        const address = document.getElementById('address').value;
        const payment = document.getElementById('payment').value;
        
        // Crie uma mensagem para enviar via WhatsApp
        const message = `Olá, gostaria de confirmar minha compra. Endereço: ${address}. Forma de Pagamento: ${payment}.`;
        
        // Construa a URL do WhatsApp (utilizando o número informado: 14 998882414)
        // O formato de URL é: https://api.whatsapp.com/send?phone=NUMERO&text=MENSAGEM
        // Remova quaisquer espaços do número
        const phone = "14998882414";
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
        
        // Redirecione para a URL do WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Opcional: feche o modal e limpe o carrinho se necessário
        document.getElementById('checkout-modal').style.display = 'none';
        cart = [];
        updateCart();
    });
});