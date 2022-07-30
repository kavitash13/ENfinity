import { useState, useEffect } from "react";
import { Row, Col, Image } from "react-bootstrap";
import axios from "axios";

function GetExistingFiles() {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:5000/get-files",
    }).then(({ data }) => {
      console.log(data);
      setData(data);
    });
  }, []);
  return (
    <>
      {data.length === 0 ? (
        "Loading ..."
      ) : (
        <Row>
          <Col>
            <ul>
              <br />
              <h1 className="text-center">Data Files</h1>
              <br />
              {data.map((file) => (
                <li>
                  <a
                    className="mt-4 fs-4"
                    style={{
                      fontFamily: "Tai Heritage Pro, serif",
                    }}
                    href={"http://localhost:5000/download/" + file._id.$oid}
                  >
                    {file.name} -{" "}
                    {file.modified_date.$date.replace("T", "  ").slice(0, -5)}
                  </a>
                </li>
              ))}
            </ul>
          </Col>
          <Col className="my-5 ml-3">
            <br />
            <br />
            <br />
            <Image src="images/files.svg" />
          </Col>
        </Row>
      )}
    </>
  );
}

export default GetExistingFiles;
