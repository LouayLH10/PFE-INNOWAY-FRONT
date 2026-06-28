"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { getUserFromToken } from "../../auth/pages/login/user";
import { useRouter } from "next/navigation";
import SearchBar from "../../components/searchBar";
import { downloadPO, fetchPO } from "../service/purchaseOrderService";

type PurchaseOrder = {
  id: number;
  reference: string;

  supplierName: string;
  supplierEmail: string;
  supplierPhone: string;

  orderDate: string;
  deliveryDate?: string;

  status: string;

  subTotal: number;
  tax: number;
  total: number;

  notes?: string;

  createdAt: string;

  contact: {
    user?: {
      email?: string;
    };
  };
};

function Page() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
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
const filteredPO = purchaseOrders.filter((po) =>
  po.reference.toLowerCase().includes(query.toLowerCase()) ||
  po.supplierEmail.toLowerCase().includes(query.toLowerCase()) ||
  po.supplierName.toLowerCase().includes(query.toLowerCase()) ||
  po.total.toString().includes(query)
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
        const data = await fetchPO(user.sub);

        setPurchaseOrders(data); // déjà tableau
        setError("");
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des quote");
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
    case "PENDING":
      return {
        state: "PENDING",
        style: "bg-yellow-500 text-white px-2 py-1 rounded",
      };
    case "APPROVED":
      return {
        state: "APPROVED",
        style: "bg-blue-500 text-white px-2 py-1 rounded",
      };
    case "DELIVERED":
      return {
        state: "DELIVERED",
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
    <div className="p-6 mt-5">
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search quote..."
      />

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

{!loading && !error && (
  <>
    {/* ================= DESKTOP ================= */}
    <div className="hidden lg:block overflow-x-auto bg-white rounded-3xl shadow-sm border border-gray-100">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr className="text-gray-500 text-xs uppercase tracking-wider">
            <th className="px-6 py-5 text-left">Reference</th>
            <th className="px-6 py-5 text-left">Supplier</th>
            <th className="px-6 py-5 text-left">Email</th>
            <th className="px-6 py-5 text-left">Phone</th>
            <th className="px-6 py-5 text-left">Order Date</th>
            <th className="px-6 py-5 text-left">Delivery Date</th>
            <th className="px-6 py-5 text-left">Subtotal</th>
            <th className="px-6 py-5 text-left">Tax</th>
            <th className="px-6 py-5 text-left">Total</th>
            <th className="px-6 py-5 text-left">Status</th>
            <th className="px-6 py-5 text-left">Created</th>
            <th className="px-6 py-5 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredPO.length === 0 ? (
            <tr>
              <td
                colSpan={12}
                className="text-center py-10 text-gray-400"
              >
                No results found
              </td>
            </tr>
          ) : (
            filteredPO.map((po, index) => {
              const statusObj = Status(po.status);

              return (
                <tr
                  key={po.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${
                    index % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50/40"
                  }`}
                >
                  <td className="px-6 py-5 font-semibold">
                    {po.reference}
                  </td>

                  <td className="px-6 py-5">
                    {po.supplierName}
                  </td>

                  <td className="px-6 py-5">
                    {po.supplierEmail}
                  </td>

                  <td className="px-6 py-5">
                    {po.supplierPhone}
                  </td>

                  <td className="px-6 py-5">
                    {formatDate(po.orderDate)}
                  </td>

                  <td className="px-6 py-5">
                    {po.deliveryDate
                      ? formatDate(po.deliveryDate)
                      : "-"}
                  </td>

                  <td className="px-6 py-5">
                    {po.subTotal} TND
                  </td>

                  <td className="px-6 py-5">
                    {po.tax} TND
                  </td>

                  <td className="px-6 py-5 font-bold">
                    {po.total} TND
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`${statusObj.style} inline-flex px-3 py-1 rounded-full text-xs font-semibold`}
                    >
                      {statusObj.state}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    {formatDate(po.createdAt)}
                  </td>

                  <td className="px-6 py-5">
                    <button
                      onClick={() =>
                        downloadPO(po.id)
                      }
                      className="px-5 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700"
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

    {/* ================= MOBILE ================= */}
    <div className="lg:hidden space-y-4">
      {filteredPO.length === 0 ? (
        <div className="bg-white rounded-3xl p-6 text-center text-gray-400">
          No results found
        </div>
      ) : (
        filteredPO.map((po) => {
          const statusObj = Status(po.status);

          return (
            <div
              key={po.id}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5"
            >
              <div className="flex justify-between items-center">

                <h3 className="font-bold text-lg">
                  {po.reference}
                </h3>

                <span
                  className={`${statusObj.style} px-3 py-1 rounded-full text-xs`}
                >
                  {statusObj.state}
                </span>

              </div>

              <div className="mt-4 space-y-2 text-sm">

                <p>
                  <span className="font-semibold">
                    Supplier:
                  </span>{" "}
                  {po.supplierName}
                </p>

                <p>
                  <span className="font-semibold">
                    Email:
                  </span>{" "}
                  {po.supplierEmail}
                </p>

                <p>
                  <span className="font-semibold">
                    Phone:
                  </span>{" "}
                  {po.supplierPhone}
                </p>

                <p>
                  <span className="font-semibold">
                    Order Date:
                  </span>{" "}
                  {formatDate(po.orderDate)}
                </p>

                <p>
                  <span className="font-semibold">
                    Delivery:
                  </span>{" "}
                  {po.deliveryDate
                    ? formatDate(po.deliveryDate)
                    : "-"}
                </p>

                <p>
                  <span className="font-semibold">
                    Subtotal:
                  </span>{" "}
                  {po.subTotal} TND
                </p>

                <p>
                  <span className="font-semibold">
                    Tax:
                  </span>{" "}
                  {po.tax} TND
                </p>

                <p className="font-bold text-lg text-[#6C4DFF]">
                  {po.total} TND
                </p>

                <p className="text-gray-500 text-xs">
                  {formatDate(po.createdAt)}
                </p>

              </div>

              <button
                onClick={() =>
                  downloadPO(po.id)
                }
                className="w-full mt-5 bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl font-semibold"
              >
                Download
              </button>
            </div>
          );
        })
      )}
    </div>
  </>
)}
    </div>
  );
}

export default Page;