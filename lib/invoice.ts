import { Order, OrderItem, Product } from '@prisma/client'

export interface InvoiceOrder extends Order {
  items: (OrderItem & { product: Product })[]
}

export function generateInvoiceHtml(order: InvoiceOrder): string {
  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: order.currency || 'EUR',
    }).format(cents / 100)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const paymentMethodLabels: Record<string, string> = {
    QUOTE_ONLY: 'Demande de devis',
    CASH_ON_DELIVERY: 'Paiement à la livraison',
    BANK_TRANSFER: 'Virement bancaire',
  }

  const statusLabels: Record<string, string> = {
    PENDING: 'En attente',
    CONFIRMED: 'Confirmée',
    PREPARING: 'En préparation',
    SHIPPED: 'Expédiée',
    COMPLETED: 'Terminée',
    CANCELLED: 'Annulée',
  }

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Facture ${order.id}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Raleway', Arial, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background-color: #f7f5f2;
      padding: 40px 20px;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background-color: #FCFBFC;
      padding: 40px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      border-bottom: 2px solid #000;
      padding-bottom: 30px;
      margin-bottom: 30px;
    }
    .logo {
      font-family: 'Bodoni Moda', Georgia, serif;
      font-size: 32px;
      font-weight: 400;
      letter-spacing: 2px;
      margin-bottom: 10px;
    }
    .company-info {
      font-size: 14px;
      color: #666;
      line-height: 1.8;
    }
    .invoice-title {
      font-family: 'Bodoni Moda', Georgia, serif;
      font-size: 24px;
      margin: 30px 0 20px;
    }
    .invoice-meta {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      padding: 20px;
      background-color: #f7f5f2;
    }
    .meta-section {
      flex: 1;
    }
    .meta-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
    }
    .meta-value {
      font-size: 16px;
      font-weight: 500;
    }
    .customer-info {
      margin-bottom: 30px;
    }
    .section-title {
      font-family: 'Bodoni Moda', Georgia, serif;
      font-size: 18px;
      margin-bottom: 15px;
      border-bottom: 1px solid #e5e5e5;
      padding-bottom: 10px;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    .items-table th {
      background-color: #f7f5f2;
      padding: 12px;
      text-align: left;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 2px solid #000;
    }
    .items-table td {
      padding: 15px 12px;
      border-bottom: 1px solid #e5e5e5;
    }
    .items-table tr:last-child td {
      border-bottom: none;
    }
    .text-right {
      text-align: right;
    }
    .total-section {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 2px solid #000;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      font-size: 16px;
    }
    .total-row.grand-total {
      font-size: 20px;
      font-weight: 600;
      font-family: 'Bodoni Moda', Georgia, serif;
      margin-top: 10px;
      padding-top: 15px;
      border-top: 1px solid #e5e5e5;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e5e5;
      font-size: 12px;
      color: #666;
      text-align: center;
    }
    .status-badge {
      display: inline-block;
      padding: 5px 12px;
      border-radius: 3px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
    }
    .status-pending {
      background-color: #fff9e6;
      color: #b8860b;
    }
    .status-confirmed {
      background-color: #e6f3ff;
      color: #0066cc;
    }
    .status-completed {
      background-color: #e6ffe6;
      color: #006600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">BK Agencements</div>
      <div class="company-info">
        Mobilier sur-mesure d'exception<br>
        Casablanca, Maroc
      </div>
    </div>

    <h1 class="invoice-title">Facture</h1>

    <div class="invoice-meta">
      <div class="meta-section">
        <div class="meta-label">Numéro de commande</div>
        <div class="meta-value">${order.id}</div>
      </div>
      <div class="meta-section">
        <div class="meta-label">Date</div>
        <div class="meta-value">${formatDate(order.createdAt)}</div>
      </div>
      <div class="meta-section">
        <div class="meta-label">Statut</div>
        <div class="meta-value">
          <span class="status-badge status-${order.status.toLowerCase()}">
            ${statusLabels[order.status] || order.status}
          </span>
        </div>
      </div>
    </div>

    <div class="customer-info">
      <h2 class="section-title">Informations client</h2>
      <p><strong>${order.customerName}</strong></p>
      <p>${order.customerEmail}</p>
      ${order.customerPhone ? `<p>${order.customerPhone}</p>` : ''}
      <p>
        ${order.addressLine1}<br>
        ${order.addressLine2 ? `${order.addressLine2}<br>` : ''}
        ${order.postalCode ? `${order.postalCode} ` : ''}${order.city}<br>
        ${order.country}
      </p>
    </div>

    <h2 class="section-title">Articles</h2>
    <table class="items-table">
      <thead>
        <tr>
          <th>Produit</th>
          <th class="text-right">Quantité</th>
          <th class="text-right">Prix unitaire</th>
          <th class="text-right">Sous-total</th>
        </tr>
      </thead>
      <tbody>
        ${order.items.map((item) => `
          <tr>
            <td>${item.product.name}</td>
            <td class="text-right">${item.quantity}</td>
            <td class="text-right">${formatPrice(item.unitPrice)}</td>
            <td class="text-right">${formatPrice(item.subtotal)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="total-section">
      <div class="total-row">
        <span>Sous-total</span>
        <span>${formatPrice(order.items.reduce((sum, item) => sum + item.subtotal, 0))}</span>
      </div>
      <div class="total-row grand-total">
        <span>Total</span>
        <span>${formatPrice(order.totalAmount)}</span>
      </div>
    </div>

    <div style="margin-top: 30px; padding: 20px; background-color: #f7f5f2;">
      <p><strong>Mode de paiement:</strong> ${paymentMethodLabels[order.paymentMethod] || order.paymentMethod}</p>
      ${order.notes ? `<p style="margin-top: 15px;"><strong>Notes:</strong> ${order.notes}</p>` : ''}
    </div>

    <div class="footer">
      <p>Merci pour votre commande.</p>
      <p>BK Agencements — Mobilier sur-mesure d'exception</p>
    </div>
  </div>
</body>
</html>
  `.trim()
}





