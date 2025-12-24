import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { invoiceHTML } from "./invoiceTemplate";

export async function generateInvoice(task) {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });

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
