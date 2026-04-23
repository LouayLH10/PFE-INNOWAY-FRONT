"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { getUserFromToken } from "../../auth/pages/login/user";
import { useRouter } from "next/navigation";
import SearchBar from "../../components/searchBar";
import { downloadProject, fetchProject } from "../service/projectService";
import { ChevronDown } from "lucide-react";
type Project = {
  id: number;
  title: string;
  description: string;
  status: string;

  startDate: string;
  endDate?: string;

  createdAt: string;

  contact: {
    user?: {
      name?: string;
      email?: string;
    };
  };

  // 🔥 PHASES
  phases: {
    id: number;
    name: string;
    description: string;
    status: string;
    startDate: string;
    endDate?: string;

    // 🔥 DELIVERABLES (par phase)
    deliverables: {
      id: number;
      name: string;
      description: string;
      status: string;
      deadline: string;
    }[];
  }[];

  // 🔥 MILESTONES (jalons)
  milestone: {
    id: number;
    name: string;
    description: string;
    status: string;
    deadline: string;
  }[];
};

function Page() {
  const [project, setProject] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [query, setQuery] = useState("");

  const router = useRouter();
const [openRow, setOpenRow] = useState<number | null>(null);
const [openPhaseRow, setOpenPhaseRow] = useState<number | null>(null);
const [openPhases, setOpenPhases] = useState(false);
const [openMilestones, setOpenMilestones] = useState(false);
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
  const formatDateDeadline = (dateString: string) => {
    const date = new Date(dateString);

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`
  };
  // ✅ filter
const filteredProject = project.filter((d) =>
  d.title.toLowerCase().includes(query.toLowerCase()) ||
  d.description.toLowerCase().includes(query.toLowerCase()) ||
  d.status.toLowerCase().includes(query.toLowerCase()) ||
  d.contact?.user?.email?.toLowerCase().includes(query.toLowerCase())
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
        const data = await fetchProject(user.sub);

        setProject(data); // déjà tableau
        setError("");
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des project");
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
const phaseStatus= (status:String)=>{
    switch (status) {
      case "IN_PROGRESS":
        return {
          state: "IN PROGRESS",
          style: "bg-yellow-500 text-white px-2 py-1 rounded",
        };
      case "PLANNED":
        return {
          state: "PLANNED",
          style: "bg-blue-500 text-white px-2 py-1 rounded",
        };

      default:
        return {
          state: status,
          style: "bg-green-600 text-white px-2 py-1 rounded",
        };
    }
}
const delivrableStatus= (status:String)=>{
    switch (status) {
      case "IN_PROGRESS":
        return {
          state: "IN PROGRESS",
          style: "bg-yellow-500 text-white px-2 py-1 rounded",
        };
      case "PENDING":
        return {
          state: "PENDING",
          style: "bg-blue-500 text-white px-2 py-1 rounded",
        };

      default:
        return {
          state: status,
          style: "bg-green-600 text-white px-2 py-1 rounded",
        };
    }
}
  if (!isAuthChecked) return null;

  return (
    <div className="p-6 mt-5">
      <h1 className="text-2xl font-bold mb-6">List of Project</h1>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search project..."
      />

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto bg-white shadow rounded-2xl">
<table className="min-w-full text-sm">
  <thead className="bg-gray-100">
    <tr>
      <th className="px-4 py-3 text-left"></th>
      <th className="px-4 py-3 text-left">Title</th>
      <th className="px-4 py-3 text-left">Client Email</th>
      <th className="px-4 py-3 text-left">Description</th>
      <th className="px-4 py-3 text-left">Start Date</th>
      <th className="px-4 py-3 text-left">End Date</th>
      <th className="px-4 py-3 text-left">Phases</th>
      <th className="px-4 py-3 text-left">Milestones</th>
      <th className="px-4 py-3 text-left">Status</th>
      <th className="px-4 py-3 text-left">Created At</th>
      <th className="px-4 py-3 text-left">Action</th>
    </tr>
  </thead>

  <tbody>
    {filteredProject.length === 0 ? (
      <tr>
        <td colSpan={10} className="text-center py-4 text-gray-500">
          No results found
        </td>
      </tr>
    ) : (
filteredProject.map((d) => {
  const statusObj = Status(d.status);

  return (
    <React.Fragment key={d.id}>
      
      {/* 🔹 Ligne principale */}
      <tr className="border-t hover:bg-gray-50">
        <td className="px-4 py-3">
          <button
          className={`cursor-pointer  hover:text-blue-600 ${openRow===d.id ?"text-blue-600":""}`}
            onClick={() =>
              setOpenRow(openRow === d.id ? null : d.id)
            }
          >
            <ChevronDown
              className={`transition-transform duration-300 hover:text-blue:300 ${
                openRow === d.id ? "rotate-180" : ""
              }`}
            />
          </button>
        </td>

        <td className="px-4 py-3"><b>{d.title}</b></td>
        <td className="px-4 py-3">{d.contact?.user?.email || "-"}</td>
        <td className="px-4 py-3">{d.description}</td>
        <td className="px-4 py-3">{formatDate(d.startDate)}</td>
        <td className="px-4 py-3">{d.endDate ? formatDate(d.endDate) : "-"}</td>
        <td className="px-4 py-3">{d.phases?.length || 0}</td>
        <td className="px-4 py-3">{d.milestone?.length || 0}</td>

        <td className="px-4 py-3">
          <div className={statusObj.style}>{statusObj.state}</div>
        </td>

        <td className="px-4 py-3">{formatDate(d.createdAt)}</td>

        <td className="px-4 py-3">
          <button
            onClick={() => downloadProject(d.id)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Download
          </button>
        </td>
      </tr>

      {/* 🔹 Détails projet */}

<tr>
  <td colSpan={11} className="p-0 border-none">
    <div
      className={`transition-all duration-500 ease-in-out overflow-hidden ${
        openRow === d.id ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="bg-gray-200 p-6">

    <div
    className={`flex items-center gap-3 cursor-pointer text-3xl font-bold hover:text-blue-600 mb-6  pb-4 ${openPhases ? "bg-blue-100 text-blue-600":""}`}
    onClick={() => setOpenPhases(!openPhases)}
  >
    <ChevronDown
      className={`transition-transform duration-300 ${
        openPhases ? "rotate-180" : ""
      }`}
    />
    <span>Phases</span>
    </div>
<div
  className={`transition-all duration-500 overflow-hidden ${
    openPhases ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
  }`}
>
        {d.phases?.map((phase) => {
          const phaseObj = phaseStatus(phase.status);

          return (
            <div key={phase.id} className={`mb-6  pb-4 cursor-pointer hover:text-blue-600 ${openPhaseRow === phase.id ?"bg-blue-100 text-blue-600 ":""}`}        onClick={() =>
                    setOpenPhaseRow(
                      openPhaseRow === phase.id ? null : phase.id
                    )}>

              <div className="flex items-center gap-4 ">
                <button
                className="cursor-pointer"
                  onClick={() =>
                    setOpenPhaseRow(
                      openPhaseRow === phase.id ? null : phase.id
                    )
                  }
                >
                  <ChevronDown
                    className={`transition-transform duration-300 ${
                      openPhaseRow === phase.id ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div className="font-bold text-xl cursor-pointer"  >
                  {phase.name}
                </div>

                <div className={`ml-auto ${phaseObj.style}`}>
                  {phaseObj.state}
                </div>
              </div>

              {/* 🔥 Deliverables avec animation */}
              <div
                className={`transition-all duration-500 overflow-hidden ${
                  openPhaseRow === phase.id
                    ? "max-h-96 opacity-100 mt-4"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="bg-blue-100 p-5 rounded">

                  <div className="text-xl font-bold text-blue-600 mb-4">
                    Deliverables
                  </div>

                  {phase.deliverables?.map((delivrable) => {
                    const dStatus = delivrableStatus(delivrable.status);

                    return (
                      <div
                        key={delivrable.id}
                        className="flex items-center mb-3"
                      >
                        <span className="font-medium text-black">
                          {delivrable.name}
                        </span>

                        <span className={`ml-auto ${dStatus.style}`}>
                          {dStatus.state}
                        </span>
                      </div>
                    );
                  })}

                </div>
              </div>

            </div>
          );
        })}
</div>
<div
   className={`flex items-center gap-3 cursor-pointer text-3xl font-bold hover:text-blue-600  mb-6  pb-4 ${openMilestones ? "bg-blue-100 text-blue-600":""}`}
   
  onClick={() => setOpenMilestones(!openMilestones)}
>
  <ChevronDown
    className={`transition-transform duration-300 ${
      openMilestones ? "rotate-180" : ""
    }`}
  />
  <span>Milestones</span>
</div>
<div
  className={`transition-all duration-500 overflow-hidden ${
    openMilestones ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
  }`}
>
    {d.milestone?.map((milestone) => {
    const statusObj = phaseStatus(milestone.status);

    return (
      <div
        key={milestone.id}
        className="flex items-center gap-4 mb-4  pb-3"
      >
        <div className="font-bold text-lg">
          {milestone.name} (Deadline :{formatDateDeadline(milestone.deadline)})
        </div>

        <div className={`ml-auto ${statusObj.style}`}>
          {statusObj.state}
        </div>
      </div>
    );
  })}

</div>
      </div>
    </div>
  </td>
</tr>
  
    </React.Fragment>
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