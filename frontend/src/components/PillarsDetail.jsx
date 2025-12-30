import React from "react";
import { useParams } from "react-router-dom";

const PillarsDetail = () => {
  const { pillarId } = useParams(); 

  return (
    <div className="container py-4">
      <h2>Pillars Detail Page</h2>

      <div className="accordion" id="pillarAccordion">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className={`accordion-button ${
                pillarId === "1" ? "" : "collapsed"
              }`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#pillar1"
            >
              Pillar One
            </button>
          </h2>
          <div
            id="pillar1"
            className={`accordion-collapse collapse ${
              pillarId === "1" ? "show" : ""
            }`}
            data-bs-parent="#pillarAccordion"
          >
            <div className="accordion-body">
              Detail of Pillar One
            </div>
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className={`accordion-button ${
                pillarId === "2" ? "" : "collapsed"
              }`}
              data-bs-toggle="collapse"
              data-bs-target="#pillar2"
            >
              Pillar Two
            </button>
          </h2>
          <div
            id="pillar2"
            className={`accordion-collapse collapse ${
              pillarId === "2" ? "show" : ""
            }`}
            data-bs-parent="#pillarAccordion"
          >
            <div className="accordion-body">
              Detail of Pillar Two
            </div>
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className={`accordion-button ${
                pillarId === "3" ? "" : "collapsed"
              }`}
              data-bs-toggle="collapse"
              data-bs-target="#pillar3"
            >
              Pillar Three
            </button>
          </h2>
          <div
            id="pillar3"
            className={`accordion-collapse collapse ${
              pillarId === "3" ? "show" : ""
            }`}
            data-bs-parent="#pillarAccordion"
          >
            <div className="accordion-body">
              Detail of Pillar Three
            </div>
          </div>
        </div>

        {/* Pillar 4 */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className={`accordion-button ${
                pillarId === "4" ? "" : "collapsed"
              }`}
              data-bs-toggle="collapse"
              data-bs-target="#pillar4"
            >
              Pillar Four
            </button>
          </h2>
          <div
            id="pillar4"
            className={`accordion-collapse collapse ${
              pillarId === "4" ? "show" : ""
            }`}
            data-bs-parent="#pillarAccordion"
          >
            <div className="accordion-body">
              Detail of Pillar Four
            </div>
          </div>
        </div>

        {/* Pillar 5 */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className={`accordion-button ${
                pillarId === "5" ? "" : "collapsed"
              }`}
              data-bs-toggle="collapse"
              data-bs-target="#pillar5"
            >
              Pillar Five
            </button>
          </h2>
          <div
            id="pillar5"
            className={`accordion-collapse collapse ${
              pillarId === "5" ? "show" : ""
            }`}
            data-bs-parent="#pillarAccordion"
          >
            <div className="accordion-body">
              Detail of Pillar Five
            </div>
          </div>
        </div>

        {/* Pillar 6 */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className={`accordion-button ${
                pillarId === "6" ? "" : "collapsed"
              }`}
              data-bs-toggle="collapse"
              data-bs-target="#pillar6"
            >
              Pillar Six
            </button>
          </h2>
          <div
            id="pillar6"
            className={`accordion-collapse collapse ${
              pillarId === "6" ? "show" : ""
            }`}
            data-bs-parent="#pillarAccordion"
          >
            <div className="accordion-body">
              Detail of Pillar Six
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PillarsDetail;
