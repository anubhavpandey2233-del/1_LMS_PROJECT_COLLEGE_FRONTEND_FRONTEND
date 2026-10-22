
import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Form, Formik } from "formik";
import { object, string } from "yup";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TextForm from "../../Component/TextForm/TextForm";
import { useGetallcourseQuery } from "../../../redux/Api/Course.api";
import {
  useAddSectionMutation,
  useDeleteSectionMutation,
  useGetAllSectionQuery,
  useUpdateSectionMutation,
} from "../../../redux/Api/Section.api";

function Section() {
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState({});
  const [submitError, setSubmitError] = useState("");

  const {
    data: courseData,
  } = useGetallcourseQuery();

  const {
    data: sectionData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllSectionQuery();

  console.log("SECTION LIST RESPONSE:", sectionData);
console.log("SECTION ROWS:", sectionData?.data);

  const [addSection, { isLoading: adding }] = useAddSectionMutation();
  const [updateSection, { isLoading: updating }] = useUpdateSectionMutation();
  const [deleteSection] = useDeleteSectionMutation();

  const DropData = [
    { value: "", label: "--Select Course--" },
    ...(courseData?.data || []).map((v) => ({
      value: v._id,
      label: v.name,
    })),
  ];

  const handleClickOpen = () => {
    setUpdate({});
    setSubmitError("");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setUpdate({});
    setSubmitError("");
  };

  const handleDelete = async (id) => {
    try {
      await deleteSection(id).unwrap();
      await refetch();
      console.log("Section deleted successfully");
    } catch (err) {
      console.error("Section delete error:", err);
      alert(
        err?.data?.Message ||
        err?.data?.message ||
        "Section delete failed"
      );
    }
  };

  const handleEdit = (val) => {
    setUpdate(val);
    setSubmitError("");
    setOpen(true);
  };

  const columns = [
    {
      field: "course_id",
      headerName: "Course",
      width: 180,
      renderCell: (params) => {
        const courseId =
          typeof params.row.course_id === "object"
            ? params.row.course_id?._id
            : params.row.course_id;

        const courseObj = courseData?.data?.find(
          (v) => v._id === courseId
        );

        return courseObj?.name || "Course not found";
      },
    },
    {
      field: "name",
      headerName: "Name",
      width: 180,
    },
    {
      field: "desciption",
      headerName: "Description",
      width: 300,
    },
    {
      field: "Action",
      headerName: "Action",
      width: 130,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            onClick={() => handleEdit(params.row)}
            aria-label="Edit section"
          >
            <EditIcon />
          </IconButton>

          <IconButton
            onClick={() => handleDelete(params.row._id)}
            aria-label="Delete section"
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  const userSchema = object({
    course_id: string().required("Please select a course"),
    name: string().required("Please enter name"),
    desciption: string().required("Please enter description"),
  });

  const initialValues = {
    course_id: update.course_id
      ? typeof update.course_id === "object"
        ? update.course_id._id || ""
        : update.course_id
      : "",
    name: update.name || "",
    desciption: update.desciption || "",
  };

  const handleSubmit = async (values, { resetForm }) => {
    setSubmitError("");

    console.log("Section form submitted:", values);

    try {
      let result;

      if (update._id) {
        result = await updateSection({
          ...values,
          _id: update._id,
        }).unwrap();

        console.log("Section updated successfully:", result);
      } else {
        result = await addSection(values).unwrap();

        console.log("Section added successfully:", result);
      }

      await refetch();

      resetForm();
      handleClose();

      console.log("Latest section data:", result);
    } catch (err) {
      console.error("Section submit error:", err);

      setSubmitError(
        err?.data?.Message ||
        err?.data?.message ||
        err?.data?.error ||
        err?.error ||
        "Section could not be saved. Please check the Network tab."
      );
    }
  };

  return (
    <>
      <h1>Section</h1>

      <Button variant="outlined" onClick={handleClickOpen}>
        Add Section
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {update._id ? "Update Section Details" : "Add Section Details"}
        </DialogTitle>

        <DialogContent>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={userSchema}
            onSubmit={handleSubmit}
          >
            <Form id="subscription-form">
              <TextForm
                name="course_id"
                id="course_id"
                select
                label="Select Course"
                style={{ margin: 0, padding: 0 }}
                slotProps={{
                  select: {
                    native: true,
                  },
                }}
                data={DropData}
              />

              <TextForm
                name="name"
                id="name"
                label="Name"
              />

              <TextForm
                name="desciption"
                id="desciption"
                label="Description"
              />

              {submitError && (
                <p style={{ color: "red", marginTop: 12 }}>
                  {submitError}
                </p>
              )}
            </Form>
          </Formik>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>
            Cancel
          </Button>

          <Button
            type="submit"
            form="subscription-form"
            disabled={adding || updating}
          >
            {adding || updating ? "Saving..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      <DataGrid
        getRowId={(row) => row._id}
        rows={sectionData?.data || []}
        columns={columns}
        loading={isLoading || isFetching}
        initialState={{
          pagination: {
            paginationModel: {
              page: 0,
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </>
  );
}

export default Section;
