import React, { useEffect, useState } from "react";
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
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CheackAuth } from "../../../redux/slice/auth.slice";
import {
  useAddBlogMutation,
  useDeleteBlogMutation,
  useGetBlogQuery,
  useUpdateBlogMutation,
} from "../../../redux/Api/blog.api";
import TextForm from "../../Component/TextForm/TextForm";
import FileUpload from "../../Component/FileUpload/FileUpload";
import TextEditor from "../../Component/RichTextEditor/TextEditor";
import { useGettagQuery } from "../../../redux/Api/tag.api";

function Blog(props) {
  const [open, setOpen] = useState(false);
  const [updatedata, setUpdateData] = useState({});

  const dispatch = useDispatch();

  const display = () => {
    dispatch(CheackAuth());
  };

  const { data: blog } = useGetBlogQuery();
  console.log(blog);

  let blogData = blog?.data;

  const [addData] = useAddBlogMutation();

  const [updateData] = useUpdateBlogMutation();

  const [deleteData] = useDeleteBlogMutation();

  const { data: tag } = useGettagQuery();

  const DropData = [{ value: "", label: "--Select Tag--" }];

  tag?.data?.filter((v) => {
    DropData.push({ value: v._id, label: v.tag });
  });

  console.log(DropData);

  useEffect(() => {
    display();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const auth = useSelector((state) => state.auth);
  console.log("checklogin", auth?.user?.data);

  const handleClose = () => {
    setOpen(false);
  };

  const handledelete = async (id) => {
    deleteData(id);
  };

  const handleedit = (val) => {
    handleClickOpen();
    setUpdateData(val);
  };

  const paginationModel = { page: 0, pageSize: 5 };

  const columns = [
    { field: "tag", headerName: "tag", width: 130 },

    { field: "title", headerName: "Title", width: 130 },
    { field: "description", headerName: "description", width: 200 },
    { field: "content", headerName: "content", width: 200 },
    { field: "instructor", headerName: "Instructor", width: 130 },
    {
      field: "content_file",
      headerName: "File",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            {params?.row?.content_file?.map((v) => (
              <img src={v.url} alt="" width={"80px"} height={"50px"} />
            ))}
          </>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (parem) => (
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => handledelete(parem.row._id)}>
            <DeleteIcon style={{ color: "red" }} />
          </IconButton>
          <IconButton onClick={() => handleedit(parem.row)}>
            <EditIcon style={{ color: "orange" }} />
          </IconButton>
        </Stack>
      ),
    },
  ];

  let BlogSchema = object({
    title: string().required("name field is required"),
  });

  const handlesubmit = async (val) => {
    console.log("submit", val);
    console.log("updatedata:", updatedata);

    let formData = new FormData();
    formData.append("tag", val.tag);
    formData.append("title", val.title);
    formData.append("description", val.description);
    formData.append("content", val.content);

    val.content_file.forEach((v) => {
      if (v instanceof File) {
        formData.append("content_file", v);
      } else {
        formData.append("content_file", v.url);
      }
    });

    formData.append("instructor", auth?.user?.data?._id);

    if (Object.keys(updatedata).length > 0) {
      formData.append("_id", updatedata._id);

      updateData(formData);
      setUpdateData({});
    } else {
      addData(formData);
    }
  };

  return (
    <>
      <h1>Blog</h1>
      <React.Fragment>
        <Button variant="outlined" onClick={handleClickOpen}>
          Add Blog
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add Blog</DialogTitle>
          <DialogContent>
            <Formik
              initialValues={
                Object.keys(updatedata).length > 0
                  ? updatedata
                  : {
                      tag: "",
                      title: "",
                      description: "",
                      date: "",
                      instructor: null,
                      content: "",
                      content_file: [],
                    }
              }
              enableReinitialize
              validationSchema={BlogSchema}
              onSubmit={(values, { resetForm }) => {
                console.log(values);
                handlesubmit(values);

                resetForm();
                handleClose();
              }}
            >
              <Form id="subscription-form">
                <TextForm
                  name="tag"
                  id="tag"
                  select
                  label="Select Tag"
                  style={{ margin: "0", padding: "0" }}
                  slotProps={{
                    select: {
                      native: true,
                    },
                  }}
                  data={DropData}
                />
                <TextForm name="title" id="title" label="Title" />
                <TextForm
                  name="description"
                  id="description"
                  label="Description"
                  multiline
                  rows={5}
                />
                <TextEditor name="content" id="content" label="content" />

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
          rows={blogData}
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

export default Blog;
