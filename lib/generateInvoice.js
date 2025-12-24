import puppeteer from "puppeteer";
import { invoiceHTML } from "./invoiceTemplate";

export async function generateInvoice(task) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.setContent(invoiceHTML(task), {
    waitUntil: "networkidle0",
  });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();
  return pdf;
}
