import React, { useState } from "react";
import ReactQuill from "react-quill";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { MdEdit } from "react-icons/md";
import "react-quill/dist/quill.snow.css";
import useSummary from "../../hooks/useSummary";

const SummarySection = () => {
  const {
    summary,
    summaryId,
    loading,
    error,
    setSummary,
    saveSummary,
  } = useSummary();

  const [isEditing, setIsEditing] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [message , setMessage] = useState(false)

  // Wait for the initial fetch to complete
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto mt-6">
        <p>Loading summary...</p>
      </div>
    );
  }

  const handleEditClick = () => {
    setIsEditing(!isEditing);
    setEditorContent(summary || "");
  };

  const handleSave = async () => {
    const trimmedContent = editorContent.trim();
    const isEmpty = trimmedContent === "<p><br></p>" || trimmedContent === "<p></p>";

    if (isEmpty) {
     setMessage(true)
     return;
    }

    const contentToSave = trimmedContent;
    const result = await saveSummary(contentToSave);
    if (result.success) {
      setIsEditing(false);
      setSummary(contentToSave);
      alert(summaryId ? "Summary updated successfully" : "Summary saved successfully");
     setMessage(false)
    } else {
      alert(`Error: ${result.error || "Failed to save summary"}`);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const toggleShowMore = () => {
    setShowFullSummary(!showFullSummary);
  };

  // Renders summary with show-more/less logic
  const renderSummary = () => {
    if (!summary) {
      return <div className="text-base font-source-sans">
        {error && <p>{error}</p>}
      </div>;
    }

    const words = summary.split(" ");
    const wordCount = words.length;

    if (wordCount <= 50) {
      // No need to truncate
      return <div dangerouslySetInnerHTML={{ __html: summary }} />;
    }

    // Truncate logic
    if (showFullSummary) {
      return (
        <>
          <div dangerouslySetInnerHTML={{ __html: summary }} />
          <div className="flex justify-center items-center mt-4 pt-4 border-t border-gray-300">
            <button
              onClick={toggleShowMore}
              className="text-blue-500 hover:text-blue-700 flex items-center gap-2"
            >
              Show Less <AiOutlineUp />
            </button>
          </div>
        </>
      );
    } else {
      const truncated = words.slice(0, 50).join(" ");
      return (
        <>
          <div dangerouslySetInnerHTML={{ __html: truncated }} />
          <div className="flex justify-center items-center mt-4 pt-4 border-t border-gray-300">
            <button
              onClick={toggleShowMore}
              className="text-blue-500 hover:text-blue-700 flex items-center gap-2"
            >
              Show More <AiOutlineDown />
            </button>
          </div>
        </>
      );
    }
  };

  return (
    <>
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold font-source-sans">Summary</h3>
       
        

        <button onClick={handleEditClick} className="text-2xl font-bold plusround">
          {/* The icon is the same, so you might want to toggle to a different icon if editing */}
          <MdEdit className="text-center ml-1.5" />
        </button>
      </div>

      {!isEditing && (
        <div className="text-black font-source-sans text-base text-justify">
          {renderSummary()}
        </div>
      )}

      {isEditing && (
        <div className="mt-4">
          <ReactQuill
            value={editorContent}
            onChange={setEditorContent}
            theme="snow"
            className="mt-1 h-52 summary-editor"
            modules={{
              toolbar: [
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["clean"],
              ],
            }}
          />
          <div className="flex justify-end space-x-2 mt-12">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {message && <div className="text-sm mt-4 mb-4 p-4 bg-red-100 text-red-700 rounded">This field is required</div>}
    </div>
    
    </>
  );
};

export default SummarySection;
