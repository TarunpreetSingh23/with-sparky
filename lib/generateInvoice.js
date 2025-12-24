import PDFDocument from "pdfkit";

export async function generateInvoice(task) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      doc.fontSize(20).text("INVOICE", { align: "center" });
      doc.moveDown();

      doc.fontSize(12).text(`Order ID: ${task.order_id}`);
      doc.text(`Customer: ${task.customerName}`);
      doc.text(`Phone: ${task.phone}`);
      doc.text(`Address: ${task.address}`);
      doc.text(`Date: ${task.date}`);
      doc.text(`Time Slot: ${task.timeSlot}`);
      doc.moveDown();

      doc.fontSize(14).text("Services", { underline: true });
      doc.moveDown(0.5);

      task.cart.forEach((item, i) => {
        doc.text(`${i + 1}. ${item.name} - ₹${item.price}`, {
          indent: 20,
        });
      });

      const total = task.cart.reduce(
        (sum, item) => sum + Number(item.price || 0),
        0
      );

      doc.moveDown();
      doc.fontSize(14).text(`Total: ₹${total}`, { align: "right" });

      doc.moveDown(2);
      doc.fontSize(10).text("Thank you for your business", {
        align: "center",
      });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
