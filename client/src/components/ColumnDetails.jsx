import React from "react";
import { useState } from "react";
import {
  Card,
  ListGroupItem,
  ListGroup,
  Button,
  Row,
  Col,
} from "react-bootstrap";
import Plot from "react-plotly.js";
import { MdDelete } from "react-icons/md";

function ColumnDetails({ data, columnData, setcolumnData, selectedTarget }) {
  const [replaceNull, setReplaceNull] = useState(false);
  const [removeOutliers, setremoveOutliers] = useState(false);

  function deleteHandler() {
    setcolumnData(columnData.filter((d) => d.Column !== data.Column));
  }

  function toggleNull() {
    data.replaceNull = !replaceNull;
    setReplaceNull(!replaceNull);
  }

  function toggleremoveOutliers() {
    data.removeOutliers = !removeOutliers;
    setremoveOutliers(!removeOutliers);
  }

  return (
    <Card
      style={{ width: "18rem", display: "inline-block", whiteSpace: "normal" }}
      className="m-2"
      border={data.Column === selectedTarget ? "danger" : ""}
    >
      <Plot
        data={[
          {
            y: data.values,
            marker: {
              color: removeOutliers
                ? "rgba(219, 64, 82, 1.0)"
                : "rgb(8,81,156)",
            },
            type: "box",
          },
        ]}
        layout={{ height: 350, width: 275 }}
      />
      <Card.Body>
        <Card.Title>
          <Row style={{ justifyContent: "space-between" }}>
            <Col>{data.Column}</Col>
            <Col style={{ textAlign: "right" }}>
              <button
                className="mx-2"
                style={{
                  outline: "none",
                  border: "none",
                  backgroundColor: "transparent",
                  color: "Red",
                }}
                variant="light"
                onClick={deleteHandler}
              >
                <MdDelete
                  size="2em"
                  color="Red"
                  style={{ position: "relative", left: "20px" }}
                />
              </button>
            </Col>
          </Row>
        </Card.Title>
      </Card.Body>
      <ListGroup
        className="list-group-flush text-dark mt-4 fs-6"
        style={{ color: "#B5B5B5", fontFamily: "Tai Heritage Pro, serif" }}
      >
        {Object.entries(data).map(([key, value]) => {
          if (
            [
              "values",
              "Column",
              "replaceNull",
              "target",
              "removeOutliers",
            ].includes(key)
          )
            return "";
          return (
            <ListGroupItem
              key={key}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span>{key}</span>
              <span>{value}</span>
            </ListGroupItem>
          );
        })}
      </ListGroup>
      <Card.Body className="text-center">
        <Row>
          <Col>
            <Button
              variant={replaceNull ? "secondary" : "outline-secondary"}
              className="btn btn-block"
              title="Replace Nulls with Mean"
              onClick={toggleNull}
            >
              Replace Nulls
            </Button>
          </Col>
          <Col>
            <Button
              variant={removeOutliers ? "danger" : "outline-danger"}
              className="btn btn-block"
              onClick={toggleremoveOutliers}
            >
              Remove Outliers
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default ColumnDetails;
