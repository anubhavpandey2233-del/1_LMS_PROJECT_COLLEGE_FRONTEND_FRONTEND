import React, { useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { useField } from "formik";
import { IMAGE_URL } from "../../../utility/url";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function FileUpload({ type, ...props }) {
  const [field, meta, helper] = useField(props);
  const [fileType, setFileType] = useState("");

  const { setValue } = helper;

  const files = Array.from(field?.value);
  console.log("filed:", files);

  // if (files.type == "video") {
  //   setFileType("video");
  // } else if (files.type == "image") {
  //   setFileType("image");
  // } else {
  //   setFileType("raw");
  // }

  console.log("filesss typesssssss", fileType);

  //  filepath = '/public/assets/images/courses/4by3/' + field.value;
  const fileArray = files?.map((v) => {
    if (v?.url) {
      return {
        url : v?.url,
        type : v?.type
      }

    } else {
      return {
        url: URL?.createObjectURL(v),
        type : v.type
      }
    }
    // if (typeof v === "string") {
    //   return (filepath = IMAGE_URL + v.name);
    // } else if (typeof v === "object" && v !== null) {
    //   console.log("123456789", v);

    //   return (filepath = URL?.createObjectURL(v));
    // }
  });

  console.log("files array", fileArray);

  return (
    <>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        {...props}
        startIcon={<CloudUploadIcon />}
      >
        Upload file
        <VisuallyHiddenInput
          type="file"
          multiple
          onChange={(event) => setValue(Array.from(event.target.files))}
        />
      </Button>

      {
        fileArray.map((v)=>{
          if(v.type == 'video' || v.type == 'video/mp4'){
              return <video src={v.url} width={"80px"} height={"50px"} />
          } else if(v.type == 'image' || v.type == 'image/png' || v.type == 'image/jpg'|| v.type == 'image/jpeg'){
            return <img src={v.url} alt="" width={"80px"} height={"50px"} />
          }else {
            return <a href={v.url} target="_blank">Open File</a>
          }
        })
      }

      {
        <p style={{ color: "red" }}>
          {meta.error && meta.touched ? meta.error : null}
        </p>
      }
    </>
  );
}

export default FileUpload;
