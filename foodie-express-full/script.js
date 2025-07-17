
const foods = [
  { id: 1, name: "Margherita Pizza", price: 199, img: "assets/pizza.jpg" },
  { id: 2, name: "Cheese Burger", price: 149, img: "assets/burger.jpg" },
  { id: 3, name: "Chocolate Cake", price: 99, img: "assets/cake.jpg" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];

function renderFoods() {
  const container = document.getElementById("food-container");
  container.innerHTML = "";
  foods.forEach(food => {
    const card = document.createElement("div");
    card.className = "food-card";
    card.innerHTML = `
      <img src="${food.img}" alt="${food.name}" />
      <h3>${food.name}</h3>
      <p>₹${food.price}</p>
      <button onclick="addToCart(${food.id})">Add to Cart</button>
    `;
    container.appendChild(card);
  });
}

function addToCart(id) {
  const item = foods.find(f => f.id === id);
  const exists = cart.find(f => f.id === id);
  if (exists) exists.qty++;
  else cart.push({ ...item, qty: 1 });
  updateCartUI();
}

function updateCartUI() {
  document.getElementById("cart-count").innerText = cart.reduce((acc, item) => acc + item.qty, 0);
  localStorage.setItem("cart", JSON.stringify(cart));
}

function showSection(section) {
  ["home", "cart", "checkout", "orders"].forEach(id => {
    document.getElementById(id + "-section").classList.add("hidden");
  });
  document.getElementById(section + "-section").classList.remove("hidden");
  if (section === "cart") renderCart();
  if (section === "orders") renderOrders();
}

function renderCart() {
  const container = document.getElementById("cart-items");
  container.innerHTML = "";
  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <span>${item.name} (₹${item.price})</span>
      <input type="number" min="1" value="${item.qty}" onchange="updateQty(${index}, this.value)" />
      <button onclick="removeItem(${index})">Remove</button>
    `;
    container.appendChild(div);
  });
}

function updateQty(index, qty) {
  cart[index].qty = parseInt(qty);
  updateCartUI();
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCartUI();
  renderCart();
}

function checkout() {
  showSection('checkout');
}

document.getElementById("checkout-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const name = document.getElementById("cust-name").value;
  const address = document.getElementById("cust-address").value;
  const payment = document.getElementById("payment").value;

  if (!cart.length) return alert("Cart is empty");

  const newOrder = {
    name,
    address,
    payment,
    items: [...cart],
    timestamp: new Date().toLocaleString()
  };

  orders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(orders));

  cart = [];
  updateCartUI();
  localStorage.removeItem("cart");

  alert("Order Placed!");
  showSection("orders");
});

function renderOrders() {
  const list = document.getElementById("past-orders");
  list.innerHTML = "";
  orders.forEach(order => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${order.timestamp}</strong>: ${order.items.map(i => i.name + ' x' + i.qty).join(', ')}`;
    list.appendChild(li);
  });
}

// Initial
renderFoods();
updateCartUI();
