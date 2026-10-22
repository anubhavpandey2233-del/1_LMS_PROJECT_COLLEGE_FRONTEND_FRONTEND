import React, { useState } from "react";
import { useDispatch } from "react-redux";
import TextForm from "../../Component/TextForm/TextForm";
import { Form, Formik } from "formik";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { date, number, object, string } from "yup";
import {
  useAddCoupanMutation,
  useDeleteCoupanMutation,
  useGetCoupanQuery,
  useUpdateCoupanMutation,
} from "../../../redux/Api/coupan.api";
import { Stack, width } from "@mui/system";
import { IconButton } from "@mui/material";

function Coupan(props) {
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState({});
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { data: coupan } = useGetCoupanQuery();
  console.log("coupan data", coupan?.data);

  const [addCoupan] = useAddCoupanMutation();
  const [updateCoupan] = useUpdateCoupanMutation();
  const [deleteCoupan] = useDeleteCoupanMutation();

  const handleDelete = async (_id) => {
    console.log(_id);
    deleteCoupan(_id)
  };

  const handleEdit = async (val) => {
    console.log("val", val);
    setUpdate({
      ...val,
      startDate: val.startDate?.split('T')[0],
      expiryDate: val.expiryDate?.split('T')[0],
    })
    handleClickOpen();
  };

  const columns = [
    { field: "code", headerName: "Code", width: 130 },
    { field: "discount", headerName: "Discount", width: 130 },
    { field: "minOrderAmount", headerName: "Minimum Order Amount", width: 130 },
    { field: "startDate", headerName: "Start Date", width: 130 },
    { field: "expiryDate", headerName: "Exiry Date", width: 130 },
    { field: "limit", headerName: "Limit", width: 130 },
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

  let coupanSchema = object({
    code: string().required(),
    discount: string().required(),
    minOrderAmount: number().required(),
    startDate: date().required(),
    expiryDate: date().required(),
    limit: number().required(),
  });

  return (
    <>
      <h1>Coupan</h1>

      <React.Fragment>
        <Button variant="outlined" onClick={handleClickOpen}>
          Add Coupon
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add Coupon Details</DialogTitle>
          <DialogContent>
            <Formik
              initialValues={
                Object.keys(update).length > 0
                  ? update
                  : {
                      code: "",
                      discount: "",
                      minOrderAmount: "",
                      startDate: "",
                      expiryDate: "",
                      limit: "",
                    }
              }
              validationSchema={coupanSchema}
              onSubmit={(values, { resetForm }) => {
                console.log("Onsubmit value", values);

                if (Object.keys(update).length > 0) {
                  updateCoupan({ ...values, _id: update._id });
                } else {
                  console.log("handleSubmit", values);
                  addCoupan(values);
                }


            
                resetForm();
                handleClose();
              }}
            >
              <Form id="subscription-form">
                <TextForm name="code" id="code" label="Code" />

                <TextForm name="discount" id="discount" label="Discount" />

                <TextForm
                  name="minOrderAmount"
                  id="minOrderAmount"
                  label="Minimum Order Amount"
                />
                <TextForm
                  name="startDate"
                  id="startDate"
                  label="Start Date"
                  type="date"
                />
                <TextForm
                  name="expiryDate"
                  id="expiryDate"
                  label="Expiry Date"
                  type="date"
                />
                <TextForm name="limit" id="limit" label="Limit" />
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
          rows={coupan?.data || []}
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

export default Coupan;
