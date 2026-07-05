"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { getUserFromToken } from "../../auth/pages/login/user";
import { useRouter } from "next/navigation";
import SearchBar from "../../components/searchBar";
import { downloadProject, fetchProject } from "../service/projectService";
import { ChevronDown } from "lucide-react";
import { formatDate } from "../../services/generalFunctions";
import { useTranslation } from "react-i18next";
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
const { t } = useTranslation("project");

  const router = useRouter();
const [openRow, setOpenRow] = useState<number | null>(null);
const [openPhaseRow, setOpenPhaseRow] = useState<number | null>(null);
const [openPhases, setOpenPhases] = useState(false);
const [openMilestones, setOpenMilestones] = useState(false);

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
    case "IN_PROGRESS":
      return {
        state: t("phaseStatus.IN_PROGRESS").toUpperCase(),
        style: "bg-yellow-500 text-white px-2 py-1 rounded",
      };

    case "PLANNED":
      return {
        state: t("Status.PLANNED").toUpperCase(),
        style: "bg-blue-500 text-white px-2 py-1 rounded",
      };

    case "COMPLETED":
      return {
        state: t("Status.COMPLETED").toUpperCase(),
        style: "bg-green-600 text-white px-2 py-1 rounded",
      };
      default:
      return {
        state: t("Status.COMPLETED").toUpperCase(),
        style: "bg-gray-600 text-white px-2 py-1 rounded",
      };
  }
  };
