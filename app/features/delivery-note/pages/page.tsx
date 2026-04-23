"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { getUserFromToken } from "../../auth/pages/login/user";
import { useRouter } from "next/navigation";
import SearchBar from "../../components/searchBar";
import { downloadDN,fetchDN } from "../service/deliveryNoteService";

type DeliveryNote = {
  id: number;
  reference: string;

  deliveryDate: string;
  location: string;

  status: string;

  createdAt: string;

  contact: {
    user?: {
      email?: string;
      name?: string;
    };
    phone?: string;
  };

  items: {
    id: number;
    description: string;
    quantity: number;
    unity: string;
  }[];
};

function Page() {
  const [deliveryNotes, setDeliveryNotes] = useState<DeliveryNote[]>([]);
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
const filteredDN = deliveryNotes.filter((dn) =>
  dn.reference.toLowerCase().includes(query.toLowerCase()) ||
  dn.location.toLowerCase().includes(query.toLowerCase()) ||
  dn.contact?.user?.email?.toLowerCase().includes(query.toLowerCase())
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
        const data = await fetchDN(user.sub);

        setDeliveryNotes(data); // déjà tableau
        setError("");
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des Delivery Note");
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
      <h1 className="text-2xl font-bold mb-6">List of Delivery Notes </h1>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search Delivey Note..."
      />

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto bg-white shadow rounded-2xl">
          <table className="min-w-full text-sm">
<thead className="bg-gray-100">
  <tr>
    <th className="px-4 py-3 text-left">Reference</th>
    <th className="px-4 py-3 text-left">Client</th>
    <th className="px-4 py-3 text-left">Email</th>
    <th className="px-4 py-3 text-left">Location</th>
    <th className="px-4 py-3 text-left">Delivery Date</th>
    <th className="px-4 py-3 text-left">Items</th>
    <th className="px-4 py-3 text-left">Status</th>
    <th className="px-4 py-3 text-left">Created At</th>
    <th className="px-4 py-3 text-left">Action</th>
  </tr>
</thead>

<tbody>
  {filteredDN.length === 0 ? (
    <tr>
      <td colSpan={9} className="text-center py-4 text-gray-500">
        No results found
      </td>
    </tr>
  ) : (
    filteredDN.map((dn) => {
      const statusObj = Status(dn.status);

      return (
        <tr key={dn.id} className="border-t hover:bg-gray-50">

          <td className="px-4 py-3">
            <b>{dn.reference}</b>
          </td>

          <td className="px-4 py-3">
            {dn.contact?.user?.name || "-"}
          </td>

          <td className="px-4 py-3">
            {dn.contact?.user?.email || "-"}
          </td>

          <td className="px-4 py-3">{dn.location}</td>

          <td className="px-4 py-3">
            {formatDate(dn.deliveryDate)}
          </td>

          {/* ✅ nombre de lignes */}
          <td className="px-4 py-3">
            {dn.items?.length || 0} items
          </td>

          <td className="px-4 py-3">
            <div className={statusObj.style}>
              {statusObj.state}
            </div>
          </td>

          <td className="px-4 py-3">
            {formatDate(dn.createdAt)}
          </td>

          <td className="px-4 py-3">
            <button
              onClick={() => downloadDN(dn.id)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
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