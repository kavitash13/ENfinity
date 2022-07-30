import React, { useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ChooseFile() {
  // react hook - managing state of the app
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [selectedSeries, setselectedSeries] = useState("");
  const [selectedDevice, setselectedDevice] = useState("XCVR");

  const navigate = useNavigate();

  //capturing event
  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("series", selectedSeries);
    if (selectedSeries === "9600") formData.append("device", selectedDevice);
    try {
      const { data } = await axios({
        method: "POST",
        url: "http://localhost:5000/upload",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(data);
      navigate("/SummaryOfColumn", { state: data });
    } catch (error) {
      console.err(error);
    }
  };

  // console.log(selectedSeries)

  return (
    <form className="text-center" onSubmit={handleSubmit}>
      <h1 className="my-5">
        ENfinity - Explore &amp; Build Machine Learning Models
      </h1>

      <label
        className="text-dark mt-4 fs-6"
        style={{ color: "#B5B5B5", fontFamily: "Tai Heritage Pro, serif" }}
      >
        Select Series
      </label>

      <Form.Select
        size="lg"
        value={selectedSeries}
        onChange={(e) => setselectedSeries(e.target.value)}
      >
        <option value="" disabled>
          Select
        </option>
        <option>9600</option>
        <option>9500</option>
        <option>9400</option>
        <option>9300</option>
        <option>9200</option>
      </Form.Select>

      <br />

      {selectedSeries === "9600" ? (
        <>
          <label
            htmlFor="series"
            className="text-dark mt-4 fs-6"
            style={{ color: "#B5B5B5", fontFamily: "Tai Heritage Pro, serif" }}
          >
            Select Device
          </label>
          <Form.Select
            value={selectedDevice}
            onChange={(e) => setselectedDevice(e.target.value)}
            size="lg"
          >
            <option>XCVR</option>
            <option>PHY</option>
            <option>MAC</option>
            <option>SERDES-LINE</option>
            <option>SERDES-HOST</option>
            <option>L2</option>
            <option>L3</option>
          </Form.Select>{" "}
          <br />
        </>
      ) : (
        ""
      )}

      <label
        htmlFor="series"
        className="text-dark mt-4 fs-6"
        style={{ color: "#B5B5B5", fontFamily: "Tai Heritage Pro, serif" }}
      >
        Select a file to show details
      </label>

      <input
        type="file"
        disabled={selectedSeries === ""}
        id="file"
        name="file"
        className="form-control mb-2"
        placeholder="Insert your Data-File"
        onChange={changeHandler}
      />

      {/* details of the file  */}
      {/* {isFilePicked ? (
        <div>
          <p>Filename: {selectedFile.name}</p>
          <p>Filetype: {selectedFile.type}</p>
          <p>Size in bytes: {selectedFile.size}</p>
          <p>
            lastModifiedDate:{" "}
            {selectedFile.lastModifiedDate.toLocaleDateString()}
          </p>
        </div>
      ) : (
        ""
      )} */}

      <Row>
        <Col className="text-center">
          <img
            src="images/upload_icon.png"
            className="my-5"
            style={{ width: "30vw" }}
            alt="Upload Icon"
          />
        </Col>
        <Col
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* <Link to="/SummaryOfColumn"> */}
          <Button variant="primary" size="lg" type="submit">
            <div
              style={{
                display: "flex",
                width: "250px",
                justifyContent: "space-around",
              }}
            >
              <div className="text-center">
                Generate <br /> &amp; <br /> Explore Data
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <i className="fa-solid fa-arrow-right"></i>
              </div>
            </div>
          </Button>
        </Col>
      </Row>
    </form>
  );
}

export default ChooseFile;