const phaseStatus = (status: string) => {
  switch (status) {
    case "IN_PROGRESS":
      return {
        state: t("phaseStatus.IN_PROGRESS").toUpperCase(),
        style: "bg-yellow-500 text-white px-2 py-1 rounded",
      };

    case "PLANNED":
      return {
        state: t("phaseStatus.PLANNED").toUpperCase(),
        style: "bg-blue-500 text-white px-2 py-1 rounded",
      };

    default:
      return {
        state: t("phaseStatus.COMPLETED").toUpperCase(),
        style: "bg-green-600 text-white px-2 py-1 rounded",
      };
  }
};
const delivrableStatus = (status: string) => {
  switch (status) {
    case "IN_PROGRESS":
      return {
        state: t("deliverableStatus.IN_PROGRESS").toUpperCase(),
        style: "bg-yellow-500 text-white px-2 py-1 rounded",
      };

    case "PENDING":
      return {
        state: t("deliverableStatus.PENDING").toUpperCase(),
        style: "bg-blue-500 text-white px-2 py-1 rounded",
      };

    default:
      return {
        state: t("deliverableStatus.COMPLETED").toUpperCase(),
        style: "bg-green-600 text-white px-2 py-1 rounded",
      };
  }
};
  if (!isAuthChecked) return null;

  return (
    <div className="p-6 mt-5">
   

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search project..."
      />

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

{!loading && !error && (
  <>
    {/* ===========================
        MOBILE
    ============================ */}
    <div className="lg:hidden space-y-5">

      {filteredProject.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center text-gray-400">
          No results found
        </div>
      ) : (
        filteredProject.map((d) => {
          const statusObj = Status(d.status);

          return (
            <div
              key={d.id}
              className="bg-white rounded-3xl shadow border p-5"
            >
              <div className="flex justify-between items-start">

                <div>
                  <h2 className="font-bold text-lg">
                    {d.title}
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    {d.contact?.user?.email}
                  </p>
                </div>

                <div className={statusObj.style}>
                  {statusObj.state}
                </div>

              </div>

              <p className="mt-4 text-gray-700">
                {d.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mt-5 text-sm">

                <div>
          <span className="text-gray-400">
  {t("mobile.start")}
</span>

                  <p className="font-medium">
                    {formatDate(d.startDate)}
                  </p>
                </div>

                <div>
       <span className="text-gray-400">
  {t("mobile.end")}
</span>

                  <p className="font-medium">
                    {d.endDate
                      ? formatDate(d.endDate)
                      : "-"}
                  </p>
                </div>

                <div>
      <span className="text-gray-400">
  {t("mobile.created")}
</span>

                  <p className="font-medium">
                    {formatDate(d.createdAt)}
                  </p>
                </div>

              </div>

              <button
                onClick={() =>
                  setOpenRow(
                    openRow === d.id ? null : d.id
                  )
                }
                className="w-full mt-5 bg-gray-100 rounded-xl py-3 flex items-center justify-center gap-2"
              >
                <ChevronDown
                  className={`transition ${
                    openRow === d.id
                      ? "rotate-180"
                      : ""
                  }`}
                />

                {t("mobile.details")}
              </button>

              {openRow === d.id && (

                <div className="mt-6 space-y-6">

                  {/* PHASES */}
                  <div>

                <h3 className="font-bold text-lg mb-4">
  {t("mobile.phases")}
</h3>

                    {d.phases?.map((phase) => {

                      const phaseObj =
                        phaseStatus(
                          phase.status
                        );

                      return (

                        <div
                          key={phase.id}
                          className="border rounded-2xl p-4 mb-4"
                        >

                          <div className="flex justify-between">

                            <strong>
                              {phase.name}
                            </strong>

                            <span
                              className={
                                phaseObj.style
                              }
                            >
                              {phaseObj.state}
                            </span>

                          </div>

                          <div className="mt-4 space-y-2">

                            {phase.deliverables?.map(
                              (deliverable) => {

                                const st =
                                  delivrableStatus(
                                    deliverable.status
                                  );

                                return (
                                  <div
                                    key={
                                      deliverable.id
                                    }
                                    className="flex justify-between text-sm"
                                  >
                                    <span>
                                      {
                                        deliverable.name
                                      }
                                    </span>

                                    <span
                                      className={
                                        st.style
                                      }
                                    >
                                      {st.state}
                                    </span>

                                  </div>
                                );
                              }
                            )}

                          </div>

                        </div>

                      );
                    })}

                  </div>

                  {/* MILESTONES */}

                  <div>

         <h3 className="font-bold text-lg mb-4">
  {t("mobile.milestones")}
</h3>
                    {d.milestone?.map(
                      (milestone) => {

                        const st =
                          phaseStatus(
                            milestone.status
                          );

                        return (

                          <div
                            key={milestone.id}
                            className="border rounded-2xl p-4 mb-3"
                          >

                            <div className="flex justify-between">

                              <div>

                                <strong>
                                  {milestone.name}
                                </strong>

                                <p className="text-sm text-gray-400">
                                  {formatDateDeadline(
                                    milestone.deadline
                                  )}
                                </p>

                              </div>

                              <span
                                className={st.style}
                              >
                                {st.state}
                              </span>

                            </div>

                          </div>

                        );
                      }
                    )}

                  </div>

                  <button
                    onClick={() =>
                      downloadProject(d.id)
                    }
                    className="w-full bg-green-600 text-white py-3 rounded-xl"
                  >
  {t("buttons.download")}
                  </button>

                </div>

              )}

            </div>
          );
        })
      )}

    </div>

    {/* ===========================
        DESKTOP
    ============================ */}
    <div className="hidden lg:block overflow-x-auto bg-white rounded-3xl shadow-sm border border-gray-100">

 <table className="min-w-full text-sm text-gray-700">



    {/* HEADER */}

   <thead className="bg-gray-50 border-b border-gray-200">
  <tr className="text-gray-500 text-xs uppercase tracking-wider">

    <th className="px-6 py-5 text-left font-semibold"></th>

    <th className="px-6 py-5 text-left font-semibold">
      {t("table.title")}
    </th>

    <th className="px-6 py-5 text-left font-semibold">
      {t("table.clientEmail")}
    </th>

    <th className="px-6 py-5 text-left font-semibold">
      {t("table.description")}
    </th>

    <th className="px-6 py-5 text-left font-semibold">
      {t("table.startDate")}
    </th>

    <th className="px-6 py-5 text-left font-semibold">
      {t("table.endDate")}
    </th>

    <th className="px-6 py-5 text-left font-semibold">
      {t("table.status")}
    </th>

    <th className="px-6 py-5 text-left font-semibold">
      {t("table.createdAt")}
    </th>

    <th className="px-6 py-5 text-left font-semibold">
      {t("table.action")}
    </th>

  </tr>
</thead>



    {/* BODY */}

    <tbody>

      {filteredProject.length === 0 ? (

        <tr>

          <td

            colSpan={11}

            className="text-center py-10 text-gray-400"

          >

            No results found

          </td>

        </tr>

      ) : (

        filteredProject.map((d, index) => {

          const statusObj = Status(d.status);



          return (

            <React.Fragment key={d.id}>



              {/* 🔹 MAIN ROW */}

              <tr

                className={`border-b border-gray-100 transition hover:bg-gray-50 ${

                  index % 2 === 0 ? "bg-white" : "bg-gray-50/40"

                }`}

              >

                {/* Expand Button */}

                <td className="px-6 py-5">

                  <button

                    className={`cursor-pointer transition ${

                      openRow === d.id

                        ? "text-blue-600"

                        : "text-gray-500 hover:text-blue-600"

                    }`}

                    onClick={() =>

                      setOpenRow(openRow === d.id ? null : d.id)

                    }

                  >

                    <ChevronDown

                      className={`transition-transform duration-300 ${

                        openRow === d.id ? "rotate-180" : ""

                      }`}

                    />

                  </button>

                </td>



                {/* Title */}

                <td className="px-6 py-5 font-semibold text-gray-800">

                  {d.title}

                </td>



                {/* Email */}

                <td className="px-6 py-5">

                  <span className="font-medium">

                    {d.contact?.user?.email || "-"}

                  </span>

                </td>



                {/* Description */}

                <td className="px-6 py-5 max-w-[260px]">

                  {d.description}

                </td>



                {/* Start Date */}

                <td className="px-6 py-5">

                  {formatDate(d.startDate)}

                </td>



                {/* End Date */}

                <td className="px-6 py-5">

                  {d.endDate

                    ? formatDate(d.endDate)

                    : "-"}

                </td>



         



                {/* Status */}

                <td className="px-6 py-5">

                  <div

                    className={`${statusObj.style} inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold`}

                  >

                    {statusObj.state}

                  </div>

                </td>



                {/* Created */}

                <td className="px-6 py-5">

                  {formatDate(d.createdAt)}

                </td>



                {/* Action */}

                <td className="px-6 py-5">

                  <button

                    onClick={() => downloadProject(d.id)}

                    className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 shadow-sm transition"

                  >

                    Download

                  </button>

                </td>

              </tr>



              {/* 🔹 DETAILS */}

              <tr>

                <td colSpan={11} className="p-0 border-none">

                  <div

                    className={`transition-all duration-500 ease-in-out overflow-hidden ${

                      openRow === d.id

                        ? "max-h-[2000px] opacity-100"

                        : "max-h-0 opacity-0"

                    }`}

                  >

                    <div className="bg-gray-50 px-8 py-6">



                      {/* PHASES */}

                      <div

                        className={`flex items-center gap-3 cursor-pointer text-2xl font-bold mb-6 transition ${

                          openPhases

                            ? "text-blue-600"

                            : "text-gray-800 hover:text-blue-600"

                        }`}

                        onClick={() =>

                          setOpenPhases(!openPhases)

                        }

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

                          openPhases

                            ? "max-h-[2000px] opacity-100"

                            : "max-h-0 opacity-0"

                        }`}

                      >

                        {d.phases?.map((phase) => {

                          const phaseObj = phaseStatus(

                            phase.status

                          );



                          return (

                            <div

                              key={phase.id}

                              className={`mb-5 rounded-2xl border p-5 transition ${

                                openPhaseRow === phase.id

                                  ? "bg-blue-50 border-blue-200"

                                  : "bg-white hover:bg-gray-50"

                              }`}

                            >



                              {/* Phase Header */}

                              <div

                                className="flex items-center gap-4 cursor-pointer"

                                onClick={() =>

                                  setOpenPhaseRow(

                                    openPhaseRow === phase.id

                                      ? null

                                      : phase.id

                                  )

                                }

                              >

                                <ChevronDown

                                  className={`transition-transform duration-300 ${

                                    openPhaseRow === phase.id

                                      ? "rotate-180 text-blue-600"

                                      : ""

                                  }`}

                                />



                                <div className="font-bold text-lg">

                                  {phase.name}

                                </div>



                                <div

                                  className={`ml-auto ${phaseObj.style}`}

                                >

                                  {phaseObj.state}

                                </div>

                              </div>



                              {/* Deliverables */}

                              <div

                                className={`transition-all duration-500 overflow-hidden ${

                                  openPhaseRow === phase.id

                                    ? "max-h-96 opacity-100 mt-5"

                                    : "max-h-0 opacity-0"

                                }`}

                              >

                                <div className="bg-blue-100 rounded-2xl p-5">



                                  <div className="text-lg font-bold text-blue-700 mb-4">

  {t("details.deliverables")}

                                  </div>



                                  {phase.deliverables?.map(

                                    (delivrable) => {

                                      const dStatus =

                                        delivrableStatus(

                                          delivrable.status

                                        );



                                      return (

                                        <div

                                          key={delivrable.id}

                                          className="flex items-center py-3 border-b border-blue-200 last:border-none"

                                        >

                                          <span className="font-medium text-gray-800">

                                            {delivrable.name}

                                          </span>



                                          <span

                                            className={`ml-auto ${dStatus.style}`}

                                          >

                                            {dStatus.state}

                                          </span>

                                        </div>

                                      );

                                    }

                                  )}

                                </div>

                              </div>

                            </div>

                          );

                        })}

                      </div>



                      {/* MILESTONES */}

                      <div

                        className={`flex items-center gap-3 cursor-pointer text-2xl font-bold mt-8 mb-6 transition ${

                          openMilestones

                            ? "text-blue-600"

                            : "text-gray-800 hover:text-blue-600"

                        }`}

                        onClick={() =>

                          setOpenMilestones(!openMilestones)

                        }

                      >

                        <ChevronDown

                          className={`transition-transform duration-300 ${

                            openMilestones

                              ? "rotate-180"

                              : ""

                          }`}

                        />

<span>{t("details.milestones")}</span>
                      </div>



                      <div

                        className={`transition-all duration-500 overflow-hidden ${

                          openMilestones

                            ? "max-h-[1000px] opacity-100"

                            : "max-h-0 opacity-0"

                        }`}

                      >

                        <div className="space-y-4">

                          {d.milestone?.map((milestone) => {

                            const statusObj =

                              phaseStatus(milestone.status);



                            return (

                              <div

                                key={milestone.id}

                                className="flex items-center bg-white border rounded-2xl p-5 hover:bg-gray-50 transition"

                              >

                                <div>

                                  <div className="font-bold text-lg">

                                    {milestone.name}

                                  </div>



                                  <div className="text-sm text-gray-500 mt-1">
{t("details.deadline")}: {formatDateDeadline(milestone.deadline)}

                                  </div>

                                </div>



                                <div

                                  className={`ml-auto ${statusObj.style}`}

                                >

                                  {statusObj.state}

                                </div>

                              </div>

                            );

                          })}

                        </div>

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
  </>
)}
    </div>
  );
}

export default Page;