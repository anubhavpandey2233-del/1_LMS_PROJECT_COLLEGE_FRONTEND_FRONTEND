import React, { useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import PrivteRouet from "./PrivteRouet";
import NotFound from "../container/NotFound/NotFound";
import Auth from "../container/Auth/Auth.jsx";
import Header from "../components/Header/Header.jsx";
import Home from "../container/Home/Home.jsx";
import Footer from "../components/Footer/Footer.jsx";
import InstructorDashboard from "../container/InstructorDashboard/InstructorDashboard.jsx";
import { CheackAuth } from "../redux/slice/auth.slice.js";
import { useDispatch } from "react-redux";
import { ThemeContext } from "../context/ThemeContext.jsx";
import Category from "../container/Category/Category.jsx";
import Course from "../container/Course/Course.jsx";
import CourseDetails from "../container/Course/CourseDetails.jsx";
import Quiz from "../container/Quiz/Quiz.jsx";
import CourseVideoPlayer from "../container/Course/CourseVideoPlayer.jsx";
import Cart from "../container/Cart/Cart.jsx";
import About from "../container/About/About.jsx";
import Contact from "../container/Contact/Contact.jsx";
import Pricing from "../container/Pricing/Pricing.jsx";
import Blog from "../container/Blog/Blog.jsx";
import BlogDetail from "../container/Blog/BlogDetail.jsx";
import UserDashboard from "../container/UserDashboard/UserDashboard.jsx";
import Instructor_Create_Course from "../container/InstructorDashboard/Instructor_Create_Course.jsx";
import Instructor_Earning from "../container/InstructorDashboard/Instructor_Earning.jsx";
import Instructor_Order from "../container/InstructorDashboard/Instructor_Order.jsx";
import Instructor_Payout from "../container/InstructorDashboard/Instructor_Payout.jsx";
import Instructor_Review from "../container/InstructorDashboard/Instructor_Review.jsx";
import Instructor_Manage_Course from "../container/InstructorDashboard/Instructor_Manage_Course.jsx";
import Instructor_Single from "../container/InstructorDashboard/Instructor_Single.jsx";
import Instructor_List from "../container/InstructorDashboard/Instructor_List.jsx";
import Instructor_Student_list from "../container/InstructorDashboard/Instructor_Student_list .jsx";
import UserCourseList from "../container/UserDashboard/UserCourseList.jsx";
import UserPaymentInfo from "../container/UserDashboard/UserPaymentInfo.jsx";
import UserWiishlist from "../container/UserDashboard/UserWiishlist.jsx";
import UserEditProfile from "../container/UserDashboard/UserEditProfile.jsx";

function UserRouter() {
  const themedata = useContext(ThemeContext);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(CheackAuth());
  }, []);

  return (
    <div className={themedata.theme}>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/:logtype" element={<Auth />} />

        <Route path="/category" element={<Category />} />
        <Route path="/category/:_id" element={<Category />} />
        <Route path="/course" element={<Course />} />
        <Route path="/course/:_id" element={<Course />} />
        <Route path="/course-details/:_id" element={<CourseDetails />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:_id" element={<Blog />} />
        <Route path="/blog-details/:_id" element={<BlogDetail />} />
        <Route path="/quiz/:_id" element={<Quiz />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="*" element={<NotFound />} />

        <Route
          path="/course-video-player/:_id"
          element={<CourseVideoPlayer />}
        />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/user-course" element={<UserCourseList />} />
        <Route path="/user-paymentinfo" element={<UserPaymentInfo />} />
        <Route path="/user-wishlist" element={<UserWiishlist />} />
        <Route path="/user-profilEdit" element={<UserEditProfile />} />

        <Route path="/instructor-dashboard" element={<InstructorDashboard />} />

        <Route path='/Instructor_Create_Course' element={<Instructor_Create_Course />}></Route>
        <Route path='/Instructor_Create_Course/:id' element={<Instructor_Create_Course />}></Route>
        <Route path='/Instructor_Earning' element={< Instructor_Earning />} ></Route>
        <Route path='/Instructor_Review' element={<Instructor_Review />}></Route>
        <Route path='/Instructor_Manage_Course' element={<Instructor_Manage_Course   />}></Route>
        <Route path='/Instructor_Order' element={<Instructor_Order />}></Route>
        <Route path='/Instructor_Payout' element={<Instructor_Payout />}></Route>
        <Route path='/Instructor_Single' element={<Instructor_Single />}></Route>
        <Route path='/Instructor_List' element={< Instructor_List />} ></Route>
        <Route path='/Instructor_Student_list' element={<Instructor_Student_list />}></Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default UserRouter;
