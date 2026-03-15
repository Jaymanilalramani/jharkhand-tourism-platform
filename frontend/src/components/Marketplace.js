import React, { useState } from 'react';

const Marketplace = () => {
  const [products] = useState([
    { 
      id: 1, 
      name: 'Tribal Wooden Crafts', 
      price: 850, 
      category: 'Handicrafts',
      description: 'Handcrafted wooden artifacts made by local tribal artisans using traditional techniques.',
      image: 'https://tse2.mm.bing.net/th/id/OIP.U-Ax2xoe06rm347XRIq0EgHaFb?pid=Api&P=0&h=180',
      rating: 4.5,
      reviews: 24,
      stock: 10
    },
    { 
      id: 2, 
      name: 'Sohrai Art Painting', 
      price: 1200, 
      category: 'Art',
      description: 'Traditional Sohrai art form painted on canvas by indigenous artists of Jharkhand.',
      image: 'https://tse4.mm.bing.net/th/id/OIP.Nt83gtk2vXH1k_Zi6ck35wHaDt?pid=Api&P=0&h=180',
      rating: 4.8,
      reviews: 18,
      stock: 5
    },
    { 
      id: 3, 
      name: 'Bamboo Handicrafts', 
      price: 650, 
      category: 'Handicrafts',
      description: 'Eco-friendly bamboo products crafted by skilled local artisans.',
      image: 'https://oddessemania.in/wp-content/uploads/2024/04/handicrafts-of-meghalaya-Cane-and-bamboo-products-768x512.jpg',
      rating: 4.3,
      reviews: 31,
      stock: 15
    },
    { 
      id: 4, 
      name: 'Paitkar Scroll Painting', 
      price: 1500, 
      category: 'Art',
      description: 'One of the oldest tribal paintings in India, depicting cultural heritage and folklore.',
      image: 'https://tse1.mm.bing.net/th/id/OIP.lAQhsp_XsVpRJAvyi9-80QHaE-?pid=Api&P=0&h=180',
      rating: 4.9,
      reviews: 12,
      stock: 3
    },
    { 
      id: 5, 
      name: 'Tussar Silk Stole', 
      price: 1800, 
      category: 'Apparel',
      description: 'Exquisite hand-woven Tussar silk stole, known for its rich texture and natural gold sheen.',
      image: 'https://tse3.mm.bing.net/th/id/OIP.LrH9daLiPxcXOiIQWrpItAHaJR?pid=Api&P=0&h=180',
      rating: 4.7,
      reviews: 21,
      stock: 8
    }
  ]);

  const renderChatAssistant = () => (
    <div className="marketplace-chat-wrapper">
      {chatOpen ? (
        <div className="market-chat-window">
          <div className="market-chat-header">
            <span>Artisan Assistant</span>
            <button onClick={() => setChatOpen(false)}>✕</button>
          </div>
          <div className="market-chat-messages">
            {chatMessages.map((m, i) => (
              <div key={i} className={`market-msg ${m.isBot ? 'bot' : 'user'}`}>
                {m.text}
              </div>
            ))}
            {isTyping && (
              <div className="market-msg bot typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            )}
          </div>
          <form onSubmit={handleChatSend} className="market-chat-input">
            <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask about crafts..." />
            <button type="submit">Send</button>
          </form>
        </div>
      ) : (
        <button className="market-chat-toggle" onClick={() => setChatOpen(true)}>💬 Chat with Artisan</button>
      )}
    </div>
  );

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [showCart, setShowCart] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { text: "Namaste! I'm your Jharkhand Artisan Assistant. Ask me about our traditional crafts or shipping details.", isBot: true }
  ]);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationProduct, setNotificationProduct] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [checkoutStep, setCheckoutStep] = useState(0); // 0: cart, 1: shipping, 2: payment, 3: confirmation
  const [orderDetails, setOrderDetails] = useState(null);

  // Checkout form state
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: 'Jharkhand',
    pincode: '',
    paymentMethod: 'card'
  });

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (product.stock && existingItem?.quantity >= product.stock) {
      setNotificationProduct(product.name);
      setNotificationType('outOfStock');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    setNotificationProduct(product.name);
    setNotificationType('cart');
    setShowNotification(true);
    
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const toggleWishlist = (product) => {
    if (wishlist.find(item => item.id === product.id)) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
      setNotificationProduct(product.name);
      setNotificationType('removeWishlist');
    } else {
      setWishlist([...wishlist, product]);
      setNotificationProduct(product.name);
      setNotificationType('wishlist');
    }
    
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    const product = products.find(p => p.id === productId);
    if (product.stock && newQuantity > product.stock) {
      setNotificationProduct(product.name);
      setNotificationType('maxQuantity');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }
    
    setCart(cart.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQuantity } 
        : item
    ));
  };

  const handleCheckoutInput = (e) => {
    setCheckoutForm({
      ...checkoutForm,
      [e.target.name]: e.target.value
    });
  };

  const proceedToCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutStep(1);
  };

  const goBackToCart = () => {
    setCheckoutStep(0);
  };

  const submitShipping = () => {
    // Validate form here in a real application
    setCheckoutStep(2);
  };

  const submitPayment = () => {
    // Process payment here in a real application
    const order = {
      id: Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleDateString(),
      items: cart,
      total: total,
      shipping: checkoutForm
    };
    
    setOrderDetails(order);
    setCheckoutStep(3);
    setCart([]); // Clear cart after successful order
  };

  const continueShopping = () => {
    setCheckoutStep(0);
    setShowCart(false);
  };

  const handleChatSend = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMsg = { text: chatInput, isBot: false };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);
    
    setTimeout(() => {
      let botResponse = "Our products are sourced directly from tribal cooperatives in Jharkhand. Every purchase supports local artisan livelihoods. How can I help you today?";
      
      const input = chatInput.toLowerCase();
      if (input.includes("price") || input.includes("cost")) {
        botResponse = "Our prices range from ₹650 for bamboo crafts to ₹1800 for premium Tussar silk. Which category interests you?";
        if (input.includes("tussar")) botResponse = "The Tussar Silk Stole is priced at ₹1800. It's hand-woven and features a natural gold sheen.";
      }
      else if (input.includes("bulk") || input.includes("wholesale"))
        botResponse = "Yes, we handle bulk orders for corporate gifting or events. Please email us at artisans@jharkhandtourism.gov.in for a quote.";
      if (input.includes("shipping") || input.includes("delivery")) 
        botResponse = "We ship across India! Delivery within Jharkhand takes 2-3 days, while other states take 5-7 business days.";
      else if (input.includes("sohrai")) 
        botResponse = "Sohrai is a traditional mural art form. Our paintings are made by women artisans from the Hazaribagh region.";
      else if (input.includes("discount") || input.includes("offer")) 
        botResponse = "We keep our prices fair to ensure artisans get maximum benefit, but we offer free shipping on orders above ₹2000!";
      else if (input.includes("hello") || input.includes("hi")) 
        botResponse = "Hello! How can I help you discover Jharkhand's heritage today?";

      setChatMessages(prev => [...prev, { text: botResponse, isBot: true }]);
      setIsTyping(false);
    }, 1000);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const categories = ['All', ...new Set(products.map(product => product.category))];

  return (
    <div className="marketplace-container">
      <header className="marketplace-header">
        <h2>Jharkhand Tribal Marketplace</h2>
        <p>Discover authentic tribal crafts and products from local artisans</p>
      </header>

      <div className="controls-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filters-container">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="default">Sort by</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      <div className="action-indicators">
        <div className="wishlist-indicator" onClick={() => setShowWishlist(true)}>
          <span className="wishlist-icon">❤️</span>
          <span className="wishlist-count">{wishlistCount}</span>
          <span className="wishlist-text">Wishlist</span>
        </div>

        <div className="cart-indicator" onClick={() => setShowCart(true)}>
          <span className="cart-icon">🛒</span>
          <span className="cart-count">{itemCount}</span>
          <span className="cart-text">View Cart</span>
        </div>
      </div>

      <div className="products-grid">
        {sortedProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.image} alt={product.name} />
              <div className="product-overlay">
                <span className="category-badge">{product.category}</span>
                <button 
                  className={`wishlist-btn ${wishlist.find(item => item.id === product.id) ? 'active' : ''}`}
                  onClick={() => toggleWishlist(product)}
                >
                  ❤️
                </button>
                <div className="rating">
                  <span className="stars">{"★".repeat(Math.floor(product.rating))}{"☆".repeat(5 - Math.floor(product.rating))}</span>
                  <span className="rating-text">({product.reviews})</span>
                </div>
              </div>
            </div>
            <div className="product-content">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-footer">
                <p className="product-price">₹{product.price}</p>
                <button
                  onClick={() => addToCart(product)}
                  className="add-to-cart-btn"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedProducts.length === 0 && (
        <div className="no-products">
          <h3>No products found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Cart Sidebar */}
      <div className={`cart-sidebar ${showCart ? 'active' : ''}`}>
        <div className="cart-header">
          <h3>Your Cart ({itemCount} items)</h3>
          <button className="close-cart" onClick={() => setShowCart(false)}>×</button>
        </div>
        
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <span className="cart-icon-large">🛒</span>
              <button className="continue-shopping" onClick={() => setShowCart(false)}>
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p>₹{item.price} × {item.quantity}</p>
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <button 
                  className="remove-item"
                  onClick={() => removeFromCart(item.id)}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
        
        {cart.length > 0 && checkoutStep === 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total: ₹{total}</span>
            </div>
            <button className="checkout-btn" onClick={proceedToCheckout}>
              Proceed to Checkout
            </button>
          </div>
        )}

        {/* Checkout Steps */}
        {checkoutStep > 0 && (
          <div className="checkout-steps">
            {/* Shipping Information */}
            {checkoutStep === 1 && (
              <div className="checkout-step">
                <h3>Shipping Information</h3>
                <div className="checkout-form">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={checkoutForm.name}
                      onChange={handleCheckoutInput}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={checkoutForm.email}
                      onChange={handleCheckoutInput}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <textarea
                      name="address"
                      value={checkoutForm.address}
                      onChange={handleCheckoutInput}
                      placeholder="Enter your shipping address"
                    />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={checkoutForm.city}
                      onChange={handleCheckoutInput}
                      placeholder="Enter your city"
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <select
                      name="state"
                      value={checkoutForm.state}
                      onChange={handleCheckoutInput}
                    >
                      <option value="Jharkhand">Jharkhand</option>
                      <option value="Bihar">Bihar</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Odisha">Odisha</option>
                      <option value="Chhattisgarh">Chhattisgarh</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={checkoutForm.pincode}
                      onChange={handleCheckoutInput}
                      placeholder="Enter pincode"
                    />
                  </div>
                </div>
                <div className="checkout-actions">
                  <button className="back-btn" onClick={goBackToCart}>Back to Cart</button>
                  <button className="continue-btn" onClick={submitShipping}>Continue to Payment</button>
                </div>
              </div>
            )}

            {/* Payment Information */}
            {checkoutStep === 2 && (
              <div className="checkout-step">
                <h3>Payment Method</h3>
                <div className="checkout-form">
                  <div className="form-group">
                    <label>Payment Method</label>
                    <select
                      name="paymentMethod"
                      value={checkoutForm.paymentMethod}
                      onChange={handleCheckoutInput}
                    >
                      <option value="card">Credit/Debit Card</option>
                      <option value="upi">UPI</option>
                      <option value="cod">Cash on Delivery</option>
                    </select>
                  </div>

                  {checkoutForm.paymentMethod === 'card' && (
                    <>
                      <div className="form-group">
                        <label>Card Number</label>
                        <input
                          type="text"
                          placeholder="Enter card number"
                        />
                      </div>
                      <div className="form-group-row">
                        <div className="form-group">
                          <label>Expiry Date</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div className="form-group">
                          <label>CVV</label>
                          <input
                            type="text"
                            placeholder="CVV"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Cardholder Name</label>
                        <input
                          type="text"
                          placeholder="Enter name on card"
                        />
                      </div>
                    </>
                  )}

                  {checkoutForm.paymentMethod === 'upi' && (
                    <div className="form-group">
                      <label>UPI ID</label>
                      <input
                        type="text"
                        placeholder="Enter UPI ID"
                      />
                    </div>
                  )}

                  {checkoutForm.paymentMethod === 'cod' && (
                    <div className="cod-notice">
                      <p>Pay with cash when your order is delivered.</p>
                    </div>
                  )}
                </div>
                <div className="checkout-actions">
                  <button className="back-btn" onClick={() => setCheckoutStep(1)}>Back to Shipping</button>
                  <button className="continue-btn" onClick={submitPayment}>Place Order</button>
                </div>
              </div>
            )}

            {/* Order Confirmation */}
            {checkoutStep === 3 && orderDetails && (
              <div className="checkout-step order-confirmation">
                <div className="success-icon">✅</div>
                <h3>Order Confirmed!</h3>
                <p>Thank you for your purchase. Your order has been confirmed.</p>
                <div className="order-details">
                  <p><strong>Order ID:</strong> #{orderDetails.id}</p>
                  <p><strong>Order Date:</strong> {orderDetails.date}</p>
                  <p><strong>Total Amount:</strong> ₹{orderDetails.total}</p>
                  <p><strong>Shipping Address:</strong> {orderDetails.shipping.address}, {orderDetails.shipping.city}, {orderDetails.shipping.state} - {orderDetails.shipping.pincode}</p>
                </div>
                <button className="continue-shopping" onClick={continueShopping}>
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Wishlist Sidebar */}
      <div className={`wishlist-sidebar ${showWishlist ? 'active' : ''}`}>
        <div className="wishlist-header">
          <h3>Your Wishlist ({wishlistCount} items)</h3>
          <button className="close-wishlist" onClick={() => setShowWishlist(false)}>×</button>
        </div>
        
        <div className="wishlist-items">
          {wishlist.length === 0 ? (
            <div className="empty-wishlist">
              <p>Your wishlist is empty</p>
              <span className="wishlist-icon-large">❤️</span>
              <button className="continue-shopping" onClick={() => setShowWishlist(false)}>
                Continue Shopping
              </button>
            </div>
          ) : (
            wishlist.map((item) => (
              <div key={item.id} className="wishlist-item">
                <div className="wishlist-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="wishlist-item-details">
                  <h4>{item.name}</h4>
                  <p>₹{item.price}</p>
                </div>
                <div className="wishlist-item-actions">
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => addToCart(item)}
                  >
                    Add to Cart
                  </button>
                  <button 
                    className="remove-item"
                    onClick={() => toggleWishlist(item)}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showCart && <div className="cart-overlay" onClick={() => setShowCart(false)}></div>}
      {showWishlist && <div className="wishlist-overlay" onClick={() => setShowWishlist(false)}></div>}

      {showNotification && (
        <div className={`notification ${notificationType}`}>
          <span className="notification-icon">
            {notificationType === 'cart' && '🛒'}
            {notificationType === 'wishlist' && '❤️'}
            {notificationType === 'removeWishlist' && '❌'}
            {notificationType === 'outOfStock' && '⚠️'}
            {notificationType === 'maxQuantity' && '⚠️'}
          </span>
          <span>
            {notificationType === 'cart' && `${notificationProduct} added to cart!`}
            {notificationType === 'wishlist' && `${notificationProduct} added to wishlist!`}
            {notificationType === 'removeWishlist' && `${notificationProduct} removed from wishlist!`}
            {notificationType === 'outOfStock' && `Sorry, ${notificationProduct} is out of stock!`}
            {notificationType === 'maxQuantity' && `Maximum quantity reached for ${notificationProduct}!`}
          </span>
        </div>
      )}

      {renderChatAssistant()}
    
       <style jsx>{`
        .marketplace-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
          position: relative;
        }
        
        .marketplace-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .marketplace-header h2 {
          font-size: 2.2rem;
          color: #1e3a8a;
          margin-bottom: 0.5rem;
          font-weight: 700;
        }
        
        .marketplace-header p {
          color: #64748b;
          font-size: 1.1rem;
        }
        
        .controls-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        @media (min-width: 768px) {
          .controls-container {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }
        
        .search-container {
          position: relative;
          flex: 1;
          max-width: 500px;
        }
        
        .search-input {
          width: 100%;
          padding: 0.8rem 1rem 0.8rem 2.5rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
        }
        
        .search-icon {
          position: absolute;
          left: 0.8rem;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
        }
        
        .filters-container {
          display: flex;
          gap: 0.8rem;
        }
        
        .filter-select {
          padding: 0.8rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: white;
          font-size: 0.9rem;
        }
        
        .action-indicators {
          position: fixed;
          top: 1rem;
          right: 1rem;
          display: flex;
          gap: 0.5rem;
          z-index: 1000;
        }
        
        .cart-indicator, .wishlist-indicator {
          background: #3b82f6;
          color: white;
          padding: 0.7rem 1rem;
          border-radius: 50px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
        }
        
        .wishlist-indicator {
          background: #ec4899;
        }
        
        .wishlist-indicator:hover {
          background: #db2777;
        }
        
        .cart-indicator:hover {
          background: #2563eb;
          transform: translateY(-2px);
        }
        
        .cart-count, .wishlist-count {
          background: #ef4444;
          color: white;
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: bold;
        }
        
        .cart-text, .wishlist-text {
          display: none;
        }
        
        @media (min-width: 768px) {
          .cart-text, .wishlist-text {
            display: inline;
          }
        }
        
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        
        .product-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }
        
        .product-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }
        
        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .product-card:hover .product-image img {
          transform: scale(1.05);
        }
        
        .product-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, transparent 60%, rgba(0, 0, 0, 0.7));
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 1rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .product-card:hover .product-overlay {
          opacity: 1;
        }
        
        .category-badge {
          background: rgba(255, 255, 255, 0.9);
          color: #1e40af;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          align-self: flex-start;
        }
        
        .wishlist-btn {
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 50%;
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: absolute;
          top: 1rem;
          right: 1rem;
        }
        
        .wishlist-btn.active {
          background: #ec4899;
          color: white;
        }
        
        .rating {
          color: white;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.9rem;
        }
        
        .stars {
          color: #fbbf24;
        }
        
        .rating-text {
          font-size: 0.8rem;
          opacity: 0.9;
        }
        
        .product-content {
          padding: 1.2rem;
        }
        
        .product-name {
          font-size: 1.1rem;
          color: #1e293b;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }
        
        .product-description {
          color: #64748b;
          font-size: 0.9rem;
          margin-bottom: 1rem;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .product-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .product-price {
          font-weight: 700;
          color: #1e3a8a;
          font-size: 1.1rem;
        }
        
        .add-to-cart-btn {
          padding: 0.5rem 1rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        
        .add-to-cart-btn:hover {
          background: #2563eb;
        }
        
        .no-products {
          text-align: center;
          padding: 3rem;
          color: #64748b;
        }
        
        .cart-sidebar, .wishlist-sidebar {
          position: fixed;
          top: 0;
          right: -400px;
          width: 100%;
          max-width: 380px;
          height: 100vh;
          background: white;
          box-shadow: -4px 0 15px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          transition: right 0.3s ease;
          overflow: hidden;
        }
        
        .cart-sidebar.active, .wishlist-sidebar.active {
          right: 0;
        }
        
        .cart-overlay, .wishlist-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }
        
        .cart-header, .wishlist-header {
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
        }
        
        .cart-header h3, .wishlist-header h3 {
          color: #1e293b;
          font-size: 1.2rem;
        }
        
        .close-cart, .close-wishlist {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #64748b;
        }
        
        .cart-items, .wishlist-items {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
        }
        
        .empty-cart, .empty-wishlist {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #64748b;
          gap: 1rem;
        }
        
        .cart-icon-large {
          font-size: 3rem;
        }
        
        .wishlist-icon-large {
          font-size: 3rem;
        }
        
        .continue-shopping {
          padding: 0.7rem 1.5rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
        
        .cart-item, .wishlist-item {
          display: flex;
          gap: 1rem;
          padding: 1rem 0;
          border-bottom: 1px solid #f1f5f9;
          position: relative;
        }
        
        .cart-item-image, .wishlist-item-image {
          width: 70px;
          height: 70px;
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
        }
        
        .cart-item-image img, .wishlist-item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .cart-item-details, .wishlist-item-details {
          flex: 1;
        }
        
        .cart-item-details h4, .wishlist-item-details h4 {
          font-size: 0.9rem;
          margin-bottom: 0.3rem;
          color: #1e293b;
        }
        
        .cart-item-details p, .wishlist-item-details p {
          color: #64748b;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }
        
        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .quantity-controls button {
          width: 25px;
          height: 25px;
          border: 1px solid #d1d5db;
          background: white;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .quantity-controls span {
          min-width: 25px;
          text-align: center;
        }
        
        .remove-item {
          position: absolute;
          top: 0.5rem;
          right: 0;
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          color: #64748b;
        }
        
        .wishlist-item-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .cart-footer {
          padding: 1.5rem;
          border-top: 1px solid #e5e7eb;
          flex-shrink: 0;
        }
        
        .cart-total {
          font-size: 1.2rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
          text-align: center;
        }
        
        .checkout-btn {
          width: 100%;
          padding: 1rem;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        
        .checkout-btn:hover {
          background: #059669;
        }
        
        /* Checkout Steps */
        .checkout-steps {
          padding: 1rem;
          border-top: 1px solid #e5e7eb;
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }
        
        .checkout-step {
          animation: fadeIn 0.3s ease;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .checkout-step h3 {
          margin-bottom: 1rem;
          color: #1e293b;
        }
        
        .checkout-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex: 1;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .form-group label {
          font-weight: 500;
          color: #374151;
        }
        
        .form-group input, .form-group select, .form-group textarea {
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 1rem;
        }
        
        .form-group textarea {
          min-height: 80px;
          resize: vertical;
        }
        
        .form-group-row {
          display: flex;
          gap: 1rem;
        }
        
        .form-group-row .form-group {
          flex: 1;
        }
        
        .cod-notice {
          background: #f3f4f6;
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1rem;
          color: #4b5563;
        }
        
        .checkout-actions {
          display: flex;
          gap: 1rem;
          margin-top: auto;
          padding-top: 1rem;
        }
        
        .back-btn {
          padding: 0.75rem 1.5rem;
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          flex: 1;
        }
        
        .continue-btn {
          padding: 0.75rem 1.5rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          flex: 1;
        }
        
        .continue-btn:hover {
          background: #2563eb;
        }
        
        .order-confirmation {
          text-align: center;
          padding: 1rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .success-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .order-confirmation h3 {
          color: #059669;
          margin-bottom: 0.5rem;
        }
        
        .order-confirmation p {
          color: #64748b;
          margin-bottom: 1.5rem;
        }
        
        .order-details {
          text-align: left;
          background: #f9fafb;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }
        
        .order-details p {
          margin-bottom: 0.5rem;
          color: #374151;
        }
        
        .notification {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          padding: 1rem 1.5rem;
          border-radius: 8px;
          background: white;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          gap: 0.8rem;
          z-index: 1000;
          animation: slideIn 0.3s ease;
        }
        
        .notification.cart {
          border-left: 4px solid #3b82f6;
        }
        
        .notification.wishlist {
          border-left: 4px solid #ec4899;
        }
        
        .notification.removeWishlist {
          border-left: 4px solid #ef4444;
        }
        
        .notification.outOfStock, .notification.maxQuantity {
          border-left: 4px solid #f59e0b;
        }
        
        .marketplace-chat-wrapper {
          position: fixed;
          bottom: 2rem;
          left: 2rem;
          z-index: 1000;
        }

        .market-chat-toggle {
          background: #1e3a8a;
          color: white;
          padding: 0.8rem 1.2rem;
          border-radius: 50px;
          border: none;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          cursor: pointer;
          font-weight: 600;
        }

        .market-chat-window {
          width: 300px;
          height: 350px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }

        .market-chat-header {
          background: #1e3a8a;
          color: white;
          padding: 0.7rem 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .market-chat-messages {
          flex: 1;
          padding: 1rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .market-msg {
          padding: 0.5rem 0.8rem;
          border-radius: 10px;
          font-size: 0.85rem;
          max-width: 85%;
        }

        .market-msg.bot {
          background: #f1f5f9;
          align-self: flex-start;
        }

        .market-msg.user {
          background: #3b82f6;
          color: white;
          align-self: flex-end;
        }

        .market-chat-input {
          padding: 0.7rem;
          border-top: 1px solid #e2e8f0;
          display: flex;
          gap: 0.4rem;
        }

        .market-chat-input input { flex: 1; padding: 0.3rem; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 0.8rem; }
        .market-chat-input button { background: #1e3a8a; color: white; border: none; padding: 0.3rem 0.7rem; border-radius: 4px; font-size: 0.8rem; cursor: pointer; }

        .typing .dot {
          display: inline-block;
          width: 4px;
          height: 4px;
          margin-right: 3px;
          background: #94a3b8;
          border-radius: 50%;
          animation: wave 1.3s linear infinite;
        }

        .typing .dot:nth-child(2) { animation-delay: -1.1s; }
        .typing .dot:nth-child(3) { animation-delay: -0.9s; }

        @keyframes wave {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-4px);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @media (max-width: 768px) {
          .cart-sidebar, .wishlist-sidebar {
            max-width: 100%;
          }
          
          .form-group-row {
            flex-direction: column;
            gap: 1rem;
          }
          
          .checkout-actions {
            flex-direction: column;
          }
          
          .notification {
            right: 1rem;
            left: 1rem;
            bottom: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Marketplace;