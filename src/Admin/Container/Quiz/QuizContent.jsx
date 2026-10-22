import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Formik, Form } from "formik";
import { Button, Stack, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid } from "@mui/x-data-grid";
import TextForm from "../../Component/TextForm/TextForm";

import {
  useAddquizContentMutation,
  useDeletequizContentMutation,
  useGetquizContentQuery,
  useUpdatequizContentMutation,
} from "../../../redux/Api/quizContent.api";

function QuizContent() {
  const param = useParams();

  const [updatedata, setUpdateData] = useState({});
  const [loading, setLoading] = useState(false);

  const { data } = useGetquizContentQuery();
  console.log("dataaaaaaaa", data?.data);

  const [addData] = useAddquizContentMutation();
  const [updateData] = useUpdatequizContentMutation();
  const [deleteData] = useDeletequizContentMutation();

  const finalData =
    data?.data?.filter((v) => v.quiz?.toString() === param._id) || [];

  const handledelete = async (id) => {
    await deleteData(id);
  };

  const handleEdit = (val) => {
    setUpdateData({
      _id: val._id,
      question: val.question,
      option1: val.options?.[0] || "",
      option2: val.options?.[1] || "",
      option3: val.options?.[2] || "",
      option4: val.options?.[3] || "",
      Answer: val.Answer,
      Mark: val.Mark,
    });
  };

  const handleSubmit = async (values, resetForm) => {
    if (loading) return;
    setLoading(true);

    const payload = {
      quiz: param._id,
      question: values.question,
      options: [values.option1, values.option2, values.option3, values.option4],
      Answer: values.Answer,
      Mark: values.Mark,
    };

    try {
      if (updatedata._id) {
        await updateData({ _id: updatedata._id, ...payload });
        setUpdateData({});
      } else {
        await addData(payload);
      }

      resetForm();
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const columns = [
    { field: "question", headerName: "Question", width: 130 },
    { field: "options", headerName: "Option", width: 130 },
    { field: "Answer", headerName: "Answer", width: 130 },
    { field: "Mark", headerName: "Mark", width: 130 },
    {
      field: "action",
      headerName: "Action",
      width: 170,
      renderCell: (param) => (
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => handleEdit(param.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handledelete(param.row._id)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Quiz Questions</h2>

      <Formik
        enableReinitialize
        initialValues={
          updatedata._id
            ? updatedata
            : {
                question: "",
                option1: "",
                option2: "",
                option3: "",
                option4: "",
                Answer: "",
                Mark: "",
              }
        }
        onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}
      >
        {() => (
          <Form
            style={{
              width: "40%",
              paddingLeft: "20px",
              paddingRight: "20px",
              paddingBottom: "20px",
              paddingTop: "10px",
              border: "2px solid #ccc",
              borderRadius: "10px",
            }}
          >
            <TextForm name="question" label="Question" />

            <TextForm name="option1" label="Option 1" />
            <TextForm name="option2" label="Option 2" />
            <TextForm name="option3" label="Option 3" />
            <TextForm name="option4" label="Option 4" />

            <TextForm name="Answer" label="Answer" />

            <TextForm name="Mark" label="Mark" />
            <Stack mt={2}>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? "Saving..." : updatedata._id ? "Update" : "Save"}
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>

      <div style={{ marginTop: "30px" }}>
        <h3>Questions List</h3>

        <DataGrid
          rows={finalData}
          columns={columns}
          pageSizeOptions={[5, 10]}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 5 } },
          }}
          getRowId={(row) => row._id}
          autoHeight
        />
      </div>
    </div>
  );
}

export default QuizContent;
