
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { mixed, number, object, string } from "yup";
import { Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { getCategory } from "../../../redux/slice/CategorySlice";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import TextForm from "../../Component/TextForm/TextForm";
import FileUpload from "../../Component/FileUpload/FileUpload";
import {
  useAddCourseMutation,
  useDeletCourseMutation,
  useGetallcourseQuery,
  useUpdateCourseMutation,
} from "../../../redux/Api/Course.api";
import Switch from "@mui/material/Switch";
import { CheackAuth } from "../../../redux/slice/auth.slice";

function Course() {
  const cdata = useSelector((state) => state.category);
  const userData = useSelector((state) => state.auth);

  const { data, isLoading } = useGetallcourseQuery();

  const [addCourse] = useAddCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const [deletCourse] = useDeletCourseMutation();

  const [open, setOpen] = useState(false);
  const [allCat, setAllCat] = useState([]);
  const [updateData, setUpadateData] = useState(null);

  const dispatch = useDispatch();

  const handleClickOpen = () => {
    setUpadateData(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setUpadateData(null);
  };

  const courseSchema = object({
    categories_id: string().required("Course category is required"),
    name: string().required("Course name is required"),
    desciption: string().required("Description is required"),
    fees: number().required("Fees are required"),
    duration: string().required("Duration is required"),
    course_img: mixed().required("Course image is required"),
  });

  useEffect(() => {
    dispatch(getCategory());
    dispatch(CheackAuth());
  }, [dispatch]);

  useEffect(() => {
    const catData = [
      {
        value: "",
        label: "--Select Category--",
      },
    ];

    cdata.category?.forEach((v) => {
      catData.push({
        value: v._id,
        label: v.name,
      });
    });

    setAllCat(catData);
  }, [cdata.category]);

  const handledit = (course) => {
    setUpadateData(course);
    setOpen(true);
  };

  const handledelet = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    try {
      await deletCourse(_id).unwrap();
    } catch (error) {
      console.error("Delete course error:", error);
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 130,
    },
    {
      field: "desciption",
      headerName: "Description",
      width: 150,
    },
    {
      field: "fees",
      headerName: "Fees",
      width: 100,
    },
    {
      field: "duration",
      headerName: "Duration",
      width: 100,
    },
    {
      field: "intrucotor_id",
      headerName: "Instructor Name",
      width: 150,
      valueGetter: (value, row) => {
        return row?.intrucotor_id?.name || "N/A";
      },
    },
    {
      field: "course_img",
      headerName: "Image",
      width: 180,
      renderCell: (params) => (
        <div style={{ display: "flex", gap: "5px" }}>
          {params?.row?.course_img?.map((v, index) => (
            <img
              key={v?.public_id || `${params.row._id}-${index}`}
              src={v?.url}
              width="50px"
              height="50px"
              alt={params.row.name || "Course image"}
              style={{
                objectFit: "cover",
                borderRadius: "5px",
              }}
            />
          ))}
        </div>
      ),
    },

    // Preview URL intentionally kept commented
    // {
    //   field: "perview_url",
    //   headerName: "Preview URL",
    //   width: 120,
    // },

    {
      field: "status",
      headerName: "Status",
      width: 110,
      renderCell: (params) => (
        <Switch
          id={`status-${params.row._id}`}
          checked={params.row?.is_active ?? false}
          onChange={() => handleSetStauts(params.row)}
          slotProps={{
            input: {
              "aria-label": "controlled",
            },
          }}
        />
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 110,
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

  const handleSetStauts = (course) => {
    console.log("Status data:", course);
    setUpadateData(course);
  };

  const paginationModel = {
    page: 0,
    pageSize: 5,
  };

  return (
    <React.Fragment>
      <h2>Course</h2>

      <Button variant="outlined" onClick={handleClickOpen}>
        Add Course
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {updateData ? "Edit Course" : "Add Course"}
        </DialogTitle>

        <DialogContent>
          <Formik
            enableReinitialize
            initialValues={
              updateData
                ? {
                    ...updateData,
                    categories_id:
                      updateData.categories_id?._id ||
                      updateData.categories_id ||
                      "",
                    course_img: updateData.course_img || [],
                  }
                : {
                    name: "",
                    desciption: "",
                    categories_id: "",
                    fees: "",
                    duration: "",
                    course_img: [],
                  }
            }
            validationSchema={courseSchema}
            onSubmit={async (values) => {
              try {
                const formData = new FormData();

                formData.append("categories_id", values.categories_id);
                formData.append(
                  "intrucotor_id",
                  userData?.user?.data?._id ||
                    updateData?.intrucotor_id?._id ||
                    updateData?.intrucotor_id
                );
                formData.append("name", values.name);
                formData.append("desciption", values.desciption);
                formData.append("fees", values.fees);
                formData.append("duration", values.duration);

                if (Array.isArray(values.course_img)) {
                  values.course_img.forEach((v) => {
                    if (v instanceof File) {
                      formData.append("course_img", v);
                    }
                  });
                }

                if (updateData) {
                  formData.append("_id", updateData._id);
                  await updateCourse(formData).unwrap();
                } else {
                  await addCourse(formData).unwrap();
                }

                handleClose();
              } catch (error) {
                console.error("Course submit error:", error);
              }
            }}
          >
            <Form id="subscription-form">
              <TextForm
                id="categories_id"
                name="categories_id"
                label="Select course"
                select
                slotProps={{
                  select: {
                    native: true,
                  },
                }}
                data={allCat}
              />

              <TextForm
                id="name"
                name="name"
                label="Course Name"
              />

              <TextForm
                id="desciption"
                name="desciption"
                label="Description"
              />

              <TextForm
                id="fees"
                name="fees"
                label="Fees"
                type="number"
              />

              <TextForm
                id="duration"
                name="duration"
                label="Duration"
              />

              <FileUpload name="course_img" />

              {/* Preview URL intentionally kept commented */}
              {/* <FileUpload name="course_perview" /> */}
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
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <DataGrid
        rows={data?.data || []}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel,
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        loading={isLoading}
        sx={{
          border: 0,
        }}
        getRowId={(row) => row._id}
      />
    </React.Fragment>
  );
}

export default Course;







// import React, { useEffect, useState } from "react";
// import Button from "@mui/material/Button";
// import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
// import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
// import DialogTitle from "@mui/material/DialogTitle";
// import { mixed, number, object, string } from "yup";
// import { Form, Formik, useFormik } from "formik";
// import { useDispatch, useSelector } from "react-redux";
// import { getCategory } from "../../../redux/slice/CategorySlice";
// import { DataGrid } from "@mui/x-data-grid";
// import DeleteIcon from "@mui/icons-material/Delete";
// import Stack from "@mui/material/Stack";
// import EditIcon from "@mui/icons-material/Edit";
// import IconButton from "@mui/material/IconButton";
// import TextForm from "../../Component/TextForm/TextForm";
// import FileUpload from "../../Component/FileUpload/FileUpload";
// import {
//   useAddCourseMutation,
//   useDeletCourseMutation,
//   useGetallcourseQuery,
//   useUpdateCourseMutation,
// } from "../../../redux/Api/Course.api";
// // import { IMAGE_URL } from "../../../utility/url";
// import SwitchBtn from "../../Component/SwitchBtn/SwitchBtn";
// import Switch from "@mui/material/Switch";
// import { CheackAuth } from "../../../redux/slice/auth.slice";

// function Course(props) {
//   const cdata = useSelector((state) => state.category);
//   console.log(cdata.category);

//   const userData = useSelector((state) => state.auth);
//   console.log("user Data", userData?.user?.data);

//   const { data, error, isLoading } = useGetallcourseQuery();
//   console.log(data?.data);

//   const [addCourse] = useAddCourseMutation();
//   const [updateCourse] = useUpdateCourseMutation();
//   const [deletCourse] = useDeletCourseMutation();

//   const [open, setOpen] = React.useState();
//   const [allCat, setAllCat] = useState([]);
//   const [updateData, setUpadateData] = useState();
//   console.log("update:", updateData);

//   const dispatch = useDispatch();

//   const handleClickOpen = () => {
//     setOpen(true);
//   };
//   const handleClose = () => {
//     setOpen(false);
//   };

//   const courseSchema = object({
//     categories_id: string().required("course id requied Field"),
//     name: string().required(),
//     desciption: string().required(),
//     fees: number().required(),
//     duration: string().required(),
//     course_img: mixed().required(),
//     // course_perview : mixed().required(),
//     // .test("pfp", "File Must be have a png, jpg and jpeg", function (value) {
//     //   console.log("loh:",value.type);

//     //   const supFiles = ["image/jpeg", "image/jpg", "image/png"];

//     //   return supFiles.includes(value.type?.toLowerCase());
//     // })
//     // .test("pfp", "File Must be have less than 2 MB", function (value) {
//     //   console.log(value);

//     //   return value.size <= 2 * 1024 * 1024;
//     // }),
//   });

//   useEffect(() => {
//     dispatch(getCategory());
//     dispatch(CheackAuth());
//   }, []);

//   let catData = [
//     {
//       value: null,
//       label: "--Select Categroy--",
//     },
//   ];

//   useEffect(() => {
//     cdata.category?.map((v) => {
//       catData.push({ value: v._id, label: v.name });
//     });

//     setAllCat(catData);

//     console.log(catData);
//   }, [cdata.category]);

//   const handledit = (data) => {
//     console.log(data);
//     handleClickOpen();
//     setUpadateData(data);
//   };

//   const handledelet = (_id) => {
//     console.log(_id);
//     deletCourse(_id);
//   };

//   const handleSetStauts = (data) => {
//     console.log("data", data);
//     setUpadateData(data);
//     setChecked(event.target.checked);
//   };

//   const [checked, setChecked] = React.useState(true);

//   const columns = [
//     { field: "name", headerName: "Name", width: 130 },
//     { field: "desciption", headerName: "Description", width: 150 },
//     { field: "fees", headerName: "Fees", width: 100 },
//     { field: "duration", headerName: "Duration", width: 100 },
//     { field: "intrucotor_id", headerName: "Instructor Name", width: 150 },
//     {
//       field: "course_img",
//       headerName: "Image",
//       width: 130,
//       renderCell: (params) => (
//         <div>
//           {params?.row?.course_img?.map((v) => (
//             <img src={v?.url} width={"50px"} height={"50px"} />
//           ))}
//         </div>
//       ),
//     },
//     { field: "perview_url", headerName: "Preview URL", width: 120 },
//     {
//       field: " ",
//       headerName: "status",
//       width: 110,
//       renderCell: (params) => (
//         <Switch
//           id="status"
//           checked={data?.data.is_active}
//           onChange={() => handleSetStauts(params.row)}
//           slotProps={{ input: { "aria-label": "controlled" } }}
//         />
//       ),
//     },
//     {
//       field: "action",
//       headerName: "Action",
//       width: 110,
//       renderCell: (params) => (
//         <Stack direction="row" spacing={1}>
//           <IconButton onClick={() => handledit(params.row)}>
//             <EditIcon />
//           </IconButton>
//           <IconButton onClick={() => handledelet(params.row._id)}>
//             <DeleteIcon />
//           </IconButton>
//         </Stack>
//       ),
//     },
//   ];

//   const paginationModel = { page: 0, pageSize: 5 };

//   console.log(allCat);

//   return (
//     <React.Fragment>
//       <h2>Course</h2>
//       <Button variant="outlined" onClick={handleClickOpen}>
//         Add Course
//       </Button>
//       <Dialog open={open} onClose={handleClose}>
//         <DialogTitle>Add Course</DialogTitle>
//         <DialogContent>
//           <Formik
//             initialValues={
//               updateData
//                 ? updateData
//                 : {
//                     name: "",
//                     desciption: "",
//                     categories_id: "",
//                     fees: "",
//                     duration: "",
//                     course_img: "",
//                     // preview_url:""
//                   }
//             }
//             validationSchema={courseSchema}
//             onSubmit={(values) => {
//               console.log("values", values);

//               const formData = new FormData();
//               formData.append("categories_id", values.categories_id);
//               formData.append("intrucotor_id", userData?.user?.data?._id);
//               formData.append("name", values.name);
//               formData.append("desciption", values.desciption);
//               formData.append("fees", values.fees);
//               formData.append("duration", values.duration);

//               const course_imgs = values.course_img.forEach((v) => {
//                 if (v instanceof File) {
//                   formData.append("course_img", v);
//                 } else {
//                   formData.append("course_img", v.url)
//                 }
//               });

//               console.log(course_imgs);

//               {
//                 updateData
//                   ? (formData.append("_id", updateData._id),
//                     updateCourse(formData))
//                   : addCourse(formData);
//               }

//               handleClose();
//             }}
//           >
//             <Form id="subscription-form">
//               <TextForm
//                 id="categories_id"
//                 name="categories_id"
//                 label="Select course"
//                 select
//                 slotProps={{
//                   select: {
//                     native: true,
//                   },
//                 }}
//                 data={allCat}
//               />

//               <TextForm id="name" name="name" label="Course Name" />

//               <TextForm id="desciption" name="desciption" label="Description" />

//               <TextForm id="fees" name="fees" label="Fees" type="number" />

//               <TextForm id="duration" name="duration" label="Duration" />

//               <FileUpload name="course_img" />

//               {/* <FileUpload name="course_perview" /> */}

//             </Form>
//           </Formik>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose}>Cancel</Button>
//           <Button type="submit" form="subscription-form">
//             Submit
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* display */}
//       <DataGrid
//         rows={data?.data}
//         columns={columns}
//         initialState={{ pagination: { paginationModel } }}
//         pageSizeOptions={[5, 10]}
//         checkboxSelection
//         sx={{ border: 0 }}
//         getRowId={(row) => row._id}
//       />
//     </React.Fragment>
//   );
// }

// export default Course;
