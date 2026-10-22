import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import { useField } from 'formik';
import React from 'react';

function Checkboxbtn({ hobby, label, ...props }) {
    const [field, meta, helper] = useField(props)
    const { setValue } = helper;


    const handleChange = (val) => {
        // console.log(val, field.value);


        if (field.value.includes(val)) {
            const x = field.value.filter(v => v !== val);
            console.log(x);

            setValue(x);

        } else {
            setValue([...field.value, val])
        }

    }


    return (
        <>
            <FormControl
                required
                error={meta.error && meta.touched}

                variant="standard"
            >
                  <FormLabel id="demo-radio-buttons-group-label">{label}</FormLabel>
                <FormGroup>
                    {hobby.map((d) => (
                        <FormControlLabel

                            control={
                                <Checkbox checked={field.value?.includes(d.label)} 
                                onChange={() => handleChange(d.label)} />
                            }
                            label={d.label}
                        />
                    ))

                    }


                </FormGroup>
                {
                    meta.error && meta.touched ?
                          <FormHelperText>{ meta.error }</FormHelperText>
                       : null
                }
              
            </FormControl>

        </>
    );
}

export default Checkboxbtn;