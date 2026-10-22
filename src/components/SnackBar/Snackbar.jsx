import { enqueueSnackbar } from "notistack";
import React from "react";

function Snackbar(props) {

  const success = () => {
    enqueueSnackbar("User Created Successfully", {
      variant: "success",
      anchorOrigin: {
        vertical: "top",
        horizontal: "left",
      },
    });
  };

  const error = () => {
    enqueueSnackbar("User Created Successfully", {
      variant: "error",
      anchorOrigin: {
        vertical: "top",
        horizontal: "right",
      },
    });
  };

  const info = () => {
    enqueueSnackbar("User Created Successfully", {
      variant: "info",
      anchorOrigin: {
        vertical: "top",
        horizontal: "left",
      },
    });
  };

  const warning = () => {
    enqueueSnackbar("User Created Successfully", {
      variant: "warning",
      anchorOrigin: {
        vertical: "top",
        horizontal: "right",
      },
    });
  };

  return (
    <div className="container">
      <h3>Notification</h3>
      <div className="button-container">
        <button
          onClick={success}
          style={{
            backgroundColor: "#2ecc71",
            padding: "12px 30px",
            borderRadius: "8px",
            border: "none",
            color: "white",
            marginTop: "10px",
          }}
          className="button left"
        >
          Success
        </button>
        <button
          onClick={info}
          style={{
            backgroundColor: "#3498db",
            padding: "12px 30px",
            borderRadius: "8px",
            border: "none",
            color: "white",
            marginTop: "10px",
          }}
          className="button right"
        >
          Info
        </button>
        <button
          onClick={error}
          style={{
            backgroundColor: "#e74c3c",
            padding: "12px 30px",
            borderRadius: "8px",
            border: "none",
            color: "white",
            marginTop: "10px",
          }}
          className="button top"
        >
          Error
        </button>
        <button
          onClick={warning}
          style={{
            backgroundColor: "#f39c12",
            padding: "12px 30px",
            borderRadius: "8px",
            border: "none",
            color: "white",
            marginTop: "10px",
          }}
          className="button bottom"
        >
          Warning
        </button>
      </div>
    </div>
  );
}

export default Snackbar;
