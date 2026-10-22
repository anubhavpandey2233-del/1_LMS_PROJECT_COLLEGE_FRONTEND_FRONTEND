import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Form, Formik } from "formik";
import { object, string } from "yup";
import { DataGrid } from "@mui/x-data-grid";
import { data } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { IconButton, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TextForm from "../../Component/TextForm/TextForm";
import {
  useAddtagMutation,
  useDeletetagMutation,
  useGettagQuery,
  useUpdatetagMutation,
} from "../../../redux/Api/tag.api";

function Tag(props) {
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState({});

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { data: tag } = useGettagQuery();

  const [addtag] = useAddtagMutation();

  const [updatetag] = useUpdatetagMutation();

  const [deletetag] = useDeletetagMutation();

  const handleDelete = async (id) => {
    console.log(id);
    deletetag(id);
  };

  const handleEdit = async (val) => {
    console.log("val", val);
    handleClickOpen();
    setUpdate(val);
  };

  const columns = [
    { field: "tag", headerName: "Tag Name", width: 150 },

    {
      field: "Action",
      headerName: "Action",
      width: 130,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row._id)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  let tagschem = object({
    tag: string().required("Please Enter tag"),
  });
console.log("val", update);

  return (
    <>
      <h1>Tag</h1>

      <React.Fragment>
        <Button variant="outlined" onClick={handleClickOpen}>
          Add Tag
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add Tag Deatils</DialogTitle>
          <DialogContent>
            <Formik
              initialValues={
                Object.keys(update).length > 0
                  ? update
                  : {
                      tag: "",
                    }
              }
              validationSchema={tagschem}
              onSubmit={(values, { resetForm }) => {
                console.log(values);

                if (Object.keys(update).length > 0) {
                  updatetag({ ...values, _id: update._id });
                } else {
                  addtag(values);
                }

                handleClose();
              }}
            >
              <Form id="subscription-form">
                <TextForm name="tag" id="tag" label="Tag Name" />
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

        <DataGrid
          getRowId={(row) => row._id}
          rows={tag?.data || []}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </React.Fragment>
    </>
  );
}

export default Tag;
