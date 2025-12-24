import PDFDocument from "pdfkit";

/**
 * Generates invoice PDF buffer
 * Works 100% in serverless (Vercel, Netlify, AWS)
 */
export async function generateInvoice(task) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      /* ---------- HEADER ---------- */
      doc.fontSize(20).text("INVOICE", { align: "center" });
      doc.moveDown();

      doc.fontSize(12).text(`Order ID: ${task.order_id}`);
      doc.text(`Customer: ${task.customerName}`);
      doc.text(`Phone: ${task.phone}`);
      doc.text(`Address: ${task.address}`);
      doc.text(`Date: ${task.date}`);
      doc.text(`Time Slot: ${task.timeSlot}`);

      doc.moveDown();

      /* ---------- ITEMS ---------- */
      doc.fontSize(14).text("Services", { underline: true });
      doc.moveDown(0.5);

      task.cart.forEach((item, index) => {
        doc
          .fontSize(12)
          .text(
            `${index + 1}. ${item.name} - ₹${item.price}`,
            { indent: 20 }
          );
      });

      doc.moveDown();

      /* ---------- TOTAL ---------- */
      const total = task.cart.reduce(
        (sum, item) => sum + Number(item.price || 0),
        0
      );

      doc.fontSize(14).text(`Total Amount: ₹${total}`, {
        align: "right",
      });

      doc.moveDown(2);

      /* ---------- FOOTER ---------- */
      doc
        .fontSize(10)
        .text(
          "Thank you for choosing our service.",
          { align: "center" }
        );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
