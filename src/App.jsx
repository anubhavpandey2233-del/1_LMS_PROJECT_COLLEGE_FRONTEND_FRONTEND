import React from "react";
import "./App.css";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { Route, Routes } from "react-router-dom";
import UserRouter from "./router/UserRouter.jsx";
import AdminRouet from "./router/AdminRouet.jsx";
import PrivteRouet from "./router/PrivteRouet.jsx";
import { SnackbarContent, SnackbarProvider } from "notistack";
import Alert from "./components/Alert/Alert.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
// import Product from './container/Product/Product';
// import Mui from './components/mui';
// import User from './container/User/User'
// import User1 from './container/User/User1';

function App() {
  return (
    <SnackbarProvider>
      <ThemeProvider>
        <Provider store={store}>
          <Alert />
          <Routes>
            <Route path="/*" element={<UserRouter />} />

            {/* <Route element={<PrivteRouet />}> */}
            <Route path="/admin/*" element={<AdminRouet />} />
            {/* </Route>   */}
          </Routes>
        </Provider>
      </ThemeProvider>
    </SnackbarProvider>
  );
}

export default App;
