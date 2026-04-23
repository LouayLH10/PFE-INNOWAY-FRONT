"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { getUserFromToken } from "../../auth/pages/login/user";
import { useRouter } from "next/navigation";
import SearchBar from "../../components/searchBar";
import { downloadPayment, fetchPayment } from "../service/paymentService";
type Payment = {
  id: number;
  amount: number;
  status: string;
  paymentDate: string;
  createdAt?: string;

  invoiceId: number;

  // 🔗 relation invoice
  invoice: {
    id: number;
    name: string;
    status: string;

    reference: string;

    issueDate: string;
    dueDate: string;

    subTotal: number;
    discountTotal: number;
    taxTotal: number;
    total: number;
    tva: number;

    amountPaid: number;
    balanceDue: number;

    paymentTerms: string;
    currency: string;

    createdAt: string;

    contactId: number;
    projectId: number;

    // 🔥 optionnel (si include)
    contact?: {
      user?: {
        name?: string;
        email?: string;
      };
    };
  };
};

function Page() {
  const [payment, setPayment] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [query, setQuery] = useState("");

  const router = useRouter();

  // ✅ format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")} ${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  // ✅ filter
const filteredPayment = payment.filter((d) =>
  d.invoice?.reference?.toLowerCase().includes(query.toLowerCase()) ||
  d.status?.toLowerCase().includes(query.toLowerCase()) ||
  d.invoice?.contact?.user?.email
    ?.toLowerCase()
    .includes(query.toLowerCase()) ||
  d.amount?.toString().includes(query)
);

  // ✅ AUTH + FETCH
  useEffect(() => {
    const user = getUserFromToken();

    if (!user) {
      router.push("/features/auth/pages/login");
      return;
    }

    setIsAuthChecked(true);

    const fetchDev = async () => {
      try {
        setLoading(true);

        // ❗ CORRECTION ICI
        const data = await fetchPayment(user.sub);

        setPayment(data); // déjà tableau
        setError("");
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des payment");
      } finally {
        setLoading(false);
      }
    };

    fetchDev();
  }, [router]);

  // ✅ DOWNLOAD


  // ✅ STATUS
  const Status = (status: string) => {
    switch (status) {
      case "DRAFT":
        return {
          state: "DRAFT",
          style: "bg-yellow-500 text-white px-2 py-1 rounded",
        };
      case "SENT":
        return {
          state: "SENT",
          style: "bg-blue-500 text-white px-2 py-1 rounded",
        };
      case "PAID":
        return {
          state: "PAID",
          style: "bg-green-500 text-white px-2 py-1 rounded",
        };
      default:
        return {
          state: status,
          style: "bg-gray-400 text-white px-2 py-1 rounded",
        };
    }
  };

  if (!isAuthChecked) return null;

  return (
<div className="w-full p-1 mt-5 ">
        <h1 className="text-2xl font-bold mb-6">List of Payment</h1>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search payment..."
      />

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto bg-white shadow rounded-2xl">
<table className="min-w-full text-sm">
  <thead className="bg-gray-100">
    <tr>
      <th className="px-4 py-3 text-left">Reference</th>
      <th className="px-4 py-3 text-left">Amount</th>
      <th className="px-4 py-3 text-left">Invoice</th>
      <th className="px-4 py-3 text-left">Payment Date</th>
      <th className="px-4 py-3 text-left">Status</th>
      <th className="px-4 py-3 text-left">Action</th>
    </tr>
  </thead>

  <tbody>
    {filteredPayment.length === 0 ? (
      <tr>
        <td colSpan={7} className="text-center py-4 text-gray-500">
          No results found
        </td>
      </tr>
    ) : (
      filteredPayment.map((d) => {
        const statusObj = Status(d.status);

        return (
          <tr key={d.id} className="border-t hover:bg-gray-50">

            {/* ✅ PAYMENT ID / REF */}
            <td className="px-4 py-3">
              <b>PAY-{d.id}</b>
            </td>

   

            {/* ✅ AMOUNT */}
            <td className="px-4 py-3 font-semibold">
              {d.amount} {d.invoice?.currency || "TND"}
            </td>

            {/* ✅ INVOICE REF */}
            <td className="px-4 py-3">
              {d.invoice?.reference || "-"}
            </td>

            {/* ✅ PAYMENT DATE */}
            <td className="px-4 py-3">
              {formatDate(d.paymentDate)}
            </td>

            {/* ✅ STATUS */}
            <td className="px-4 py-3">
              <div className={statusObj.style}>
                {statusObj.state}
              </div>
            </td>

            {/* ✅ ACTION */}
            <td className="px-4 py-3">
              <button
                onClick={() => downloadPayment(d.id)}
                className="px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700"
              >
                Download
              </button>
            </td>

          </tr>
        );
      })
    )}
  </tbody>
</table>
        </div>
      )}
    </div>
  );
}

export default Page;