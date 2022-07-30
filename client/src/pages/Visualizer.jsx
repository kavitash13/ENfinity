import React from "react";
import { useState } from "react";
import Plot from "react-plotly.js";
import { Table, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function Visualizer() {
  let { state } = useLocation();
  let { filename } = state;

  let [postData, setPostData] = useState({});
  let [ans, setAns] = useState(null);

  if (typeof state === "string") {
    state = state.replaceAll("NaN", '"Nan"');
    state = JSON.parse(state);
  }

  function handleSubmit() {
    console.log(postData);
    axios
      .post("http://localhost:5000/predict/" + filename, postData)
      .then(({ data }) => {
        console.log(data);
        setAns(data["ans"]);
      });
  }

  return (
    <div className="text-center">
      <br />
      <h2>
        Best Model for your Dataset is : {state.m[0].Model} :
        {state.m[0].R2 ? state.m[0].R2 * 100 : state.m[0].Accuracy * 100}%
      </h2>
      <br />
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th colSpan={Object.keys(state.m[0]).length}>
              Top 5 Models for your Dataset
            </th>
          </tr>
          <tr>
            {Object.keys(state.m[0]).map((key) => (
              <th>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {state.m.map((row) => {
            return (
              <tr>
                {Object.keys(row).map((key) => (
                  <td>{row[key]}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>
      <div className="text-center">
        <Plot
          data={[
            {
              y: state.r[Object.keys(state.r)[0]],
              name: Object.keys(state.r)[0],
              marker: { color: "blue" },
            },
            {
              y: state.r[Object.keys(state.r)[1]],
              name: Object.keys(state.r)[1],
              marker: { color: "red" },
            },
          ]}
          layout={{ autosize: true }}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      <div>
        <h3>
          Predict{" "}
          {Object.keys(state.r)[0].startsWith("Predicted ")
            ? Object.keys(state.r)[0].slice("Predicted ".length)
            : Object.keys(state.r)[0]}
        </h3>
        <div>
          <Table striped border variant="dark">
            <tbody>
              {state.cols.map((colName) => (
                <tr>
                  <td>
                    <label>{colName} :&nbsp;</label>
                  </td>
                  <td>
                    <input
                      required
                      name={colName}
                      onChange={(e) => {
                        postData = { ...postData };
                        postData[colName] = e.target.value;
                        setPostData(postData);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Button type="submit" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
        {ans === null ? (
          ""
        ) : (
          <>
            <br />
            <h3>
              {Object.keys(state.r)[0].startsWith("Predicted ")
                ? Object.keys(state.r)[0].slice("Predicted ".length)
                : Object.keys(state.r)[0]}
                {" "}
              is {ans}
            </h3>
          </>
        )}
      </div>
    </div>
  );
}
