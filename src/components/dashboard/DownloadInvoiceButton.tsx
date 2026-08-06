"use client";

import React from "react";

export function DownloadInvoiceButton({ invoice }: { invoice: any }) {
  const handleDownload = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt_${invoice.id}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #111; max-width: 650px; margin: auto; }
            .header { border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
            .brand { font-size: 24px; font-weight: 800; color: #059669; font-family: monospace; display: inline-flex; items-center; gap: 8px; }
            .brand svg { vertical-align: middle; }
            .title { font-size: 12px; text-transform: uppercase; color: #6b7280; letter-spacing: 1px; font-weight: 700; }
            .details { margin-bottom: 30px; font-size: 14px; line-height: 1.8; }
            .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .table th, .table td { text-align: left; padding: 12px; border-bottom: 1px solid #f3f4f6; }
            .table th { background: #f9fafb; font-size: 11px; text-transform: uppercase; color: #4b5563; }
            .total { text-align: right; margin-top: 30px; font-size: 18px; font-weight: 700; color: #059669; }
            .badge { background: #d1fae5; color: #065f46; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 700; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="brand">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
              <span>PulsePing</span>
            </div>
            <div class="title">Payment Receipt</div>
          </div>
          <div class="details">
            <p><strong>Receipt ID:</strong> ${invoice.id}</p>
            <p><strong>Billing Date:</strong> ${invoice.date}</p>
            <p><strong>Status:</strong> <span class="badge">PAID</span></p>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>PulsePing High-Resolution Operational Monitoring</td>
                <td>${invoice.amount}</td>
              </tr>
            </tbody>
          </table>
          <div class="total">Total Paid: ${invoice.amount}</div>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <button
      onClick={handleDownload}
      className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
    >
      Download PDF
    </button>
  );
}

export default DownloadInvoiceButton;
