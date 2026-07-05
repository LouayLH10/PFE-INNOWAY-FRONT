"use client";
import React, { useEffect, useState,useRef} from 'react'
import KPI from '../components/kpi'
import { CreditCard, Download, FileText, FolderKanban, PieChart, Receipt, Share, Share2Icon, ShoppingCart, Truck } from 'lucide-react'
import UpcomingActivity from '../components/upcomingActivity'
import Reminders from '../components/reminders'
import InvoiceStatusChart from '../components/invoiceStatusChart'
import OrderStatusChart from '../components/orderStatusChart'
import PurchasedProductsChart from '../components/purchasedProductChart'
import { getUserFromToken } from '../../auth/pages/login/user'
import { fetchInvoice } from '../../invoice/service/invoiceService';
import { fetchQuote } from '../../quotes/service/quoteService';
import { fetchDN } from '../../delivery-note/service/deliveryNoteService';
import { fetchPO } from '../../purchase-order/service/purchaseOrderService';
import { fetchPayment } from '../../payment/service/paymentService';
import { fetchProject } from '../../projects/service/projectService';
import { downloadDashboardPdf, generateDashboardPdf, sendDashboardEmail } from '../service/dashboardService';
import { api } from '@/app/api/api';
import { formatTND } from '../../services/generalFunctions';
import { useTranslation } from 'react-i18next';

