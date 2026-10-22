import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetalert } from "../../redux/slice/alert.slice";

function Alert(props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const alert = useSelector((state) => state.alert);

  console.log(alert);
  const dispatch = useDispatch();

  useEffect(() => {
    if (alert.text !== "") {
      console.log(alert.text);

      enqueueSnackbar(alert.text, {
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
        variant: alert.variant,
      });

      dispatch(resetalert());
    }
  }, [alert.text]);

  return <></>;
}

export default Alert;
