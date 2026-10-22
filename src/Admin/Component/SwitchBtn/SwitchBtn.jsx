import React from "react";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import Switch from "@mui/material/Switch";
import { useField } from "formik";

function SwitchBtn({ display, ...props }) {
  // const [field, meta] = useField(props)

  const [checked, setChecked] = React.useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
      <div>
          <FormControl component="fieldset" variant="standard">

              <FormGroup>

                  <FormControlLabel
                      control={
                          <Switch
                              {...field}
                              checked={field.value}

                          />
                      }
                      label={display}
                  />

              </FormGroup>
              {
                  meta.error && meta.touched ?
                      <FormHelperText style={{ color: 'red' }}>{meta.error}</FormHelperText>
                      : null
              }

          </FormControl>

      </div>
  );
}

export default SwitchBtn;
