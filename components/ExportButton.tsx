import axios from "axios";
import { saveAs } from "file-saver";

const ExportButton = () => {
  const handleDownload = async () => {
    try {
      const response = await axios.get("/api/export", { responseType: "blob" });

      // Trigger file download
      saveAs(response.data, "database_export.xlsx");
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
    >
      Download Database as Excel
    </button>
  );
};

export default ExportButton;
