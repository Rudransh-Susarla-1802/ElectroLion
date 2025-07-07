import React, { useEffect, useState } from 'react';
import { Download, Calendar, Hash, Mail, Phone, MapPin } from 'lucide-react';
import { useSelector } from 'react-redux';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useLocation } from 'react-router-dom';
import invoiceImg from '../../../assets/invoice.png';
import name from '../../../assets/name.png'

const InvoicePage = () => {
  const profile = useSelector((state) => state.profile);
  const registration = useSelector((state) => state.registration);
  const location = useLocation();
  const { cartItems = [], subtotal = 0, tax = 0, shipping = 0, discount = 0, total = 0, formData = {} } = location.state || {};
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use formData for client info and address
    const fetchedProfile = formData || {};
    const invoice = {
      invoiceNumber: `INV-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      companyName: 'ElectroLion',
      companyAddress: '123 Business Street\nCity, State 12345',
      companyEmail: 'hello@yourcompany.com',
      companyPhone: '+1 (555) 123-4567',
      clientName: (fetchedProfile.firstName || '') + ' ' + (fetchedProfile.lastName || ''),
      clientAddress: [
        fetchedProfile.flatNo,
        fetchedProfile.streetName,
        fetchedProfile.localityName,
        fetchedProfile.landmark,
        fetchedProfile.district,
        fetchedProfile.state,
        fetchedProfile.country,
        fetchedProfile.pinCode
      ].filter(Boolean).join(', '),
      clientEmail: fetchedProfile.email || '',
      items: cartItems.map(item => ({
        id: item.id,
        description: item.title || item.name || 'Product',
        quantity: item.quantity,
        rate: item.price,
        amount: item.price * item.quantity
      })),
      subtotal,
      tax,
      shipping,
      discount,
      total,
      taxRate: 8,
      notes: 'Thank you for your order!'
    };
    setInvoiceData(invoice);
    setLoading(false);
  }, [formData, cartItems, subtotal, tax, shipping, discount, total]);

  const downloadInvoice = async () => {
    const element = document.getElementById('invoice-content');

    if (!element) {
      alert('Invoice content not found.');
      return;
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pageWidth;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${invoiceData.invoiceNumber}.pdf`);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Something went wrong while generating the invoice.\n' + error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading || !invoiceData) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Loading invoice...</div>;
  }

  return (
    <div className="min-h-screen rounded-md bg-[#0B192C] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#08121F] rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center border border-[#1E3E62]">
        <div className="flex items-center space-x-4">
        <a
            href="/home"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
            <span>← Back to Shopping</span>
        </a>
        </div>

          <button
            onClick={downloadInvoice}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>

        <div
          id="invoice-content"
          className="invoice-pdf bg-white rounded-lg shadow-sm p-8"
          style={{ background: '#fff', color: '#222' }}
        >
         <div className="flex flex-col items-center mb-6">
            <img src={invoiceImg} alt="Invoice" className="h-24 object-contain mb-2" />
            <img src={name} alt="Invoice" className="h-24 object-contain mb-2" />
            </div>


          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                <Hash className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">Invoice Number:</span>
                <span className="font-semibold">{invoiceData.invoiceNumber}</span>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">Date:</span>
                <span className="font-semibold">{invoiceData.date}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">From:</h3>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                  <span className="whitespace-pre-line">{invoiceData.companyAddress}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{invoiceData.companyEmail}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{invoiceData.companyPhone}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Bill To:</h3>
              <div className="space-y-2">
                <div className="font-semibold">{invoiceData.clientName}</div>
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                  <span className="whitespace-pre-line">{invoiceData.clientAddress}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{invoiceData.clientEmail}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left font-semibold">Description</th>
                    <th className="px-4 py-3 text-center font-semibold">Qty</th>
                    <th className="px-4 py-3 text-center font-semibold">Rate</th>
                    <th className="px-4 py-3 text-right font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="px-4 py-3">{item.description}</td>
                      <td className="px-4 py-3 text-center">{item.quantity}</td>
                      <td className="px-4 py-3 text-center">{formatCurrency(item.rate)}</td>
                      <td className="px-4 py-3 text-right font-semibold">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end mb-8">
            <div className="w-64 space-y-2">
              <div className="flex justify-between py-2">
                <span>Subtotal:</span>
                <span className="font-semibold">{formatCurrency(invoiceData.subtotal)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Tax ({invoiceData.taxRate}%):</span>
                <span className="font-semibold">{formatCurrency(invoiceData.tax)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Shipping:</span>
                <span className="font-semibold">{formatCurrency(invoiceData.shipping)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Discount:</span>
                <span className="font-semibold">{formatCurrency(invoiceData.discount)}</span>
              </div>
              <div className="flex justify-between py-2 border-t-2 border-gray-900">
                <span className="font-bold">Total:</span>
                <span className="font-bold text-lg">{formatCurrency(invoiceData.total)}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Notes:</h3>
            <p className="text-gray-700">{invoiceData.notes}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
