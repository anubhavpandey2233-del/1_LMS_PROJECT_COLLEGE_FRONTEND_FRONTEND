import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { LogoutUser } from "../../redux/slice/auth.slice";
import { useContext } from "react";
import { ThemeContext, ThemeProvider } from "../../context/ThemeContext";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import FormControlLabel from "@mui/material/FormControlLabel";
import { getCategory } from "../../redux/slice/CategorySlice.js";
import { useGetallcourseQuery } from "../../redux/Api/Course.api.js";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

function Header(props) {
  const { data, error, isLoading } = useGetallcourseQuery();
  console.log(data?.data);

  const navigation = useNavigate();

  const themedata = useContext(ThemeContext);

  const isdark = themedata.theme === "dark";
  console.log(isdark);

  const handleChange = (event) => {
    themedata.toggletheme(themedata.theme);
  };

  console.log("themedata", themedata);

  const { logtype } = useParams();
  console.log(logtype);

  const cateData = useSelector((state) => state.category);
  console.log(cateData);

  const firstCat = cateData.category?.filter((v) => v.parent_id === null);
  console.log(firstCat);

  const auth = useSelector((state) => state.auth);
  console.log("checklogin", auth?.user?.data);

  localStorage.setItem("checkauth", JSON.stringify(auth?.user?.data));

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCategory());
  }, []);

  const handleprofile = () => {
    const userRole = auth?.user?.data?.role || auth?.user?.role;
    if (userRole === "instructor" || userRole === "admin") {
      navigation("/instructor-dashboard");
    } else {
      navigation("/user-dashboard");
    }
  };

  const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    "& .MuiSwitch-switchBase": {
      margin: 1,
      padding: 0,
      transform: "translateX(6px)",
      "&.Mui-checked": {
        color: "#fff",
        transform: "translateX(22px)",
        "& .MuiSwitch-thumb:before": {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            "#fff",
          )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
        },
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor: "#aab4be",
          ...theme.applyStyles("dark", {
            backgroundColor: "#8796A5",
          }),
        },
      },
    },
    "& .MuiSwitch-thumb": {
      backgroundColor: "#001e3c",
      width: 32,
      height: 32,
      "&::before": {
        content: "''",
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff",
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
      },
      ...theme.applyStyles("dark", {
        backgroundColor: "#003892",
      }),
    },
    "& .MuiSwitch-track": {
      opacity: 1,
      backgroundColor: "#aab4be",
      borderRadius: 20 / 2,
      ...theme.applyStyles("dark", {
        backgroundColor: "#8796A5",
      }),
    },
  }));

  return (
    <header className="navbar-light navbar-sticky header-static">
      {/* Logo Nav START */}
      <nav className="navbar navbar-expand-xl">
        <div className="container-fluid px-3 px-xl-5">
          {/* Logo START */}
          <a className="navbar-brand" href="/">
            <img
              className="light-mode-item navbar-brand-item"
              src="assets/images/logo.svg"
              alt="logo"
            />
            <img
              className="dark-mode-item navbar-brand-item"
              src="assets/images/logo-light.svg"
              alt="logo"
            />
          </a>
          {/* Logo END */}
          {/* Responsive navbar toggler */}
          <button
            className="navbar-toggler ms-auto"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
            aria-controls="navbarCollapse"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-animation">
              <span />
              <span />
              <span />
            </span>
          </button>
          {/* Main navbar START */}
          <div className="navbar-collapse w-100 collapse" id="navbarCollapse">
            {/* Nav category menu START */}
            <ul className="navbar-nav navbar-nav-scroll me-auto">
              {/* Nav item 1 Demos */}
              <li className="nav-item dropdown dropdown-menu-shadow-stacked">
                <a
                  className="nav-link rounded-3 text-primary px-3 py-3 py-xl-0"
                  href="#"
                  id="categoryMenu"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i className="bi bi-ui-radios-grid me-2" />
                  <span>Category</span>
                </a>

                <ul className="dropdown-menu" aria-labelledby="categoryMenu">
                  {firstCat?.map((v) => {
                    const secCat = cateData.category.filter(
                      (sc) => sc.parent_id === v._id,
                    );
                    console.log(secCat);

                    return (
                      <>
                        <li
                          className={
                            secCat.length > 0 ? "dropdown-submenu dropend" : ""
                          }
                        >
                          <a
                            className={
                              secCat.length > 0
                                ? "dropdown-item dropdown-toggle"
                                : "dropdown-item"
                            }
                            href="#"
                          >
                            <NavLink
                              to={
                                secCat.length > 0
                                  ? `/category/${v._id}`
                                  : `/course`
                              }
                            >
                              {v.name}
                            </NavLink>
                            {/* {v.name} */}
                          </a>

                          {secCat && (
                            <ul
                              className="dropdown-menu dropdown-menu-start"
                              data-bs-popper="none"
                            >
                              {secCat.map((sc) => {
                                const thCat = cateData.category.filter(
                                  (tc) => tc.parent_id === sc._id,
                                );
                                console.log(thCat);

                                return (
                                  <li
                                    className={
                                      thCat.length > 0
                                        ? "dropdown-submenu dropend"
                                        : ""
                                    }
                                  >
                                    <a
                                      className={
                                        thCat.length > 0
                                          ? "dropdown-item dropdown-toggle"
                                          : "dropdown-item"
                                      }
                                      href="#"
                                    >
                                      <NavLink
                                        to={
                                          thCat.length > 0
                                            ? `/category/${sc._id}`
                                            : `/course`
                                        }
                                      >
                                        {sc.name}
                                      </NavLink>
                                    </a>

                                    {thCat && (
                                      <ul
                                        className="dropdown-menu dropdown-menu-start"
                                        data-bs-popper="none"
                                      >
                                        {thCat.map((tc) => (
                                          <li
                                            className={
                                              thCat.length > 0
                                                ? "dropdown-submenu dropend"
                                                : ""
                                            }
                                          >
                                            <a
                                              className="dropdown-item"
                                              href="#"
                                            >
                                              <NavLink
                                                to={
                                                  cateData.category.some(
                                                    (c) =>
                                                      c.parent_id === tc._id,
                                                  )
                                                    ? `/category/${tc._id}`
                                                    : `/course`
                                                }
                                              >
                                                {" "}
                                                {tc.name}
                                              </NavLink>
                                            </a>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </li>
                      </>
                    );
                  })}
                  <li className={"dropdown-submenu dropend"}>
                    {" "}
                    <a className={"dropdown-item"} href="#">
                      <NavLink to={"/category"}>All Category</NavLink>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
            {/* Nav category menu END */}
            <ul className="navbar-nav navbar-nav-scroll me-auto">
              <li>
                <NavLink className={`nav-link`} to={"/about"}>
                  About Us
                </NavLink>
              </li>

              <li>
                {" "}
                <NavLink className={`nav-link `} to={"/course"}>
                  Course
                </NavLink>
              </li>
              <li>
                {" "}
                <NavLink className={`nav-link `} to={"/contact"}>
                  Contact Us
                </NavLink>
              </li>
              <li>
                {" "}
                <NavLink className={`nav-link `} to={"/blog"}>
                  Blog
                </NavLink>
              </li>
            </ul>

            <MaterialUISwitch
              sx={{ m: 1 }}
              checked={themedata.theme === "dark"}
              onChange={(e) => handleChange(e)}
            />

            {/* Nav Search START */}
            <div className="nav my-3 my-xl-0 px-4 flex-nowrap align-items-center">
              <div
                className="nav-item w-100"
                onClick={() => navigation("/cart")}
              >
                <ShoppingCartIcon />
              </div>
            </div>
            {/* Nav Search END */}
          </div>
          {/* Main navbar END */}
          {/* Profile START */}

          {/* Profile START */}
          <div className="dropdown ms-1 ms-lg-0 d-flex align-items-center">
            {auth.user ? (
              <>
                <a
                  href="#"
                  onClick={() => dispatch(LogoutUser(auth.user.data._id))}
                  className="btn btn-sm btn-primary-soft me-3 mb-0 border-primary rounded"
                  style={{ padding: "8px 10px", fontSize: "15px" }}
                >
                  Sign Out
                </a>

                <a onClick={() => handleprofile()}>
                  <img
                    className="avatar avatar-md rounded-circle me-3 flex-shrink-0"
                    src={
                      auth?.user?.data?.pfp[0]?.url ||
                      "../../../public/assets/images/avatar/01.jpg"
                    }
                    style={{
                      width: "48px",
                      height: "48px",
                      objectFit: "cover",
                    }}
                  />
                </a>
              </>
            ) : (
              <>
                <div className="d-sm-flex align-items-center justify-content-center justify-content-lg-start">
                  <NavLink
                    className="btn btn-sm btn-primary-soft me-2 mb-0 border-primary"
                    style={{ padding: "6px 8px", fontSize: "15px" }}
                    to="/Auth"
                  >
                    Sign in as User
                  </NavLink>

                  <NavLink
                    className="btn btn-sm btn-primary-soft me-2 mb-0 border-primary"
                    style={{ padding: "6px 8px", fontSize: "15px" }}
                    to="/Auth/Instructor"
                  >
                    Sign in as Instructor
                  </NavLink>
                </div>
              </>
            )}
          </div>
          {/* Profile START */}
          {/* Profile START */}
        </div>
      </nav>
      {/* Logo Nav END */}
    </header>
  );
}

export default Header;
