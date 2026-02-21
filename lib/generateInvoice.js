import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

export async function generateInvoice(task, options = {}) {
  return new Promise((resolve, reject) => {
    try {
      const fontPath = path.join(
        process.cwd(),
        "public",
        "fonts",
        "Roboto-VariableFont_wdth,wght.ttf"
      );

      const doc = new PDFDocument({
        size: "A4",
        margin: 0,
        font: fontPath,
      });

      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;

      /* =========================
         OPTIONAL CUSTOM BG IMAGE
      ========================== */
      if (options.backgroundImage) {
        const bgPath = path.isAbsolute(options.backgroundImage)
          ? options.backgroundImage
          : path.join(process.cwd(), options.backgroundImage);

        if (fs.existsSync(bgPath)) {
          doc.image(bgPath, 0, 0, {
            width: pageWidth,
            height: pageHeight,
          });
        }
      }

      /* =========================
            DARK HEADER SECTION
      ========================== */
      doc.rect(0, 0, pageWidth, 180).fill("#111827");

      doc
        .fillColor("#ffffff")
        .fontSize(36)
        .text("INVOICE", 50, 70);

      doc
        .fontSize(12)
        .text(`Invoice ID: ${task.order_id}`, 50, 120);

      doc
        .text(`Date: ${task.date}`, pageWidth - 200, 120, {
          align: "left",
        });

      /* =========================
              BILL TO BOX
      ========================== */
      doc
        .roundedRect(40, 160, pageWidth - 80, 100, 10)
        .fill("#f3f4f6");

      doc.fillColor("#000").fontSize(12);

      doc.text("Billed To:", 60, 180);
      doc.text(`Name: ${task.customerName}`, 60, 200);
      doc.text(`Address: ${task.address}`, 60, 215);
      doc.text(`Phone: ${task.phone}`, 60, 230);

      // doc.text("Professional Assigned", pageWidth - 250, 180);
      // doc.text(task.professionalName || "Professional Name", pageWidth - 250, 200);

      /* =========================
                TABLE HEADER
      ========================== */
      let tableTop = 290;

      doc
        .roundedRect(40, tableTop, pageWidth - 80, 30, 5)
        .fill("#e5e7eb");

      doc.fillColor("#000").fontSize(11);

      doc.text("No", 60, tableTop + 8);
      doc.text("Item Name", 100, tableTop + 8);
      doc.text("Qty", 330, tableTop + 8);
      doc.text("Unit Price", 380, tableTop + 8);
      doc.text("Total", 470, tableTop + 8);

      /* =========================
               TABLE ROWS
      ========================== */
      let y = tableTop + 40;
      let subtotal = 0;

      task.cart.forEach((item, i) => {
        const qty = item.qty || 1;
        const price = Number(item.price || 0);
        const total = qty * price;

        subtotal += total;

        doc.text(i + 1, 60, y);
        doc.text(item.name, 100, y);
        doc.text(qty, 330, y);
        doc.text(`₹${price}`, 380, y);
        doc.text(`₹${total}`, 470, y);

        y += 30;
      });

      /* =========================
             TOTAL SECTION
      ========================== */
      const tax = 0;
      const grandTotal = subtotal - tax;

      y += 20;

      doc.moveTo(40, y).lineTo(pageWidth - 40, y).stroke();

      y += 15;

      doc.text("Sub Total:", 380, y);
      doc.text(`₹${subtotal}`, 470, y);

      y += 20;

      doc.text("Tax (0%):", 380, y);
      doc.text(`₹${tax}`, 470, y);

      y += 20;

      doc.fontSize(13).text("Total:", 380, y);
      doc.fontSize(13).text(`₹${subtotal}`, 470, y);

      /* =========================
              FOOTER
      ========================== */
      doc
        .rect(0, pageHeight - 120, pageWidth, 120)
        .fill("#111827");

      doc.fillColor("#ffffff").fontSize(10);

      doc.text("Contact Us:", 50, pageHeight - 100);
      doc.text("+91", 50, pageHeight - 85);
      doc.text("hello@reallygreatsite.com", 50, pageHeight - 70);
      doc.text("123 Anywhere St, Any City", 50, pageHeight - 55);

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}