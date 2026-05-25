// @ts-ignore
import { jsPDF } from "jspdf";

export type InvoiceData = {
  id: string;
  farmerName: string;
  contractorName: string;
  crop: string;
  amount: number;
  quantity: string;
  date: string;
};

/** Generate PDF invoice for farm contracts */
export const generateInvoice = (invoice: InvoiceData): void => {
  const pdf = new jsPDF();
  pdf.setFontSize(22);
  pdf.setTextColor(40, 167, 69);
  pdf.text("FARMER ASSISTANT - INVOICE", 105, 20, { align: "center" });
  pdf.setFontSize(10);
  pdf.setTextColor(100);
  pdf.text(`Invoice ID: ${invoice.id}`, 20, 35);
  pdf.text(`Date: ${invoice.date}`, 160, 35);
  pdf.setLineWidth(0.5);
  pdf.line(20, 40, 190, 40);
  pdf.setFontSize(12);
  pdf.setTextColor(0);
  pdf.text("Description", 20, 50);
  pdf.text("Quantity", 120, 50);
  pdf.text("Amount", 160, 50);
  pdf.line(20, 55, 190, 55);
  pdf.text(`${invoice.crop} Contract Sale`, 20, 65);
  pdf.text(invoice.quantity, 120, 65);
  pdf.text(`INR ${invoice.amount}`, 160, 65);
  pdf.line(20, 150, 190, 150);
  pdf.setFontSize(10);
  pdf.text("Signed by: ____________________", 20, 165);
  pdf.text("Verified by: Farmer Assistant AI", 120, 165);
  pdf.save(`invoice_${invoice.id}.pdf`);
};
