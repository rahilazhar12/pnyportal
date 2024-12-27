import React, { useRef } from "react";
import html2pdf from "html2pdf.js";
import Modal from "../Models/Cvmodal";
import Cv1 from "./Cv1";
import Loader from "../Loader/Loader";

const CVModal = ({ isOpen, onClose, isLoading }) => {
  const cvRef = useRef();

  const downloadPdf = () => {
    const element = cvRef.current;
    html2pdf().from(element).save("CV.pdf");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Loader />
        </div>
      ) : (
        <div className="overflow-y-auto max-h-[80vh] p-4 flex flex-col">
          <div ref={cvRef}>
            <Cv1 />
          </div>
          <button
            className="mt-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600"
            onClick={downloadPdf}
          >
            Download CV
          </button>
        </div>
      )}
    </Modal>
  );
};

export default CVModal;
