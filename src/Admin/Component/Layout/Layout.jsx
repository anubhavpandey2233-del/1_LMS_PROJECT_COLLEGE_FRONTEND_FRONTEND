
import React, { useContext } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CategoryIcon from "@mui/icons-material/Category";
import AppsIcon from "@mui/icons-material/Apps";
import FoundationIcon from "@mui/icons-material/Foundation";
import { NavLink } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { ThemeContext } from "../../../context/ThemeContext";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import QuizIcon from "@mui/icons-material/Quiz";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import { useSelector } from "react-redux";
import BookIcon from "@mui/icons-material/Book";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

export default function Layout({ children }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const drawerWidth = 240;

  const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
  });

  const closedMixin = (theme) => ({
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  });

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  }));

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
      {
        props: ({ open }) => open,
        style: {
          marginLeft: drawerWidth,
          width: `calc(100% - ${drawerWidth}px)`,
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      },
    ],
  }));

  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          "& .MuiDrawer-paper": openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          "& .MuiDrawer-paper": closedMixin(theme),
        },
      },
    ],
  }));

  const auth = useSelector((state) => state.auth);

  let savedUser = null;
  try {
    const saved = localStorage.getItem("checkauth");
    savedUser = saved && saved !== "undefined" ? JSON.parse(saved) : null;
  } catch (error) {
    savedUser = null;
  }

  const currentUser = auth?.user?.data || auth?.user || savedUser;
  const userRole = String(currentUser?.role || "").toLowerCase();
  const isTeacher = userRole === "instructor" || userRole === "teacher";
  const panelTitle = isTeacher ? "Teacher Panel" : "Admin Panel";

  const teacherMenu = [
    { label: "Course", icon: <FoundationIcon />, to: "/admin/course" },
    { label: "Section", icon: <AppsIcon />, to: "/admin/section" },
    { label: "Content", icon: <ContentPasteIcon />, to: "/admin/content" },
    { label: "Quiz", icon: <QuizIcon />, to: "/admin/quiz" },
    { label: "Coupon", icon: <ConfirmationNumberIcon />, to: "/admin/coupan" },
    { label: "Blog", icon: <BookIcon />, to: "/admin/blog" },
  ];

  const adminMenu = [
    { label: "Dashboard", icon: <DashboardIcon />, to: "/admin/" },
    { label: "Category", icon: <CategoryIcon />, to: "/admin/category" },
    { label: "Course", icon: <FoundationIcon />, to: "/admin/course" },
    { label: "Section", icon: <AppsIcon />, to: "/admin/section" },
    { label: "Content", icon: <ContentPasteIcon />, to: "/admin/content" },
    { label: "Quiz", icon: <QuizIcon />, to: "/admin/quiz" },
    { label: "Coupon", icon: <ConfirmationNumberIcon />, to: "/admin/coupan" },
    { label: "Tag", icon: <LocalOfferIcon />, to: "/admin/tag" },
    { label: "Blog", icon: <BookIcon />, to: "/admin/blog" },
  ];

  const listBox = isTeacher ? teacherMenu : adminMenu;

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const Theme = useContext(ThemeContext);
console.log("Auth:", auth);
console.log("Saved User:", savedUser);
console.log("Current User:", currentUser);
console.log("User Role:", userRole);


  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[{ marginRight: 5 }, open && { display: "none" }]}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            ELEVATE KNOWLEDGE [{panelTitle}]
          </Typography>
          <IconButton
            aria-label="toggle theme"
            size="large"
            sx={{ ml: "auto" }}
            onClick={() => Theme.toggletheme(Theme.theme)}
          >
            {Theme.theme === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {listBox.map((v) => (
            <ListItem
              key={v.label}
              disablePadding
              sx={{ display: "block" }}
              component={NavLink}
              to={v.to}
            >
              <ListItemButton
                sx={[
                  { minHeight: 48, px: 2.5 },
                  open ? { justifyContent: "initial" } : { justifyContent: "center" },
                ]}
              >
                <ListItemIcon
                  sx={[
                    { minWidth: 0, justifyContent: "center" },
                    open ? { mr: 3 } : { mr: "auto" },
                  ]}
                >
                  {v.icon}
                </ListItemIcon>
                <ListItemText
                  primary={v.label}
                  sx={[open ? { opacity: 1 } : { opacity: 0 }]}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}







// import React, { useContext } from "react";
// import { styled, useTheme } from "@mui/material/styles";
// import Box from "@mui/material/Box";
// import MuiDrawer from "@mui/material/Drawer";
// import MuiAppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import List from "@mui/material/List";
// import CssBaseline from "@mui/material/CssBaseline";
// import Typography from "@mui/material/Typography";
// import Divider from "@mui/material/Divider";
// import IconButton from "@mui/material/IconButton";
// import MenuIcon from "@mui/icons-material/Menu";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import ListItem from "@mui/material/ListItem";
// import ListItemButton from "@mui/material/ListItemButton";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
// import CategoryIcon from "@mui/icons-material/Category";
// import AppsIcon from "@mui/icons-material/Apps";
// import FoundationIcon from "@mui/icons-material/Foundation";
// import { NavLink } from "react-router-dom";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import Switch from "@mui/material/Switch";
// import { ThemeContext } from "../../../context/ThemeContext";
// import LightModeIcon from "@mui/icons-material/LightMode";
// import DarkModeIcon from "@mui/icons-material/DarkMode";
// import QuizIcon from "@mui/icons-material/Quiz";
// import ContentPasteIcon from "@mui/icons-material/ContentPaste";
// import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
// import { useSelector } from "react-redux";
// import BookIcon from "@mui/icons-material/Book";
// import Blog from "../../Container/Blog/Blog";
// import LocalOfferIcon from "@mui/icons-material/LocalOffer";

// export default function Layout({ children }) {
//   const theme = useTheme();
//   const [open, setOpen] = React.useState(false);

//   const drawerWidth = 240;

//   const openedMixin = (theme) => ({
//     width: drawerWidth,
//     transition: theme.transitions.create("width", {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//     overflowX: "hidden",
//   });

//   const closedMixin = (theme) => ({
//     transition: theme.transitions.create("width", {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.leavingScreen,
//     }),
//     overflowX: "hidden",
//     width: `calc(${theme.spacing(7)} + 1px)`,
//     [theme.breakpoints.up("sm")]: {
//       width: `calc(${theme.spacing(8)} + 1px)`,
//     },
//   });

//   const DrawerHeader = styled("div")(({ theme }) => ({
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "flex-end",
//     padding: theme.spacing(0, 1),
//     // necessary for content to be below app bar
//     ...theme.mixins.toolbar,
//   }));

//   const AppBar = styled(MuiAppBar, {
//     shouldForwardProp: (prop) => prop !== "open",
//   })(({ theme }) => ({
//     zIndex: theme.zIndex.drawer + 1,
//     transition: theme.transitions.create(["width", "margin"], {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.leavingScreen,
//     }),
//     variants: [
//       {
//         props: ({ open }) => open,
//         style: {
//           marginLeft: drawerWidth,
//           width: `calc(100% - ${drawerWidth}px)`,
//           transition: theme.transitions.create(["width", "margin"], {
//             easing: theme.transitions.easing.sharp,
//             duration: theme.transitions.duration.enteringScreen,
//           }),
//         },
//       },
//     ],
//   }));

//   const Drawer = styled(MuiDrawer, {
//     shouldForwardProp: (prop) => prop !== "open",
//   })(({ theme }) => ({
//     width: drawerWidth,
//     flexShrink: 0,
//     whiteSpace: "nowrap",
//     boxSizing: "border-box",
//     variants: [
//       {
//         props: ({ open }) => open,
//         style: {
//           ...openedMixin(theme),
//           "& .MuiDrawer-paper": openedMixin(theme),
//         },
//       },
//       {
//         props: ({ open }) => !open,
//         style: {
//           ...closedMixin(theme),
//           "& .MuiDrawer-paper": closedMixin(theme),
//         },
//       },
//     ],
//   }));

//   // const listBox = [
//   //   { label: "Dashboard", icon: <DashboardIcon />, to: "/admin/" },
//   //   { label: "Category", icon: <CategoryIcon />, to: "/admin/category" },
//   //   { label: "Course", icon: <FoundationIcon />, to: "/admin/course" },
//   //   { label: "Section", icon: <AppsIcon />, to: "/admin/section" },
//   //   { label: "Content", icon: <ContentPasteIcon />, to: "/admin/content" },
//   //   { label: "Quiz", icon: <QuizIcon />, to: "/admin/quiz" },
//   //   { label: "Coupon", icon: <ConfirmationNumberIcon />, to: "/admin/coupan" },
//   // ];

//   const auth = useSelector((state) => state.auth);
//   console.log("checklogin", auth?.user?.data);

//   const userRole = auth?.user?.data?.role || auth?.user?.role;

//   let listBox;
//   if (userRole === "instructor") {
//     listBox = [
//       { label: "Course", icon: <FoundationIcon />, to: "/admin/course" },
//       { label: "Section", icon: <AppsIcon />, to: "/admin/section" },
//       { label: "Content", icon: <ContentPasteIcon />, to: "/admin/content" },
//       { label: "Quiz", icon: <QuizIcon />, to: "/admin/quiz" },
//       {
//         label: "Coupon",
//         icon: <ConfirmationNumberIcon />,
//         to: "/admin/coupan",
//       },
//       { label: "Blog", icon: <BookIcon />, to: "/admin/blog" },
//     ];
//   } else {
//     listBox = [
//       { label: "Dashboard", icon: <DashboardIcon />, to: "/admin/" },
//       { label: "Category", icon: <CategoryIcon />, to: "/admin/category" },
//       { label: "Course", icon: <FoundationIcon />, to: "/admin/course" },
//       { label: "Section", icon: <AppsIcon />, to: "/admin/section" },
//       { label: "Content", icon: <ContentPasteIcon />, to: "/admin/content" },
//       { label: "Quiz", icon: <QuizIcon />, to: "/admin/quiz" },
//       {
//         label: "Coupon",
//         icon: <ConfirmationNumberIcon />,
//         to: "/admin/coupan",
//       },
//       { label: "Tag", icon: <LocalOfferIcon />, to: "/admin/tag" },
//       { label: "Blog", icon: <BookIcon />, to: "/admin/blog" },
//     ];
//   }

//   const handleDrawerOpen = () => {
//     setOpen(true);
//   };

//   const handleDrawerClose = () => {
//     setOpen(false);
//   };

//   const Theme = useContext(ThemeContext);
//   console.log(Theme);

//   return (
//     <Box sx={{ display: "flex" }}>
//       <CssBaseline />
//       <AppBar position="fixed" open={open}>
//         <Toolbar>
//           <IconButton
//             color="inherit"
//             aria-label="open drawer"
//             onClick={handleDrawerOpen}
//             edge="start"
//             sx={[
//               {
//                 marginRight: 5,
//               },
//               open && { display: "none" },
//             ]}
//           >
//             <MenuIcon />
//           </IconButton>
//           <Typography variant="h6" noWrap component="div">
//             ELEVATE KNOWLEDGE [Admin Panel]
//           </Typography>

//           <IconButton
//             aria-label="delete"
//             size="large"
//             sx={{ ml: "auto" }}
//             onClick={() => Theme.toggletheme(Theme.theme)}
//           >
//             {Theme.theme === "light" ? <DarkModeIcon /> : <LightModeIcon />}
//           </IconButton>
//         </Toolbar>
//       </AppBar>
//       <Drawer variant="permanent" open={open}>
//         <DrawerHeader>
//           <IconButton onClick={handleDrawerClose}>
//             {theme.direction === "rtl" ? (
//               <ChevronRightIcon />
//             ) : (
//               <ChevronLeftIcon />
//             )}
//           </IconButton>
//         </DrawerHeader>
//         <Divider />

//         <List>
//           {listBox.map((v, index) => (
//             <ListItem
//               key={index}
//               disablePadding
//               sx={{ display: "block" }}
//               component={NavLink}
//               to={v.to}
//             >
//               <ListItemButton
//                 sx={[
//                   {
//                     minHeight: 48,
//                     px: 2.5,
//                   },
//                   open
//                     ? {
//                         justifyContent: "initial",
//                       }
//                     : {
//                         justifyContent: "center",
//                       },
//                 ]}
//               >
//                 <ListItemIcon
//                   sx={[
//                     {
//                       minWidth: 0,
//                       justifyContent: "center",
//                     },
//                     open
//                       ? {
//                           mr: 3,
//                         }
//                       : {
//                           mr: "auto",
//                         },
//                   ]}
//                 >
//                   {v.icon}
//                 </ListItemIcon>
//                 <ListItemText
//                   primary={v.label}
//                   sx={[
//                     open
//                       ? {
//                           opacity: 1,
//                         }
//                       : {
//                           opacity: 0,
//                         },
//                   ]}
//                 />
//               </ListItemButton>
//             </ListItem>
//           ))}
//         </List>
//       </Drawer>
//       <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
//         <DrawerHeader />
//         {children}
//       </Box>
//     </Box>
//   );
// }