function page() {
const [nbQuote, setNbQuote] = useState(0);
const [nbDn, setNbDn] = useState(0);
const [nbOrder, setNbOrder] = useState(0);
const [nbInvoice, setNbInvoice] = useState(0);
const [nbPyament, setNbPayment] = useState(0);
const [nbProject, setNbProject] = useState(0);
const [amount,setAmount]=useState(0)
const [balance,setDueBalance]=useState(0)
const user = getUserFromToken();
const dashboardRef = useRef<HTMLDivElement>(null);
console.log(api.getUri({
  url: `/quote/contact/1`,
}));const [invoiceStats, setInvoiceStats] = useState({
  paid: 0,
  recieved: 0,
  cancelled: 0,
  draft:0
});
const [orderStats, setOrderStats] = useState({
  approved: 0,
  pending: 0,
  cancelled: 0,
  recieved:0
});
const [purchacedProd, setPurchacedProd] = useState({
  jan: 0,
  feb: 0,
  mar: 0,
  apr:0,
  may:0,
  jun:0,
  jul:0,
  aug:0,
  sep:0,
  oct:0,
  nov:0,
  dec:0
});
const [subject, setSubject] = useState("");
const [message, setMessage] = useState("");
const [isPdfMode, setIsPdfMode] =
  useState(false);
  const { t } = useTranslation("dashboard");
const [openShareModal, setOpenShareModal] =
  useState(false);

const [pdfFile, setPdfFile] =
  useState<File | null>(null);

const [email, setEmail] =
  useState("");
  const currentYear = new Date().getFullYear();

const years = Array.from(
  { length: currentYear - 2023 + 1 },
  (_, index) => 2023 + index
).reverse(); // pour afficher la plus récente en premier
const [openSuccessModal, setOpenSuccessModal] =
  useState(false);
  const [sending, setSending] = useState(false);

const [openErrorModal, setOpenErrorModal] = useState(false);

const [errorMessage, setErrorMessage] = useState("");
const [selectedYear, setSelectedYear] =
  useState(currentYear);
const handleSendEmail = async () => {
  if (!pdfFile) return;

  try {
    setSending(true);

    await sendDashboardEmail(
      pdfFile,
      email,
      subject,
      message
    );

    setIsPdfMode(false);

    setOpenShareModal(false);

    setEmail("");
    setSubject("");
    setMessage("");

    setOpenSuccessModal(true);
  } catch (error: any) {
    console.error(error);

    setErrorMessage(
      error?.response?.data?.message ||
      "Unable to send the dashboard report."
    );

    setOpenErrorModal(true);
  } finally {
    setSending(false);
  }
};
useEffect(() => {
  const loadData = async () => {
    if (!user?.sub) return;

  const quotes = (
  await fetchQuote(user.sub)
).filter(
  (q: any) =>
    new Date(q.createdAt).getFullYear() ===
    selectedYear
);

const dn = (
  await fetchDN(user.sub)
).filter(
  (d: any) =>
    new Date(d.createdAt).getFullYear() ===
    selectedYear
);

const order = (
  await fetchPO(user.sub)
).filter(
  (o: any) =>
    new Date(o.orderDate).getFullYear() ===
    selectedYear
);

const invoice = (
  await fetchInvoice(user.sub)
).filter(
  (i: any) =>
    new Date(
      i.invoiceDate || i.createdAt
    ).getFullYear() === selectedYear
);

const payment = (
  await fetchPayment(user.sub)
).filter(
  (p: any) =>
    new Date(
      p.paymentDate || p.createdAt
    ).getFullYear() === selectedYear
);

const project = (
  await fetchProject(user.sub)
).filter(
  (p: any) =>
    new Date(p.createdAt).getFullYear() ===
    selectedYear
);
    setNbQuote(quotes.length);
    setNbDn(dn.length);
    setNbOrder(order.length);
    setNbInvoice(invoice.length);
    setNbPayment(payment.length);
    setNbProject(project.length);

    setInvoiceStats({
      paid: invoice.filter(
        (i: any) => i.status === "PAID"
      ).length,

      recieved: invoice.filter(
        (i: any) => i.status === "SENT"
      ).length,

      cancelled: invoice.filter(
        (i: any) => i.status === "CANCELLED"
      ).length,

      draft: invoice.filter(
        (i: any) => i.status === "DRAFT"
      ).length,
    });

    setOrderStats({
      approved: order.filter(
        (i: any) => i.status === "APPROVED"
      ).length,

      pending: order.filter(
        (i: any) => i.status === "PENDING"
      ).length,

      cancelled: order.filter(
        (i: any) => i.status === "CANCELLED"
      ).length,

       recieved: order.filter(
        (i: any) => i.status === "RECEIVED"
      ).length,
    });

    // Purchased Products by Month
    const months = Array(12).fill(0);

    order.forEach((po: any) => {
      const month = new Date(
        po.orderDate
      ).getMonth();

      const totalQty = po.items.reduce(
        (sum: number, item: any) =>
          sum + item.quantity,
        0
      );

      months[month] += totalQty;
    });


    setPurchacedProd({
      jan: months[0],
      feb: months[1],
      mar: months[2],
      apr: months[3],
      may: months[4],
      jun: months[5],
      jul: months[6],
      aug: months[7],
      sep: months[8],
      oct: months[9],
      nov: months[10],
      dec: months[11],
    });
        let sum=0
        let due=0
payment.forEach((pay:any)=>{
   sum+=pay.amount
   due+=pay.invoice.balanceDue
})
setAmount(sum)
setDueBalance(due)
console.log(due)

  };
  loadData();
},  [user?.sub, selectedYear]);
  return (
<div
  ref={dashboardRef}
  className={`flex flex-col gap-4 md:gap-6 ${
    isPdfMode
      ? "w-[1200px] bg-white"
      : "w-full"
  }`}
>

  {/* HEADER */}
<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
<h1 className="text-2xl md:text-3xl font-bold">
{t("title")}       
      </h1>

      <p className="text-gray-500">
     {t("overview")}
      </p>
    </div>
<div className="flex flex-row flex-wrap gap-3">

 <select
  value={selectedYear}
  onChange={(e) =>
    setSelectedYear(Number(e.target.value))
  }
  className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
>
  {years.map((year) => (
    <option
      key={year}
      value={year}
    >
      {year}
    </option>
  ))}
</select>


  <button
    onClick={() =>
    generateDashboardPdf(
     Number(user?.sub),
2026,
      setPdfFile,
      setOpenShareModal,
   
    )
  }
    className="w-12 h-12 flex items-center justify-center bg-[#6C4DFF] text-white rounded-2xl shadow-lg hover:bg-[#5b3df0] transition"
  >
    <Share2Icon size={20} />
  </button>
  
  <button
    onClick={() =>
    downloadDashboardPdf(
     Number(user?.sub),
2026
   
    )
  }
    className="w-12 h-12 flex items-center justify-center bg-[#6C4DFF] text-white rounded-2xl shadow-lg hover:bg-[#5b3df0] transition"
  >
    <Download size={20} />
  </button>


    </div>
        
  </div>

  {/* KPI SECTION */}
 <div
  className={

 "grid grid-cols-1 sm:grid-cols-2 xl:flex gap-6 overflow-x-auto pb-2 scrollbar-hide"
  }
>

  <div className="min-w-0 xl:min-w-[260px] flex-shrink-0">
      <KPI
        title={t("kpi.projects")}
        number={nbProject}
        growth="+5.2%"
        href="/features/projects/pages"
        icon={
          <FolderKanban
            size={22}
            className="text-blue-600"
          />
        }
        color="bg-blue-100"
      />
    </div>



    <div className="min-w-0 xl:min-w-[260px] flex-shrink-0">
      <KPI
        title={t("kpi.orders")}
        number={nbOrder}
        growth="+15%"
        href="/features/purchase-order/pages"
        icon={
          <ShoppingCart
            size={22}
            className="text-orange-600"
          />
        }
        color="bg-orange-100"
      />
    </div>

   <div className="min-w-0 xl:min-w-[260px] flex-shrink-0">
      <KPI
        title={t("kpi.qtyDeliveredOrdered")}
        number={`${nbDn} / ${nbOrder}`}
        growth="84%"
         href="/features/delivery-note/pages"
        icon={
          <Truck
            size={22}
            className="text-green-600"
          />
        }
        color="bg-green-100"
      />
    </div>

<div className="min-w-0 xl:min-w-[260px] flex-shrink-0">
      <KPI
        title={t("kpi.invoicePaidTotal")}
        number={`${nbPyament} / ${nbInvoice}`}
        growth="74%"
        href="/features/payment/pages"
        icon={
          <Receipt
            size={22}
            className="text-pink-600"
          />
        }
        color="bg-pink-100"
      />
    </div>

   <div className="min-w-0 xl:min-w-[260px] flex-shrink-0">
      <KPI
        title={t("kpi.amountPaid")}
        number={`${formatTND(amount)}`}
        growth="+8.7%"
        icon={
          <CreditCard
            size={22}
            className="text-emerald-600"
          />
        }
        color="bg-emerald-100"
      />
    </div>
   <div className="min-w-0 xl:min-w-[260px] flex-shrink-0">
      <KPI
        title={t("kpi.dueBalance")}
        number={`${formatTND(balance)}`}
        growth="+8.7%"
        icon={
          <CreditCard
            size={22}
            className="text-emerald-600"
          />
        }
        color="bg-emerald-100"
      />
    </div>
  </div>


  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

    {/* LEFT SIDE */}
    <div className="xl:col-span-2 space-y-6">

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <div className="flex-1">
          <InvoiceStatusChart
            recieved={invoiceStats.recieved}
            draft={invoiceStats.draft}
            cancelled={invoiceStats.cancelled}
            paid={invoiceStats.paid}
          />
        </div>

        <div className="flex-1">
          <OrderStatusChart
            approved={orderStats.approved}
            cancelled={orderStats.cancelled}
            recieved={orderStats.recieved}
            pending={orderStats.pending}
          />
        </div>

      </div>

      <div className="mt-6">
        <PurchasedProductsChart
          purchacedProd={purchacedProd}
        />
      </div>

    </div>

    {/* RIGHT SIDE */}
    <div className="space-y-6">

      <div className="overflow-y-auto h-[350px] lg:h-[540px] bg-white rounded-3xl shadow-sm border border-gray-100">
        <UpcomingActivity />
      </div>

      <Reminders />

    </div>

  </div>

{openShareModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="w-full max-w-md w-[95%] bg-white rounded-3xl p-6 shadow-xl">

      <h2 className="text-xl font-bold text-gray-800 mb-2">
        Share Dashboard Report
      </h2>

      <p className="text-sm text-gray-500 mb-5">
        Send the generated PDF report by email
      </p>

      {/* Recipient */}
      <input
        type="email"
        placeholder="Recipient email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 outline-none focus:border-[#6C4DFF]"
      />

      {/* Subject */}
      <input
        type="text"
        placeholder="Email subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 outline-none focus:border-[#6C4DFF]"
      />

      {/* Message */}
      <textarea
        placeholder="Write your message..."
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 outline-none resize-none focus:border-[#6C4DFF]"
      />

      {/* PDF */}
      {pdfFile && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-4">
          <p className="text-sm text-gray-600">
            📄 {pdfFile.name}
          </p>
        </div>
      )}

      <div className="flex justify-end gap-3">

        <button
          onClick={() => setOpenShareModal(false)}
          className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50"
        >
          Cancel
        </button>

<button
  onClick={handleSendEmail}
  disabled={sending}
  className={`px-4 py-2 rounded-xl text-white transition flex items-center justify-center min-w-[110px] ${
    sending
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-[#6C4DFF] hover:bg-[#5b3df0]"
  }`}
>
  {sending ? (
    <div className="flex items-center gap-2">
      <svg
        className="w-5 h-5 animate-spin"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="white"
          strokeWidth="4"
          opacity="0.25"
        />
        <path
          d="M22 12a10 10 0 00-10-10"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>

      Sending...
    </div>
  ) : (
    "Send"
  )}
</button>

      </div>

    </div>
  </div>
)}
{openSuccessModal && (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-white rounded-3xl p-8 shadow-xl max-w-sm w-full text-center">

      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-2">
        Email Sent
      </h3>

      <p className="text-gray-500 mb-6">
        Dashboard report has been sent successfully.
      </p>

      <button
        onClick={() =>
          setOpenSuccessModal(false)
        }
        className="w-full py-3 rounded-xl bg-[#6C4DFF] text-white hover:bg-[#5b3df0]"
      >
        OK
      </button>

    </div>
  </div>
)}
{openErrorModal && (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-white rounded-3xl p-8 shadow-xl max-w-sm w-full text-center">

      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-2">
        Failed
      </h3>

      <p className="text-gray-500 mb-6">
        {errorMessage}
      </p>

      <button
        onClick={() => setOpenErrorModal(false)}
        className="w-full py-3 rounded-xl bg-red-500 text-white hover:bg-red-600"
      >
        OK
      </button>

    </div>
  </div>
)}
</div>
  )
}

export default page
