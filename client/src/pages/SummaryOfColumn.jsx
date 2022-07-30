import React from "react";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import ColumnDetails from "../components/ColumnDetails";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function SummaryOfColumn() {
  const { state } = useLocation();
  const { filename } = state;
  const navigate = useNavigate();

  const [columnData, setcolumnData] = useState([]);
  const [selectedTarget, setselectedTarget] = useState("");
  const [sentPostData, setsentPostData] = useState(false);

  let postData = [];
  // route -> /train/filename
  // [
  //    { column, replaceNull: true, removeOutlier: true, target: true}
  // ]

  function createPostData() {
    postData = columnData.map(({ Column, replaceNull, removeOutliers }) => {
      if (!replaceNull) replaceNull = false;
      if (!removeOutliers) removeOutliers = false;

      const returnValue = { Column, replaceNull, removeOutliers };
      if (Column === selectedTarget) returnValue.target = true;
      return returnValue;
    });
  }

  function trainingHandler() {
    createPostData();
    console.log(postData);
    setsentPostData(true);
    axios
      .post("http://localhost:5000/train/" + filename, postData)
      .then(function ({ data }) {
        console.log(data);
        data["filename"] = filename;
        navigate("/visualizer", { state: data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  useEffect(() => {
    axios.get("http://localhost:5000/summary/" + filename).then(({ data }) => {
      setcolumnData(data);
    });
  }, []);

  return (
    <>
      {sentPostData ? (
        <div
          className="text-center text-dark fs-2"
          style={{ color: "#B5B5B5", fontFamily: "Tai Heritage Pro, serif" }}
        >
          <br />
          <br />
          <br />
          <br />
          <br />
          Your Model is being Trained
          <br />
          Kindly Wait !!
        </div>
      ) : columnData.length !== 0 ? (
        <div>
          <h1 className="text-center mt-3">Summary of the Dataset :</h1>
          <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
            {columnData.map((data) => (
              <ColumnDetails
                selectedTarget={selectedTarget}
                setcolumnData={setcolumnData}
                columnData={columnData}
                key={data.Column}
                data={data}
              />
            ))}
          </div>
          {/* <br /> */}
          <Form.Select
            size="lg"
            value={selectedTarget}
            onChange={(e) => setselectedTarget(e.target.value)}
          >
            <option value="" disabled>
              Select Target Column to Train
            </option>
            {columnData.map((data) => (
              <option key={data.Column}>{data.Column}</option>
            ))}
          </Form.Select>
          {selectedTarget === "" ? (
            <br />
          ) : (
            <div className="d-grid gap-2 my-5">
              <Button variant="outline-primary" onClick={trainingHandler}>
                Train Your Model
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div
          className="text-center text-dark fs-2"
          style={{ color: "#B5B5B5", fontFamily: "Tai Heritage Pro, serif" }}
        >
          <br />
          <br />
          <br />
          <br />
          <br />
          Loading Summary !
          <br />
          Just a While ...
        </div>
      )}
    </>
  );
}

export default SummaryOfColumn;
