
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { boolean, number, object, string } from "yup";
import {
  ForgotPass,
  LoginUser,
  registerUser,
  ResetPass,
  VerifyUser,
} from "../../redux/slice/auth.slice";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

function Auth() {
  const { logtype } = useParams();
  const auth = useSelector((state) => state.auth);
  const [type, setType] = useState("login");
  const [reset, setReset] = useState("signup");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  let initial = {};
  let authSchema = {};

  if (type === "signup") {
    initial = {
      name: "",
      email: "",
      password: "",
      cpassword: "",
      term: false,
    };
    authSchema = {
      name: string().required("Name is required"),
      email: string().email("Enter a valid email").required("Email is required"),
      password: string().required("Password is required"),
      cpassword: string().required("Confirm password is required"),
      term: boolean().oneOf([true], "Please accept the terms and conditions"),
    };
  } else if (type === "verify") {
    initial = { otp: "" };
    authSchema = {
      otp: number().typeError("OTP must be a number").required("OTP is required"),
    };
  } else if (type === "login") {
    initial = { email: "", password: "", term: false };
    authSchema = {
      email: string().email("Enter a valid email").required("Email is required"),
      password: string().required("Password is required"),
      term: boolean().oneOf([true], "Please accept the terms and conditions"),
    };
  } else if (type === "ForgotPass") {
    initial = { email: "" };
    authSchema = {
      email: string().email("Enter a valid email").required("Email is required"),
    };
  } else if (type === "reset") {
    initial = { password: "", cpassword: "" };
    authSchema = {
      password: string().required("Password is required"),
      cpassword: string().required("Confirm password is required"),
    };
  }

  const formik = useFormik({
    initialValues: initial,
    validationSchema: object(authSchema),
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (type === "signup") {
        localStorage.setItem("email", values.email);
        const res = await dispatch(registerUser({ ...values, role: logtype }));

        if (res.type === "auth/fulfilled") {
          setType("verify");
        }
      } else if (type === "verify") {
        const res = await dispatch(
          VerifyUser({
            email: localStorage.getItem("email"),
            OTP: values.otp,
          })
        );

        if (res.type === "auth/verifyUser/fulfilled") {
          if (reset === "signup") {
            setType("login");
          } else {
            setType("reset");
          }
        }
      } else if (type === "login") {
        const res = await dispatch(LoginUser(values));

        if (
          res.type === "auth/LoginUser/fulfilled" &&
          ["instructor", "user"].includes(res.payload?.role)
        ) {
          navigate("/");
        }
      } else if (type === "ForgotPass") {
        localStorage.setItem("email", values.email);
        const res = await dispatch(ForgotPass(values));

        if (res.type === "auth/ForgotPass/fulfilled") {
          setType("verify");
          setReset("reset");
        }
      } else if (type === "reset") {
        const res = await dispatch(
          ResetPass({
            email: localStorage.getItem("email"),
            password: values.password,
          })
        );

        if (res.type === "auth/ResetPass/fulfilled") {
          setType("login");
        }
      }
    },
  });

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    touched,
    errors,
    values,
  } = formik;

  if (auth.isLoading) {
    return <p className="text-center mt-5">Loading...</p>;
  }

  return (
    <section className="auth-page p-0 d-flex align-items-stretch">
      <div className="container-fluid p-0">
        <div className="row g-0 auth-row">
          {/* Left illustration panel */}
          <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center bg-primary bg-opacity-10 auth-left">
            <div className="auth-left-content p-3 p-lg-5">
              <div className="text-center">
                <h2 className="fw-bold">
                  Welcome to our largest community
                </h2>
                <p className="mb-0 h6 fw-light">
                  Let's learn something new today!
                </p>
              </div>

              <div className="auth-illustration">
                <img
                  src="/assets/images/element/02.svg"
                  alt="Learning illustration"
                />
              </div>

              <div className="d-sm-flex mt-5 align-items-center justify-content-center">
                <ul className="avatar-group mb-2 mb-sm-0">
                  {["01.jpg", "02.jpg", "03.jpg", "04.jpg"].map((image) => (
                    <li className="avatar avatar-sm" key={image}>
                      <img
                        className="avatar-img rounded-circle"
                        src={`/assets/images/avatar/${image}`}
                        alt="Student avatar"
                      />
                    </li>
                  ))}
                </ul>
                <p className="mb-0 h6 fw-light ms-0 ms-sm-3">
                  4k+ Students joined us, now it's your turn.
                </p>
              </div>
            </div>
          </div>

          {/* Right authentication panel */}
          <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center auth-right">
            <div className="auth-form-container w-100">
              <img
                src="/assets/images/element/03.svg"
                className="auth-logo mb-2"
                alt="Learning platform"
              />

              <h2>
                {logtype
                  ? `${logtype} ${type} for your account!`
                  : `${type} for your account!`}
              </h2>
              <p className="lead mb-4">
                Nice to see you! Please {type} your account.
              </p>

              <form onSubmit={handleSubmit} noValidate>
                {(type === "signup" ||
                  type === "login" ||
                  type === "ForgotPass" ||
                  type === "reset") && (
                  <>
                    {type === "signup" && (
                      <div className="mb-4">
                        <label htmlFor="auth-name" className="form-label">
                          Name *
                        </label>
                        <div className="input-group input-group-lg">
                          <span className="input-group-text bg-light border-0">
                            <i className="bi bi-person-fill" />
                          </span>
                          <input
                            id="auth-name"
                            name="name"
                            type="text"
                            className="form-control border-0 bg-light"
                            placeholder="Name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.name}
                          />
                        </div>
                        {errors.name && touched.name && (
                          <small className="text-danger">{errors.name}</small>
                        )}
                      </div>
                    )}

                    {(type === "signup" ||
                      type === "login" ||
                      type === "ForgotPass") && (
                      <div className="mb-4">
                        <label htmlFor="auth-email" className="form-label">
                          Email address *
                        </label>
                        <div className="input-group input-group-lg">
                          <span className="input-group-text bg-light border-0">
                            <i className="bi bi-envelope-fill" />
                          </span>
                          <input
                            id="auth-email"
                            name="email"
                            type="email"
                            className="form-control border-0 bg-light"
                            placeholder="E-mail"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                          />
                        </div>
                        {errors.email && touched.email && (
                          <small className="text-danger">{errors.email}</small>
                        )}
                      </div>
                    )}

                    {(type === "signup" ||
                      type === "login" ||
                      type === "reset") && (
                      <div className="mb-4">
                        <label htmlFor="auth-password" className="form-label">
                          Password *
                        </label>
                        <div className="input-group input-group-lg">
                          <span className="input-group-text bg-light border-0">
                            <i className="fas fa-lock" />
                          </span>
                          <input
                            id="auth-password"
                            name="password"
                            type="password"
                            className="form-control border-0 bg-light"
                            placeholder="Enter password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                          />
                        </div>
                        {errors.password && touched.password && (
                          <small className="text-danger">{errors.password}</small>
                        )}
                      </div>
                    )}

                    {(type === "signup" || type === "reset") && (
                      <div className="mb-4">
                        <label htmlFor="auth-confirm-password" className="form-label">
                          Confirm Password *
                        </label>
                        <div className="input-group input-group-lg">
                          <span className="input-group-text bg-light border-0">
                            <i className="fas fa-lock" />
                          </span>
                          <input
                            id="auth-confirm-password"
                            name="cpassword"
                            type="password"
                            className="form-control border-0 bg-light"
                            placeholder="Confirm password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.cpassword}
                          />
                        </div>
                        {errors.cpassword && touched.cpassword && (
                          <small className="text-danger">{errors.cpassword}</small>
                        )}
                      </div>
                    )}

                    {(type === "signup" || type === "login") && (
                      <div className="mb-4">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="auth-terms"
                            name="term"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            checked={values.term}
                          />
                          <label className="form-check-label" htmlFor="auth-terms">
                            I agree to the <a href="#terms">terms of service</a>
                          </label>
                        </div>
                        {errors.term && touched.term && (
                          <small className="text-danger">{errors.term}</small>
                        )}
                      </div>
                    )}
                  </>
                )}

                {type === "verify" && (
                  <div className="mb-4">
                    <label htmlFor="auth-otp" className="form-label">
                      OTP *
                    </label>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-light border-0">
                        <i className="fas fa-lock" />
                      </span>
                      <input
                        id="auth-otp"
                        name="otp"
                        type="text"
                        inputMode="numeric"
                        className="form-control border-0 bg-light"
                        placeholder="Enter OTP"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.otp}
                      />
                    </div>
                    {errors.otp && touched.otp && (
                      <small className="text-danger">{errors.otp}</small>
                    )}
                  </div>
                )}

                <div className="d-grid mt-3">
                  <button className="btn btn-primary mb-0" type="submit">
                    {type === "ForgotPass" ? "Send reset code" : type}
                  </button>
                </div>
              </form>

              <div className="mt-3">
                {type === "login" && (
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    onClick={() => setType("ForgotPass")}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>

              <div className="row">
                <div className="position-relative my-4">
                  <hr />
                  <p className="small position-absolute top-50 start-50 translate-middle bg-body px-4">
                    Or
                  </p>
                </div>
              </div>

              {type === "signup" ? (
                <div className="mt-4 text-center">
                  <span>Already have an account? </span>
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    onClick={() => setType("login")}
                  >
                    Sign in here
                  </button>
                </div>
              ) : (
                <div className="mt-4 text-center">
                  <span>Don't have an account? </span>
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    onClick={() => setType("signup")}
                  >
                    Sign up here
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Auth;



// import { useFormik } from "formik";
// import { useDispatch, useSelector } from "react-redux";
// import { boolean, number, object, string } from "yup";
// import {
//   CheackAuth,
//   ForgotPass,
//   LoginUser,
//   registerUser,
//   ResetPass,
//   VerifyUser,
// } from "../../redux/slice/auth.slice";
// import { NavLink, useNavigate, useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import Snackbar from "../../components/SnackBar/Snackbar";
// import { enqueueSnackbar, SnackbarContent } from "notistack";

// function Auth() {
//   const { logtype } = useParams();
//   console.log(logtype);

//   const auth = useSelector((state) => state.auth);
//   console.log(auth);

//   const [type, setType] = useState("login");
//   const [reset, setReset] = useState("signup");

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   let initial = {},
//     authSchema = {};

//   if (type === "signup") {
//     initial = {
//       name: "",
//       email: "",
//       password: "",
//       cpassword: "",
//       term: false,
//     };
//     authSchema = {
//       name: string().required(),
//       email: string().email().required(),
//       password: string().required(),
//       cpassword: string().required(),
//       term: boolean()
//         .required()
//         .oneOf([true], "Please select Term & Condition Befrore Signup"),
//     };
//   } else if (type === "verify") {
//     initial = {
//       otp: null,
//     };
//     authSchema = {
//       otp: number().required(),
//     };
//   } else if (type === "login") {
//     initial = {
//       email: "",
//       password: "",
//       term: false,
//     };
//     authSchema = {
//       email: string().email().required(),
//       password: string().required(),
//       term: boolean()
//         .required()
//         .oneOf([true], "Please select Term & Condition Befrore Signup"),
//     };
//   } else if (type === "ForgotPass") {
//     initial = {
//       email: "",
//     };
//     authSchema = {
//       email: string().email().required(),
//     };
//   } else if (type === "reset") {
//     initial = {
//       password: "",
//       cpassword: "",
//     };
//     authSchema = {
//       password: string().required(),
//       cpassword: string().required(),
//     };
//   }

//   const formik = useFormik({
//     initialValues: initial,
//     validationSchema: object(authSchema),
//     enableReinitialize: true,
//     onSubmit: async (values) => {
//       if (type === "signup") {
//         localStorage.setItem("email", values.email);
//         const res = await dispatch(registerUser({ ...values, role: logtype }));
//         console.log(res);

//         if (res.type === "auth/fulfilled") {
//           setType("verify");
//         }
//       } else if (type === "verify") {
//         const res = await dispatch(
//           VerifyUser({ email: localStorage.getItem("email"), OTP: values.otp }),
//         );

//         console.log(res);

//         if (res.type === "auth/verifyUser/fulfilled") {
//           console.log(reset);

//           if (reset === "signup") {
//             setType("login");
//           } else if (reset === "reset") {
//             setType("reset");
//           }
//         }
//       } else if (type === "login") {
//         const res = await dispatch(LoginUser(values));

//         if (
//           res.type === "auth/LoginUser/fulfilled" &&
//           res.payload.role === "instructor"
//         ) {
//           navigate("/");
//         } else if (
//           res.type === "auth/LoginUser/fulfilled" &&
//           res.payload.role === "user"
//         ) {
//           navigate("/");
//         }

//         console.log(res);

//         // enqueueSnackbar("LOGIN sucessfuly!", {
//         //   variant: "success",
//         //   anchorOrigin: {
//         //     vertical: "top",
//         //     horizontal: "center",
//         //   },
//         // });
//       } else if (type === "ForgotPass") {
//         localStorage.setItem("email", values.email);
//         const res = await dispatch(ForgotPass(values));
//         console.log(res);

//         if (res.type === "auth/ForgotPass/fulfilled") {
//           setType("verify");
//           setReset("reset");
//         }
//       } else if (type === "reset") {
//         const res = await dispatch(
//           ResetPass({
//             email: localStorage.getItem("email"),
//             password: values.password,
//           }),
//         );

//         if (res.type === "auth/ResetPass/fulfilled") {
//           setType("login");
//         }
//       }
//     },
//   });

//   if (auth.isLoading) {
//     return <p>Loading</p>;
//   }

//   const { handleSubmit, handleChange, handleBlur, touched, errors, values } =
//     formik;

//   console.log(errors);

//   const handleGoogleLogin = () => {
//     try {
//       window.location.href = "http://localhost:3030/api/v2/user/auth/google";
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleFacebookLogin = () => {
//     try {
//       window.location.href = "http://localhost:3030/api/v2/user/auth/facebook";
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   return (
//     <section className="p-0 d-flex align-items-center position-relative overflow-hidden">
//       <div className="container-fluid">
//         <div className="row">
//           {/* left */}
//           <div className="col-12 col-lg-6 d-md-flex align-items-center justify-content-center bg-primary bg-opacity-10 vh-lg-100">
//             <div className="p-3 p-lg-5">
//               {/* Title */}
//               <div className="text-center">
//                 <h2 className="fw-bold">Welcome to our largest community</h2>
//                 <p className="mb-0 h6 fw-light">
//                   Let's learn something new today!
//                 </p>
//               </div>
//               {/* SVG Image */}
//               <img
//                 src="/assets/images/element/02.svg"
//                 className="mt-5 img-fluid"
//                 alt="Learning illustration"
//               />
//               {/* Info */}
//               <div className="d-sm-flex mt-5 align-items-center justify-content-center">
//                 <ul className="avatar-group mb-2 mb-sm-0">
//                   <li className="avatar avatar-sm">
//                     <img
//                       className="avatar-img rounded-circle"
//                       src="/assets/images/avatar/01.jpg"
//                       alt="avatar"
//                     />
//                   </li>
//                   <li className="avatar avatar-sm">
//                     <img
//                       className="avatar-img rounded-circle"
//                       src="/assets/images/avatar/02.jpg"
//                       alt="avatar"
//                     />
//                   </li>
//                   <li className="avatar avatar-sm">
//                     <img
//                       className="avatar-img rounded-circle"
//                       src="/assets/images/avatar/03.jpg"
//                       alt="avatar"
//                     />
//                   </li>
//                   <li className="avatar avatar-sm">
//                     <img
//                       className="avatar-img rounded-circle"
//                       src="/assets/images/avatar/04.jpg"
//                       alt="avatar"
//                     />
//                   </li>
//                 </ul>
//                 {/* Content */}
//                 <p className="mb-0 h6 fw-light ms-0 ms-sm-3">
//                   4k+ Students joined us, now it's your turn.
//                 </p>
//               </div>
//             </div>
//           </div>
//           {/* Right */}
//           <div className="col-12 col-lg-6 m-auto">
//             <div className="row my-5">
//               <div className="col-sm-10 col-xl-8 m-auto">
//                 {/* Title */}
//                 <img
//                   src="/assets/images/element/03.svg"
//                   className="h-40px mb-2"
//                   alt
//                 />
//                 <h2>
//                   {logtype
//                     ? `${logtype} ${type} for your account!`
//                     : `${type} for your account!`}
//                 </h2>
//                 <p className="lead mb-4">
//                   Nice to see you! Please {type} your account.
//                 </p>
//                 {/* Form START */}
//                 <form onSubmit={handleSubmit}>
//                   {type === "signup" ||
//                     type === "login" ||
//                     type === "ForgotPass" ||
//                     type === "reset" ? (
//                     <>
//                       {type === "signup" && (
//                         //name
//                         <div className="mb-4">
//                           <label
//                             htmlFor="exampleInputName"
//                             className="form-label"
//                           >
//                             Name *
//                           </label>
//                           <div className="input-group input-group-lg">
//                             <span className="input-group-text bg-light rounded-start border-0 text-secondary px-3">
//                               <i className="bi bi-envelope-fill" />
//                             </span>
//                             <input
//                               name="name"
//                               type="text"
//                               className="form-control border-0 bg-light rounded-end ps-1"
//                               placeholder="Name"
//                               id="exampleInputName"
//                               onChange={handleChange}
//                               onBlur={handleBlur}
//                               value={values.name}
//                             />
//                             {errors.name && touched.name ? (
//                               <span style={{ color: "red" }}>
//                                 {errors.name}
//                               </span>
//                             ) : (
//                               ""
//                             )}
//                           </div>
//                         </div>
//                       )}

//                       {type === "signup" ||
//                         type === "login" ||
//                         type === "ForgotPass" ? (
//                         //email
//                         <div className="mb-4">
//                           <label
//                             htmlFor="exampleInputEmail1"
//                             className="form-label"
//                           >
//                             Email address *
//                           </label>
//                           <div className="input-group input-group-lg">
//                             <span className="input-group-text bg-light rounded-start border-0 text-secondary px-3">
//                               <i className="bi bi-envelope-fill" />
//                             </span>
//                             <input
//                               name="email"
//                               type="email"
//                               className="form-control border-0 bg-light rounded-end ps-1"
//                               placeholder="E-mail"
//                               id="exampleInputEmail1"
//                               onChange={handleChange}
//                               onBlur={handleBlur}
//                               value={values.email}
//                             />
//                             {errors.email && touched.email ? (
//                               <span style={{ color: "red" }}>
//                                 {errors.email}
//                               </span>
//                             ) : (
//                               ""
//                             )}
//                           </div>
//                         </div>
//                       ) : (
//                         ""
//                       )}

//                       {type === "signup" ||
//                         type === "login" ||
//                         type === "reset" ? (
//                         //password
//                         <div className="mb-4">
//                           <label
//                             htmlFor="inputPassword5"
//                             className="form-label"
//                           >
//                             Password *
//                           </label>
//                           <div className="input-group input-group-lg">
//                             <span className="input-group-text bg-light rounded-start border-0 text-secondary px-3">
//                               <i className="fas fa-lock" />
//                             </span>
//                             <input
//                               name="password"
//                               type="password"
//                               className="form-control border-0 bg-light rounded-end ps-1"
//                               placeholder="*********"
//                               id="inputPassword5"
//                               onChange={handleChange}
//                               onBlur={handleBlur}
//                               value={values.password}
//                             />
//                             {errors.password && touched.password ? (
//                               <span style={{ color: "red" }}>
//                                 {errors.password}
//                               </span>
//                             ) : (
//                               ""
//                             )}
//                           </div>
//                         </div>
//                       ) : (
//                         ""
//                       )}

//                       {type === "signup" || type === "reset" ? (
//                         //cpassword
//                         <div className="mb-4">
//                           <label
//                             htmlFor="inputPassword6"
//                             className="form-label"
//                           >
//                             Confirm Password *
//                           </label>
//                           <div className="input-group input-group-lg">
//                             <span className="input-group-text bg-light rounded-start border-0 text-secondary px-3">
//                               <i className="fas fa-lock" />
//                             </span>
//                             <input
//                               name="cpassword"
//                               type="password"
//                               className="form-control border-0 bg-light rounded-end ps-1"
//                               placeholder="*********"
//                               id="inputPassword6"
//                               onChange={handleChange}
//                               onBlur={handleBlur}
//                               value={values.cpassword}
//                             />
//                             {errors.cpassword && touched.cpassword ? (
//                               <span style={{ color: "red" }}>
//                                 {errors.cpassword}
//                               </span>
//                             ) : (
//                               ""
//                             )}
//                           </div>
//                         </div>
//                       ) : (
//                         " "
//                       )}

//                       {/* Check box */}
//                       {type === "signup" || type === "login" ? (
//                         <div className="mb-4">
//                           <div className="form-check">
//                             <input
//                               type="checkbox"
//                               className="form-check-input"
//                               id="checkbox-1"
//                               name="term"
//                               onChange={handleChange}
//                               onBlur={handleBlur}
//                               checked={values.term}
//                             />
//                             <label
//                               className="form-check-label"
//                               htmlFor="checkbox-1"
//                             >
//                               By signing up, you agree to the
//                               <a href="#"> terms of service</a>
//                             </label>
//                             {errors.term && touched.term ? (
//                               <span style={{ color: "red" }}>
//                                 {errors.term}
//                               </span>
//                             ) : (
//                               ""
//                             )}
//                           </div>
//                         </div>
//                       ) : (
//                         ""
//                       )}
//                     </>
//                   ) : (
//                     // OTP
//                     <div className="mb-4">
//                       <label htmlFor="inputPassword6" className="form-label">
//                         OTP *
//                       </label>
//                       <div className="input-group input-group-lg">
//                         <span className="input-group-text bg-light rounded-start border-0 text-secondary px-3">
//                           <i className="fas fa-lock" />
//                         </span>
//                         <input
//                           name="otp"
//                           type="text"
//                           className="form-control border-0 bg-light rounded-end ps-1"
//                           placeholder="******"
//                           id="inputPassword7"
//                           onChange={handleChange}
//                           onBlur={handleBlur}
//                           value={values.otp}
//                         />
//                         {errors.otp && touched.otp ? (
//                           <span style={{ color: "red" }}>{errors.otp}</span>
//                         ) : (
//                           ""
//                         )}
//                       </div>
//                     </div>
//                   )}

//                   {/* Button */}
//                   <div className="align-items-center mt-0">
//                     <div className="d-grid">
//                       <button className="btn btn-primary mb-0" type="submit">
//                         {type}
//                       </button>
//                     </div>
//                   </div>
//                 </form>

//                 <div>
//                   <a href="#" onClick={() => setType("ForgotPass")}>
//                     Forgot Password
//                   </a>
//                 </div>
//                 {/* Form END */}
//                 {/* Social buttons */}
//                 <div className="row">
//                   {/* Divider with text */}
//                   <div className="position-relative my-4">
//                     <hr />
//                     <p className="small position-absolute top-50 start-50 translate-middle bg-body px-5">
//                       Or
//                     </p>
//                   </div>
//                   {/* Social btn */}
//                   {/* <div className="col-xxl-6 d-grid">
//                     <a
//                       href="#"
//                       className="btn bg-google mb-2 mb-xxl-0"
//                       onClick={handleGoogleLogin}
//                     >
//                       <i className="fab fa-fw fa-google text-white me-2" />
//                       Signup with Google
//                     </a>
//                   </div> */}
//                   {/* Social btn */}
//                   {/* <div className="col-xxl-6 d-grid">
//                     <a
//                       href="#"
//                       className="btn bg-facebook mb-0"
//                       onClick={handleFacebookLogin}
//                     >
//                       <i className="fab fa-fw fa-facebook-f me-2" />
//                       Signup with Facebook
//                     </a>
//                   </div> */}
//                 </div>

//                 {type === "signup" ? (
//                   <div className="mt-4 text-center">
//                     <span>
//                       Already have an account?
//                       <a href="#" onClick={() => setType("login")}>
//                         {" "}
//                         Sign in here
//                       </a>
//                     </span>
//                   </div>
//                 ) : (
//                   <div className="mt-4 text-center">
//                     <span>
//                       Don't have an account?
//                       <a href="#" onClick={() => setType("signup")}>
//                         Signup here
//                       </a>
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Auth;
