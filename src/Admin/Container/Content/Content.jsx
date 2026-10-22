import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from "@mui/material";
import { object, string } from "yup";
import { Form, Formik } from "formik";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useGetallcourseQuery } from "../../../redux/Api/Course.api";
import { useGetAllSectionQuery } from "../../../redux/Api/Section.api";
import TextForm from "../../Component/TextForm/TextForm";
import { NavLink, useParams } from "react-router-dom";
import FileUpload from "../../Component/FileUpload/FileUpload";
import {
  useAddcontentMutation,
  useDeletecontentMutation,
  useGetcontentQuery,
  useUpdatecontentMutation,
} from "../../../redux/Api/Content.api";
import RadioButton from "../../Component/RadioButton/RadioButton";

function Content(props) {
  const [open, setOpen] = useState(false);
  const [updatedata, setUpdateData] = useState("");
  const [courseId, setCourseId] = useState("");
  const param = useParams();

  const { data: course } = useGetallcourseQuery(); //get Data

  const { data: section } = useGetAllSectionQuery();

  const { data: content } = useGetcontentQuery();

  const [addContent] = useAddcontentMutation();
  const [updateContent] = useUpdatecontentMutation();
  const [deleteContent] = useDeletecontentMutation();

  const handledelete = async (id) => {
    console.log(id);
    deleteContent(id);
  };

  const handleedit = (val) => {
    handleClickOpen();
    setUpdateData(val);
    setCourseId(val.course_id);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const catdrop = [{ value: "", label: "---Select Course--" }];
  course?.data?.map((v) => catdrop.push({ value: v._id, label: v.name }));

  const secdrop = [{ value: "", label: "---Select Section--" }];
  let sectionData = section?.data.filter((v) => v.course_id === courseId);
  sectionData?.map((v) => secdrop.push({ value: v._id, label: v.name }));

  console.log("catdrop", catdrop);
  console.log("secdrop", secdrop);

  const paginationModel = { pae: 0, pageSize: 5 };

  const columns = [
    {
      field: "course_id",
      headerName: "Course",
      width: 130,
      renderCell: (param) => {
        const c = course?.data?.find((v) => v._id === param.row.course_id);
        return c?.name;
      },
    },
    {
      field: "section_id",
      headerName: "Section",
      width: 130,
      renderCell: (param) => {
        const sec = section?.data?.find((v) => v._id == param?.row?.section_id);

        return sec?.name;
      },
    },
    { field: "name", headerName: "Name", width: 130 },
    { field: "order", headerName: "Order", width: 130 },
    { field: "type", headerName: "Type", width: 130 },
    {
      field: "content_file",
      headerName: "File",
      width: 130,
      renderCell: (params) => {
        return (
          <>
            {params?.row?.content_file?.map((v) => {
              if (v.type === "video") {
                return (
                  <video src={v.url} controls width={"118px"} height={"60px"} />
                );
              } else if (v.type === "image") {
                return (
                  <img src={v.url} alt="" width={"80px"} height={"50px"} />
                );
              } else {
                return (
                  <a href={v.url} target="_blank">
                    Open File
                  </a>
                );
              }
            })}
          </>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 170,
      renderCell: (param) => (
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => handleedit(param.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handledelete(param.row._id)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  let contentSchema = object({
    // course_id: string().required(),
    // section_id: string().required(),
    // name: string().required()
  });

  const dataType = [
    { value: "free", label: "Free" },
    { value: "paid", label: "Paid" },
  ];

  return (
    <>
      <h1>Content</h1>
      <React.Fragment>
        <Button variant="outlined" onClick={handleClickOpen}>
          Add Content
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add Content</DialogTitle>
          <DialogContent>
            <Formik
              initialValues={
                Object.keys(updatedata).length > 0
                  ? updatedata
                  : {
                      course_id: "",
                      section_id: "",
                      name: "",
                      order: "",
                      content_file: "",
                      type: "",
                      mark: null,
                    }
              }
              enableReinitialize
              validationSchema={contentSchema}
              onSubmit={(values, { resetForm }) => {
                console.log("valuesssssssss", values);

                const formData = new FormData();
                formData.append("course_id", courseId);
                formData.append("section_id", values.section_id);
                formData.append("name", values.name);
                formData.append("order", values.order);
                formData.append("type", values.type);

                const content_file = values.content_file.forEach((v) => {
                  if (v instanceof File) {
                    formData.append("content_file", v);
                  } else {
                    formData.append("content_file", v.url);
                  }
                });
                console.log("formdataaaa", Object.fromEntries(formData));

                {
                  if (Object.keys(updatedata).length > 0) {
                    formData.append("_id", updatedata._id);

                    updateContent(formData);
                    setUpdateData("");
                  } else {
                    addContent(formData);
                    setCourseId("");
                  }
                }
                handleClose();
              }}
            >
              <Form id="subscription-form">
                <TextForm
                  select
                  slotProps={{
                    select: {
                      native: true,
                    },
                  }}
                  name="course_id"
                  data={catdrop}
                  label="course"
                  value={courseId}
                  onChange={(e) => {
                    setCourseId(e.target.value);
                    formik.setFieldValue("course_id", e.target.value);
                  }}
                />
                <TextForm
                  select
                  slotProps={{
                    select: {
                      native: true,
                    },
                  }}
                  name="section_id"
                  data={secdrop}
                  label="section"
                />
                <TextForm name="name" id="name" label="Enter Name" />
                <TextForm name="order" id="order" label="Enter Order" />
                <label htmlFor="">Enter Contetn Type</label>
                <RadioButton name="type" id="type" data={dataType} /> <br />
                <FileUpload name="content_file" />
              </Form>
            </Formik>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" form="subscription-form">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
        <br />
        <br />
        <DataGrid
          rows={content?.data}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
          getRowId={(row) => (row ? row._id : "")}
        />
      </React.Fragment>
    </>
  );
}

export default Content;
