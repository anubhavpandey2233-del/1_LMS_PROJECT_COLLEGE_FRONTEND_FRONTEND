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
import {
  useAddquizMutation,
  useDeletequizMutation,
  useGetquizQuery,
  useUpdatequizMutation,
} from "../../../redux/Api/quiz.api";
import { NavLink, useParams } from "react-router-dom";
import { useGetquizContentQuery } from "../../../redux/Api/quizContent.api";

function Quiz(props) {
  const [open, setOpen] = useState(false);
  const [updatedata, setUpdateData] = useState({});
  const [courseId, setCourseId] = useState("");
  const param = useParams();
  console.log("1234567898765432", courseId);

  const { data: course } = useGetallcourseQuery(); //get Data
  console.log("course", course);

  const { data: section } = useGetAllSectionQuery();
  console.log("section", section);

  const { data: quiz } = useGetquizQuery();
  console.log("quiz", quiz?.data);

  const { data: quizContent } = useGetquizContentQuery();
  console.log("dataaaaaaaa", quizContent?.data);

  const [addData] = useAddquizMutation();
  const [updateData] = useUpdatequizMutation();
  const [deleteData] = useDeletequizMutation();

  const handledelete = async (id) => {
    console.log(id);
    deleteData(id);
  };

  const handleedit = (val) => {
    handleClickOpen();
    setUpdateData(val);
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
    {
      field: "mark",
      headerName: "Total Mark",
      width: 130,
      renderCell: (param) => {
        const mark = quizContent?.data.filter(
          (v) => v.quiz === param?.row?._id,
        );
        console.log("markkk", mark);

        const toatalmark = mark?.reduce((a, v) => a + v.Mark, 0);

        console.log("toalaaa", toatalmark);

        return toatalmark || null
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
    {
      headerName: "Quiz Content",
      width: 150,
      renderCell: (param) => (
        <div>
          <button style={{ border: "none", background: "none" }}>
            <NavLink
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "105px",
                height: "40px",
                marginTop: "4px",
                textDecoration: "none",
                backgroundColor: "rgb(211, 214, 208)",
                color: "#000",
                fontSize: "14px",
                fontFamily: "sans-serif",
                borderRadius: "5px",
              }}
              to={`/admin/quiz-content/${param.row._id}`}
            >
              Add Questions
            </NavLink>
          </button>
        </div>
      ),
    },
  ];

  let quizschema = object({
    // course_id: string().required(),
    // section_id: string().required(),
    // name: string().required()
  });

  return (
    <>
      <h1>Quiz</h1>
      <React.Fragment>
        <Button variant="outlined" onClick={handleClickOpen}>
          Add Quiz
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add Quiz</DialogTitle>
          <DialogContent>
            <Formik
              initialValues={
                Object.keys(updatedata).length > 0
                  ? updatedata
                  : {
                      course_id: "",
                      section_id: "",
                      name: "",
                      mark: null,
                    }
              }
              enableReinitialize
              validationSchema={quizschema}
              onSubmit={(values, { resetForm }) => {
                console.log("valuesssssssss", values);
                if (Object.keys(updatedata).length > 0) {
                  updateData({ ...values, _id: updatedata._id });
                  setUpdateData({});
                } else {
                  addData({ ...values, course_id: courseId });
                  setCourseId("");
                }

                resetForm();
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

                <TextForm name="name" id="name" label="Name" />
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
          rows={quiz?.data}
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

export default Quiz;
