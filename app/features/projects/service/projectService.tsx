import { api } from "../../../api/api";

export const fetchProject = async (userId: number) => {
  try {
    const res = await api.get(
      `http://localhost:3200/project/contact/${userId}`
    );

    console.log(res.data); // debug

    // ✅ garantir un tableau
    const data = Array.isArray(res.data)
      ? res.data
      : [res.data];

    return data;
  } catch (error) {
    console.error("Erreur fetch projects:", error);
    return [];
  }
};
export const downloadProject =async(id:number)=>{
  
    try {
      const res = api.get(
        `http://localhost:3200/project/pdf/${id}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([(await res).data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `projects-${id}.pdf`);
      document.body.appendChild(link);

      link.click();
      link.remove();
    } catch (error) {
      console.error("Erreur téléchargement PDF:", error);
    }

}