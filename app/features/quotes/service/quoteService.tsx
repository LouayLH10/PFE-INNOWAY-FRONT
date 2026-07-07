import { api } from "../../../api/api";

export const fetchQuote = async (userId: number) => {
  try {
    const res = await api.get(
      `/quote/contact/${userId}`
    );

    console.log(res.data); // debug

    // ✅ garantir un tableau
    const data = Array.isArray(res.data)
      ? res.data
      : [res.data];

    return data;
  } catch (error) {
    console.error("Erreur fetch quotes:", error);
    return [];
  }
};
export const downloadQuote =async(id:number)=>{
     const language = localStorage.getItem("language") ;
console.log(language)
    try {
      const res = api.get(
        `/quote/pdf/${id}?language=${language}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([(await res).data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `quotes-${id}.pdf`);
      document.body.appendChild(link);

      link.click();
      link.remove();
    } catch (error) {
      console.error("Erreur téléchargement PDF:", error);
    }

}