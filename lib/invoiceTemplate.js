export function invoiceHTML(task) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 40px;
      color: #111;
    }
    h1 { color: #2563eb; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 10px;
      text-align: left;
    }
    th { background: #f3f4f6; }
    .total {
      font-size: 18px;
      font-weight: bold;
      margin-top: 20px;
    }
  </style>
</head>
<body>

  <h1>Service Invoice</h1>

  <p><strong>Order ID:</strong> ${task.order_id}</p>
  <p><strong>Name:</strong> ${task.customerName}</p>
  <p><strong>Phone:</strong> ${task.phone}</p>
  <p><strong>Date:</strong> ${task.date} (${task.timeSlot})</p>

  <table>
    <tr>
      <th>Service</th>
      <th>Qty</th>
      <th>Price</th>
    </tr>

    ${task.cart
      .map(
        (i) => `
        <tr>
          <td>${i.name}</td>
          <td>${i.quantity}</td>
          <td>₹${i.price}</td>
        </tr>
      `
      )
      .join("")}
  </table>

  <p>Subtotal: ₹${task.subtotal}</p>
  <p>Discount: -₹${task.discount}</p>
  <p class="total">Total: ₹${task.total}</p>

  <p style="margin-top:40px;font-size:12px;">
    Thank you for booking with us!
  </p>

</body>
</html>
`;
}
