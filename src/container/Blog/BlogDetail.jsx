import React, { useEffect, useState } from "react";
import {
  useGetBlogQuery,
  useUpdateBlogMutation,
} from "../../redux/Api/blog.api";
import { NavLink, useParams } from "react-router-dom";
import Carousel from "react-material-ui-carousel";
import DOMPurify from "dompurify";
import { useGettagQuery } from "../../redux/Api/tag.api";
// Premium Material UI Icons for meta info and sidebar
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ForumIcon from "@mui/icons-material/Forum";
import ReplyIcon from "@mui/icons-material/Reply";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import {
  useAddlikeMutation,
  useGetlikeQuery,
  useUpdatelikeMutation,
} from "../../redux/Api/like.api";
import { useSelector } from "react-redux";
import {
  useAddcommentMutation,
  useDeletecommentMutation,
  useGetcommentQuery,
  useUpdatecommentMutation,
} from "../../redux/Api/blogComment.api";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

function BlogDetail(props) {
  const param = useParams();

  const auth = useSelector((state) => state.auth);
  console.log("checklogin", auth?.user?.data);

  const { data: blog } = useGetBlogQuery();
  console.log(blog?.data);

  const [updateblog] = useUpdateBlogMutation();

  const blogdata = blog?.data?.find((v) => v._id === param?._id);
  console.log("blogdata", blogdata);

  const { data: tag } = useGettagQuery();

  const tagname = tag?.data?.find((v) => v?._id === blogdata?.tag);
  console.log("name", tagname);

  const relatedBlogs =
    blog?.data?.filter((v) => v._id !== param?._id)?.slice(0, 3) || [];

  const cleanHtml = DOMPurify.sanitize(blogdata?.content);

  const totalword = blogdata?.content?.split(" ").length;

  const readingTime = Math.ceil(totalword / 200);

  const { data: like } = useGetlikeQuery();
  console.log("like : ", like?.data);

  const [addlike] = useAddlikeMutation();
  const [updatelike] = useUpdatelikeMutation();

  const exsLikedata = like?.data?.find((v) => v?.blog_id === blogdata?._id);
  console.log("extttt", exsLikedata);

  const extlike = exsLikedata?.user_id.some((v) => v === auth?.user?.data?._id);

  const handlelike = () => {
    const user = auth?.user?.data?._id;

    if (!user) {
      console.log("do login");
      return;
    }

    if (extlike) {
      console.log("Already Liked");
      updatelike({
        _id: exsLikedata._id,
        like: exsLikedata.like - 1,
        user_id: exsLikedata.user_id.filter((v) => v !== user),
        blog_id: blogdata,
      });
      return;
    }

    if (exsLikedata) {
      updatelike({
        _id: exsLikedata._id,
        like: exsLikedata.like + 1,
        user_id: [...exsLikedata.user_id, user],
        blog_id: blogdata,
      });
    } else {
      addlike({
        user_id: user,
        blog_id: blogdata._id,
        like: 1,
      });
    }
  };

  const { data: comment } = useGetcommentQuery();
  console.log("comment", comment?.data);

  const [addcomment] = useAddcommentMutation();
  const [updatecomment] = useUpdatecommentMutation();
  const [deletecomment] = useDeletecommentMutation();

  const [commentText, setCommentText] = useState("");

  const blogComments = comment?.data?.filter(
    (v) => v.blog_id === blogdata?._id,
  );

  const handleCommentSubmit = () => {
    event.preventDefault();
    const user = auth?.user?.data?._id;

    if (!user) {
      alert("Please log in to add a comment.");
      return;
    }

    addcomment({
      user_id: user,
      blog_id: blogdata?._id,
      description: commentText,
    });

    setCommentText("");
  };

  return (
    <div>
      <main>
        {/* =======================
        Page intro START */}
        <section className="bg-light py-4 py-sm-5">
          <div className="container">
            {/* Back Button */}
            <div className="mb-3">
              <NavLink
                to="/blog"
                className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-2 rounded-pill px-3"
              >
                <ArrowBackIcon style={{ fontSize: "1rem" }} /> Back to Blogs
              </NavLink>
            </div>

            <div className="row align-items-center">
              <div className="col-12">
                {/* Badge */}
                {tagname?.tag && (
                  <span className="badge bg-success text-white mb-2 py-2 px-3 rounded-2 fs-6">
                    {tagname.tag}
                  </span>
                )}
                {/* Title */}
                <h1 className="mb-3 display-5">
                  {blogdata?.title || "Loading Blog..."}
                </h1>
                <p className="lead mb-4">{blogdata?.description}</p>

                {/* Meta tags */}
                <ul className="list-inline mb-0 text-muted small">
                  <li className="list-inline-item me-3">
                    <PersonIcon
                      style={{ fontSize: "1.1rem" }}
                      className="me-1 align-middle text-primary"
                    />
                    By{" "}
                    <strong>
                      {blogdata?.instructor?.name || "Eduport Writer"}
                    </strong>
                  </li>
                  <li className="list-inline-item me-3">
                    <CalendarTodayIcon
                      style={{ fontSize: "1rem" }}
                      className="me-1 align-middle text-primary"
                    />
                    {blogdata?.date || "Date unavailable"}
                  </li>
                  <li className="list-inline-item me-3">
                    <AccessTimeIcon
                      style={{ fontSize: "1.1rem" }}
                      className="me-1 align-middle text-primary"
                    />
                    {readingTime} min read
                  </li>
                  <li className="list-inline-item">
                    <VisibilityIcon
                      style={{ fontSize: "1.1rem" }}
                      className="me-1 align-middle text-primary"
                    />
                    2.5K views
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        {/* Page intro END */}

        {/* =======================
        Main Content START */}
        <section className="pb-0 py-lg-5">
          <div className="container">
            <div className="row g-4">
              {/* Left Column: Post content and comments */}
              <div className="col-lg-8">
                {/* Blog content card */}
                <div className="card shadow p-4 mb-4">
                  {/* Featured Image Carousel */}
                  {blogdata?.content_file &&
                    blogdata.content_file.length > 0 && (
                      <div className="mb-4 rounded-3 overflow-hidden">
                        <Carousel
                          navButtonsAlwaysVisible={
                            blogdata.content_file.length > 1
                          }
                          indicators={blogdata.content_file.length > 1}
                          animation="slide"
                          duration={600}
                        >
                          {blogdata.content_file.map((v, i) => (
                            <img
                              key={i}
                              src={v?.url}
                              className="img-fluid w-100"
                              style={{ maxHeight: "480px", objectFit: "cover" }}
                              alt={`Blog visual ${i + 1}`}
                            />
                          ))}
                        </Carousel>
                      </div>
                    )}
                  {/* Quote and content START */}
                  <div className="row mt-4">
                    {/* Content */}
                    <div className="col-12 mt-4 mt-lg-0">
                      <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
                    </div>
                  </div>
                  {/* Quote and content END */}
                  <hr className="my-4" />

                  {/* Tags & Share Box */}
                  <div className="d-lg-flex justify-content-lg-between align-items-center mb-0">
                    {/* Popular Tags */}
                    <div className="mb-3 mb-lg-0">
                      <h6 className="mb-2 me-4 d-inline-block">
                        Popular Tags:
                      </h6>
                      <ul className="list-inline mb-0 d-inline-block">
                        {tag?.data?.map((v) => (
                          <li className="list-inline-item" key={v._id}>
                            <NavLink
                              to={`/blog/${v._id}`}
                              className="btn btn-outline-light btn-sm mb-lg-0"
                            >
                              {v?.tag}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Social Media Share */}
                    <div className="align-items-center">
                      <h6 className="mb-2 me-4 d-inline-block">Share on:</h6>
                      <ul className="list-inline mb-0">
                        <li className="list-inline-item">
                          <a
                            className="btn px-2 btn-sm bg-facebook text-white"
                            href="#"
                            aria-label="Share on Facebook"
                          >
                            <FacebookIcon style={{ fontSize: "1rem" }} />
                          </a>
                        </li>
                        <li className="list-inline-item">
                          <a
                            className="btn px-2 btn-sm bg-instagram text-white"
                            href="#"
                            aria-label="Share on Instagram"
                          >
                            <InstagramIcon style={{ fontSize: "1rem" }} />
                          </a>
                        </li>
                        <li className="list-inline-item">
                          <a
                            className="btn px-2 btn-sm bg-twitter text-white"
                            href="#"
                            aria-label="Share on Twitter"
                          >
                            <TwitterIcon style={{ fontSize: "1rem" }} />
                          </a>
                        </li>
                        <li className="list-inline-item">
                          <a
                            className="btn px-2 btn-sm bg-linkedin text-white"
                            href="#"
                            aria-label="Share on LinkedIn"
                          >
                            <LinkedInIcon style={{ fontSize: "1rem" }} />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="card shadow p-4 mb-4">
                  <h3 className="mb-4">
                    <ForumIcon className="me-2 text-primary" />{" "}
                    {blogComments?.length} Comments
                  </h3>

                  {blogComments?.map((c) => {
                    return (
                      <div
                        className="d-flex mb-4 align-items-start"
                        key={c._id}
                      >
                        <img
                          className="avatar avatar-md rounded-circle me-3 flex-shrink-0"
                          src="../../../public/assets/images/avatar/01.jpg"
                          alt={c.user_id.name}
                          style={{
                            width: "48px",
                            height: "48px",
                            objectFit: "cover",
                          }}
                        />

                        <div className="w-100">
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <div>
                              <h5 className="m-0">{c.user_id.name}</h5>
                              <h6 className="text-secondary mb-2">
                                {c.description}
                              </h6>
                            </div>

                            {auth?.user?.data?._id === c.user_id?._id && (
                              <button
                                type="button"
                                className="btn btn-sm btn-link text-danger text-decoration-none p-0 mb-0"
                                onClick={() => deletecomment(c._id)}
                              >
                                Delete
                              </button>
                            )}
                          </div>

                          <a
                            href="#"
                            className="btn btn-sm btn-light mb-0 py-1 px-3 rounded-pill"
                          >
                            <ReplyIcon
                              style={{ fontSize: "0.9rem" }}
                              className="me-1"
                            />
                            Reply
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Comment Form Section */}
                {blogComments?.some(
                  (c) => c.user_id?._id === auth?.user?.data?._id,
                ) ? (
                  " "
                ) : (
                  <div className="card shadow p-4">
                    <h3 className="mb-1">Your Views Please!</h3>

                    <form className="row g-3" onSubmit={handleCommentSubmit}>
                      <div className="col-12">
                        <label className="form-label">Your Comment *</label>
                        <textarea
                          className="form-control"
                          rows={4}
                          placeholder="Join the discussion..."
                          required
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                        />
                      </div>
                      <div className="col-12">
                        <button
                          type="submit"
                          className="btn btn-primary mb-0 mt-2"
                        >
                          Post Comment
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              {/* Right Column: Sidebar */}
              <div className="col-lg-4">
                <div
                  className="row g-4 sticky-lg-top"
                  style={{ top: "20px", zIndex: 1 }}
                >
                  {/* Author card */}
                  <div className="col-12">
                    <div className="card shadow text-center p-4">
                      <div className="position-relative mb-3">
                        <div className="avatar avatar-xxl mx-auto">
                          <img
                            className="avatar-img rounded-circle border border-white border-3 shadow"
                            src="../../../public/assets/images/avatar/08.jpg"
                            alt={blogdata?.instructor?.name || "Author Avatar"}
                            style={{
                              width: "110px",
                              height: "110px",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      </div>
                      <h5 className="mb-1">
                        <a
                          href="#"
                          className="text-decoration-none text-dark-hover"
                        >
                          {blogdata?.instructor?.name || "Eduport Writer"}
                        </a>
                      </h5>
                      <p className="mb-3 text-muted small">Editor at Eduport</p>

                      {/* Author stats */}
                      <div className="d-flex justify-content-center gap-2">
                        <span
                          className="badge bg-danger bg-opacity-10 text-danger px-2.5 py-1.5 rounded"
                          onClick={() => handlelike()}
                        >
                          {extlike ? (
                            <FavoriteIcon
                              fontSize="small"
                              className="me-1 align-middle"
                            />
                          ) : (
                            <FavoriteBorderIcon
                              fontSize="small"
                              className="me-1 align-middle"
                            />
                          )}{" "}
                          {exsLikedata?.like} Likes
                        </span>
                        <span className="badge bg-info bg-opacity-10 text-info px-2.5 py-1.5 rounded">
                          <VisibilityIcon
                            fontSize="small"
                            className="me-1 align-middle"
                          />{" "}
                          {blogdata.view} Views
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Related Reads card */}
                  {relatedBlogs.length > 0 && (
                    <div className="col-12">
                      <div className="card shadow p-4">
                        <h4 className="mb-3 border-bottom pb-2">
                          Related Reads
                        </h4>
                        <div className="d-flex flex-column gap-3">
                          {relatedBlogs.map((b) => (
                            <div
                              className="d-flex align-items-center gap-3 border-bottom pb-3 last-border-none"
                              key={b._id}
                            >
                              {b.content_file?.[0]?.url && (
                                <NavLink
                                  to={`/blog-details/${b._id}`}
                                  className="flex-shrink-0 zoom-hover-link"
                                >
                                  <img
                                    className="rounded"
                                    src={b.content_file[0].url}
                                    style={{
                                      width: "80px",
                                      height: "60px",
                                      objectFit: "cover",
                                    }}
                                    alt={b.title}
                                  />
                                </NavLink>
                              )}
                              <div>
                                <NavLink
                                  to={`/blog-details/${b._id}`}
                                  className="h6 text-decoration-none text-truncate-2 d-block mb-1"
                                >
                                  {b.title}
                                </NavLink>
                                <span className="small text-muted">
                                  {b.date}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Main Content END */}
      </main>
    </div>
  );
}

export default BlogDetail;
