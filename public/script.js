document.getElementById('signupBtn').addEventListener('click', async () => {
  const username = document.getElementById('signupUser').value;
  const password = document.getElementById('signupPass').value;
  await fetch('/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
});

document.getElementById('loginBtn').addEventListener('click', async () => {
  const username = document.getElementById('loginUser').value;
  const password = document.getElementById('loginPass').value;
  await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
});

document.getElementById('addItemBtn').addEventListener('click', async () => {
  const name = document.getElementById('itemName').value;
  const price = parseFloat(document.getElementById('itemPrice').value);
  await fetch('/menu', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price })
  });
});

document.getElementById('createOrderBtn').addEventListener('click', async () => {
  const customerName = document.getElementById('customerName').value;
  const items = document.getElementById('itemIds').value.split(',').map(id => parseInt(id.trim(), 10));
  await fetch('/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerName, items })
  });
});

async function loadOrders() {
  const res = await fetch('/orders');
  const orders = await res.json();
  const list = document.getElementById('orderList');
  list.innerHTML = '';
  orders.forEach(o => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.textContent = `#${o.id} - ${o.customerName} (${o.status})`;
    const btn = document.createElement('button');
    btn.textContent = 'Bill';
    btn.className = 'btn btn-sm btn-outline-primary';
    btn.addEventListener('click', () => showBill(o.id));
    li.appendChild(btn);
    list.appendChild(li);
  });
}

document.getElementById('refreshOrders').addEventListener('click', loadOrders);

async function showBill(id) {
  const res = await fetch(`/orders/${id}/bill`);
  const bill = await res.json();
  const body = document.getElementById('billBody');
  body.innerHTML = `<p>Customer: ${bill.customerName}</p><ul>` +
    bill.items.map(i => `<li>${i.name} - $${i.price}</li>`).join('') +
    `</ul><strong>Total: $${bill.total}</strong>`;
  const modal = new bootstrap.Modal(document.getElementById('billModal'));
  modal.show();
}
