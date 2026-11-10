import React, { useState, useMemo } from "react";
import bontonLogo from "./assets/BTLOGO02 (1).png";
import "./styles.css";

const defaultInvoiceData = {
  invoiceNo: "BTDCWS/003/25-26",
  invoiceDate: "10 Nov 2026",
  billingPeriod: "05 Jul 2026 – 05 Aug 2026",
  currency: "INR (₹)",
  billTo: {
    
    address: "Department of Children Welfare and Special Services,\nNo.300, Purasawalkkam High Road,\nKellys, Chennai – 600010.",
    contactPerson: "",
    email: "",
    gstin: ""
  },
  accountSummary: {
    accountId: "9876-5432-1122",
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    dueDate: "30 Sep 2026"
  },
  taxRate: 18,
  discount: 2.00,
  supportEmail: "support@bontonsoftwares.com"
};

const defaultServices = [
  { id: 1, service: "EC2", description: "m7i.12xlarge instance", usage: "744 Hrs", unitPrice: 140, amount: 104160 },
  { id: 2, service: "Object Storage", description: "Object Storage", usage: "1024 GB", unitPrice: 20, amount: 20480 },
];

function formatPrice(val, decimals = 2) {
  const num = Number(val) || 0;
  return num.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

function formatUnitPrice(val) {
  const num = Number(val) || 0;
  if (num < 0.0001) {
    return "₹" + num.toFixed(7);
  }
  return "₹" + num.toFixed(3);
}

export default function App() {
  const [invoice, setInvoice] = useState(defaultInvoiceData);
  const [services, setServices] = useState(defaultServices);
  const [isEditMode, setIsEditMode] = useState(false);

  // Subtotal Calculation
  const subtotal = useMemo(() => {
    return services.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [services]);

  const totalAmount = subtotal - Number(invoice.discount || 0);

  const updateService = (id, field, val) => {
    setServices(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: val };
        if (field === "unitPrice" || field === "amount") {
          updated[field] = Number(val);
        }
        return updated;
      })
    );
  };

  const addServiceRow = () => {
    const newId = Date.now();
    setServices(prev => [
      ...prev,
      {
        id: newId,
        service: "New Service",
        description: "Standard description",
        usage: "10 Units",
        unitPrice: 0.050,
        amount: 0.50
      }
    ]);
  };

  const deleteServiceRow = (id) => {
    setServices(prev => prev.filter(item => item.id !== id));
  };

  const handlePrint = () => {
    if (isEditMode) {
      setIsEditMode(false);
      setTimeout(() => {
        window.print();
      }, 50);
    } else {
      window.print();
    }
  };

  const resetToDefault = () => {
    setInvoice(defaultInvoiceData);
    setServices(defaultServices);
  };

  return (
    <div className="invoice-app-wrapper">
      {/* Top Floating Action Toolbar */}
      <header className="toolbar-container">
        <div className="toolbar-title">
          <span>BonTon Cloud Invoice</span>
          <span className="toolbar-badge">BTDCWS/003/25-26</span>
        </div>
        <div className="toolbar-buttons">
          <button
            type="button"
            className={`btn btn-secondary ${isEditMode ? "btn-active" : ""}`}
            onClick={() => setIsEditMode(!isEditMode)}
          >
            {isEditMode ? "✓ Done Editing" : "✎ Edit Mode"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={resetToDefault}
          >
            ↺ Reset
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handlePrint}
          >
            🖨 Print / Download PDF
          </button>
        </div>
      </header>

      {/* Main Invoice Document Sheet */}
      <div className="invoice-sheet">
        {/* 1. Header Row */}
        <section className="header-row">
          <div className="brand-section">
            <img
              src={bontonLogo}
              alt="BonTon Softwares Pvt Ltd., - Win in Style"
              className="bonton-main-logo"
            />
            <div style={{ fontSize: "12px", marginTop: 6, lineHeight: 1.4 }}>
              1st Floor, Plot No.143, IIFL Towers, MGR Salai,<br />
              Perungudi, Chennai - 600096.
            </div>
          </div>
        </section>

        {/* 2. Title & Meta Section */}
        <section className="title-meta-row">
          <div className="title-col">
            <h1>Cloud Services Invoice</h1>
            <div className="title-categories">
              Infrastructure <i className="cat-pipe">|</i> Compute{" "}
              <i className="cat-pipe">|</i> Storage{" "}
              <i className="cat-pipe">|</i> Database{" "}
              <i className="cat-pipe">|</i> Monitoring
            </div>
          </div>

          <div className="meta-grid">
            <span className="meta-label">Invoice No</span>
            <span className="meta-colon">:</span>
            {isEditMode ? (
              <input
                className="meta-input"
                value={invoice.invoiceNo}
                onChange={e => setInvoice({ ...invoice, invoiceNo: e.target.value })}
              />
            ) : (
              <span className="meta-val">{invoice.invoiceNo}</span>
            )}

            <span className="meta-label">Invoice Date</span>
            <span className="meta-colon">:</span>
            {isEditMode ? (
              <input
                className="meta-input"
                value={invoice.invoiceDate}
                onChange={e => setInvoice({ ...invoice, invoiceDate: e.target.value })}
              />
            ) : (
              <span className="meta-val">{invoice.invoiceDate}</span>
            )}

            <span className="meta-label">Billing Period</span>
            <span className="meta-colon">:</span>
            {isEditMode ? (
              <input
                className="meta-input"
                value={invoice.billingPeriod}
                onChange={e => setInvoice({ ...invoice, billingPeriod: e.target.value })}
              />
            ) : (
              <span className="meta-val">{invoice.billingPeriod}</span>
            )}
          </div>
        </section>

        <hr className="invoice-hr" />

        {/* 3. Bill To & Account Summary */}
        <section className="info-section">
          <div className="bill-to-col">
            <h3>Bill To</h3>
            {isEditMode ? (
              <input
                className="meta-input client-name"
                style={{ width: "100%", marginBottom: 6 }}
                value={invoice.billTo.company}
                onChange={e =>
                  setInvoice({
                    ...invoice,
                    billTo: { ...invoice.billTo, company: e.target.value }
                  })
                }
              />
            ) : (
              <div className="client-name">{invoice.billTo.company}</div>
            )}

            {isEditMode ? (
              <textarea
                className="meta-input client-address"
                style={{ width: "100%", height: 65, marginBottom: 8 }}
                value={invoice.billTo.address}
                onChange={e =>
                  setInvoice({
                    ...invoice,
                    billTo: { ...invoice.billTo, address: e.target.value }
                  })
                }
              />
            ) : (
              <div className="client-address">{invoice.billTo.address}</div>
            )}

          </div>
        </section>

        {/* 4. Service Usage Details Table */}
        <section className="table-section">
          <div className="section-title">
            <span>Service Usage Details</span>
            {isEditMode && (
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: "4px 10px", fontSize: "12px" }}
                onClick={addServiceRow}
              >
                + Add Service
              </button>
            )}
          </div>

          <table className="services-table">
            <thead>
              <tr>
                <th className="col-service">Service</th>
                <th className="col-desc">Description</th>
                <th className="col-usage">Usage</th>
                <th className="col-price">Unit Price (incl. GST)</th>
                <th className="col-amount">Amount (incl. GST)</th>
                {isEditMode && <th className="col-action"></th>}
              </tr>
            </thead>
            <tbody>
              {services.map(item => (
                <tr key={item.id}>
                  <td className={isEditMode ? "editable-cell" : ""}>
                    {isEditMode ? (
                      <input
                        value={item.service}
                        onChange={e =>
                          updateService(item.id, "service", e.target.value)
                        }
                      />
                    ) : (
                      item.service
                    )}
                  </td>
                  <td className={isEditMode ? "editable-cell" : ""}>
                    {isEditMode ? (
                      <input
                        value={item.description}
                        onChange={e =>
                          updateService(item.id, "description", e.target.value)
                        }
                      />
                    ) : (
                      item.description
                    )}
                  </td>
                  <td className={isEditMode ? "editable-cell" : ""}>
                    {isEditMode ? (
                      <input
                        value={item.usage}
                        onChange={e =>
                          updateService(item.id, "usage", e.target.value)
                        }
                      />
                    ) : (
                      item.usage
                    )}
                  </td>
                  <td
                    className={`text-right ${isEditMode ? "editable-cell" : ""
                      }`}
                  >
                    {isEditMode ? (
                      <input
                        type="number"
                        step="0.0000001"
                        value={item.unitPrice}
                        onChange={e =>
                          updateService(item.id, "unitPrice", e.target.value)
                        }
                      />
                    ) : (
                      formatUnitPrice(item.unitPrice)
                    )}
                  </td>
                  <td
                    className={`col-amount text-right ${isEditMode ? "editable-cell" : ""
                      }`}
                  >
                    {isEditMode ? (
                      <input
                        type="number"
                        step="0.01"
                        value={item.amount}
                        onChange={e =>
                          updateService(item.id, "amount", e.target.value)
                        }
                      />
                    ) : (
                      `₹${formatPrice(item.amount)}`
                    )}
                  </td>
                  {isEditMode && (
                    <td className="text-right">
                      <button
                        type="button"
                        className="row-delete-btn"
                        onClick={() => deleteServiceRow(item.id)}
                        title="Delete Row"
                      >
                        ✕
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* 5. Bottom Section: Billing Summary */}
        <section className="bottom-columns">
          {/* Billing Summary Box */}
          <div className="billing-summary-card">
            <div className="billing-header">
              <h3>Billing Summary</h3>
            </div>
            <div className="billing-rows">
              <div className="summary-line">
                <span className="sum-label">Subtotal</span>
                <span className="sum-val">₹{formatPrice(subtotal)}</span>
              </div>
              <div className="summary-line discount">
                <span className="sum-label">Discount</span>
                {isEditMode ? (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <span>-₹</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      style={{ width: "75px", textAlign: "right", padding: "2px 6px", fontSize: "13px" }}
                      className="meta-input"
                      value={invoice.discount}
                      onChange={e => setInvoice({ ...invoice, discount: e.target.value })}
                    />
                  </div>
                ) : (
                  <span className="sum-val">-₹{formatPrice(invoice.discount)}</span>
                )}
              </div>
            </div>

            <div className="total-amount-box">
              <span className="total-amount-label">Total Amount (INR)</span>
              <span className="total-amount-value">₹{formatPrice(totalAmount)}</span>
            </div>
          </div>
        </section>

        {/* 6. Footer: Notes & Need Help */}
        <footer className="footer-section">
          <div className="notes-col">
            <h4>Notes</h4>
            <ol className="notes-list">
              <li>This is a computer-generated invoice and does not require a signature.</li>
              <li>Charges are based on actual usage during the billing period.</li>
              <li>For any billing-related queries, please contact your account representative.</li>
            </ol>
          </div>
        </footer>
      </div>
    </div>
  );
}
