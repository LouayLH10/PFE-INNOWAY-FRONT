import { api } from "../../../api/api";

export const fetchProject = async (userId: number) => {
  try {
    const res = await api.get(
      `/project/contact/${userId}`
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
     const language = localStorage.getItem("language") ;
console.log(language)
    try {
      const res = api.get(
        `/project/pdf/${id}?language=${language}`,
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