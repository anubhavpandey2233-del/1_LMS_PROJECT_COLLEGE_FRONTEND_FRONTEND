import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { mixed, object, string } from "yup";
import { Form, Formik, useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  addCategory,
  deletCategroy,
  getCategory,
  updateCategroy,
} from "../../../redux/slice/CategorySlice";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import TextForm from "../../Component/TextForm/TextForm";
import FileUpload from "../../Component/FileUpload/FileUpload";
import { IMAGE_URL } from "../../../utility/url";

function Category() {
  const cdata = useSelector((state) => state.category);
  console.log(cdata.category);

  const [open, setOpen] = React.useState();
  const [allCat, setAllCat] = useState([]);
  const [updateData, setUpadateData] = useState();
  console.log("update:", updateData);

  const dispatch = useDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const CategroySchema = object({
    name: string().required(),
    desciption: string().required(),
    category_img: mixed().required(),
    // .test("pfp", "File Must be have a png, jpg and jpeg", function (value) {
    //   console.log("imgval", value);
    //   if(typeof value?.url === 'string'){
    //     return true;
    //   }

    //   const supFiles = ["image/jpeg", "image/jpg", "image/png"];

    //   return supFiles.includes(value?.type?.toLowerCase());
    // })
    // .test("pfp", "File Must be have less than 2 MB", function (value) {
    //   console.log(value);

    //   if(typeof value?.url === 'string'){
    //     return true;
    //   }

    //   return value.size <= 2 * 1024 * 1024;
    // }),
  });

  useEffect(() => {
    dispatch(getCategory());
  }, []);

  let catData = [
    {
      value: null,
      label: "Select Category",
    },
  ];

  useEffect(() => {
    cdata.category?.map((v) => {
      catData.push({ value: v?._id, label: v?.name });
    });

    setAllCat(catData);

    console.log(catData);
  }, [cdata.category]);

  const handledit = (data) => {
    console.log(data);
    handleClickOpen();
    setUpadateData(data);
  };

  const handledelet = (_id) => {
    console.log(_id);

    dispatch(deletCategroy(_id));
  };

  const columns = [
    { field: "name", headerName: "Name", width: 130 },
    { field: "desciption", headerName: "Description", width: 130 },
    {
      field: "parent_id",
      headerName: "parentCategory",
      width: 130,
      renderCell: (params) => {
        const categoryObj = cdata.category?.find(
          (v) => v._id === params.row.parent_id,
        );

        return categoryObj ? categoryObj.name : "null";
      },
    },
    {
      field: "category_img",
      headerName: "Image",
      width: 130,
      renderCell: (params) => (
        // <img src={IMAGE_URL + params.row.category_img} width={'50px'} height={'50px'} />
        <img
          src={params?.row?.category_img[0]?.url}
          width={"50px"}
          height={"50px"}
        />
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 130,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => handledit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handledelet(params.row._id)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  console.log(cdata);

  return (
    <React.Fragment>
    <h2>Categroy</h2>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Categroy
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Categroy</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={
              updateData
                ? updateData
                : {
                    name: "",
                    desciption: "",
                    category_img: "",
                  }
            }
            validationSchema={CategroySchema}
            onSubmit={(values) => {
              console.log("valuessss", values);
              {
                updateData
                  ? dispatch(updateCategroy(values))
                  : dispatch(addCategory(values));
              }

              handleClose();
            }}
          >
            <Form id="subscription-form">
              <TextForm
                id="parent_id"
                name="parent_id"
                label="Select Category"
                select
                slotProps={{
                  select: {
                    native: true,
                  },
                }}
                data={allCat}
              />

              <TextForm id="name" name="name" label="Category Name" />

              <TextForm id="desciption" name="desciption" label="Description" />

              <FileUpload name="category_img" />
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

      {/* display */}
      <DataGrid
        rows={cdata.category}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
        getRowId={(row) => row?._id}
      />
    </React.Fragment>
  );
}

export default Category;
