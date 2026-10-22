import React from "react";
import { useSelector } from "react-redux";
import Carousel from "react-material-ui-carousel";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  useGetWhistlistQuery,
  useUpdateWhistlistMutation,
} from "../../redux/Api/wishlist.api";
import { useGetallcourseQuery } from "../../redux/Api/Course.api";
import UserHeader from "./componets/UserHeader";
import UserSildeBar from "./componets/UserSildeBar";

function UserWiishlist() {
  const auth = useSelector((state) => state.auth);

  const { data: wishlist } = useGetWhistlistQuery();
  const { data: course } = useGetallcourseQuery();
  const [updateWhitlist] = useUpdateWhistlistMutation();

  const filterwishlist = wishlist?.data?.find(
    (item) => item.user_id === auth?.user?.data?._id,
  );

  const filtercoure = course?.data?.filter((item) =>
    filterwishlist?.items?.some(
      (wishlistItem) => wishlistItem.course === item._id,
    ),
  );

  const handlewhistlist = async (course_id) => {
    const existData = filterwishlist?.items?.find(
      (item) => item.course === course_id,
    );

    if (existData) {
      const deletdata = filterwishlist?.items.filter(
        (item) => item._id !== existData._id,
      );

      await updateWhitlist({
        _id: filterwishlist._id,
        user_id: auth?.user?.data?._id,
        items: deletdata,
      });
    }
  };

  const handleRemoveall = async () => {
    await updateWhitlist({
      _id: filterwishlist._id,
      user_id: auth?.user?.data?._id,
      items: [],
    });
  };

  return (
    <main>
      <UserHeader />

      <section className="pt-0">
        <div className="container">
          <div className="row">
            <UserSildeBar />

            <div className="col-xl-9">
              <div className="card border rounded-3">
                <div className="card-header border-bottom">
                  <div className="d-sm-flex justify-content-sm-between align-items-center">
                    <div>
                      <h3 className="mb-1">My Wishlist</h3>
                      <p className="mb-0">
                        You have {filtercoure?.length || 0} items in your
                        wishlist
                      </p>
                    </div>

                    <button
                      type="button"
                      className="btn btn-danger-soft mt-3 mt-sm-0"
                      onClick={handleRemoveall}
                      disabled={!filtercoure?.length}
                    >
                      <i className="fas fa-trash me-2" />
                      Remove all
                    </button>
                  </div>
                </div>

                <div className="card-body">
                  {filtercoure?.length ? (
                    <div className="row g-4">
                      {filtercoure.map((item) => (
                        <div
                          className="col-sm-6 col-lg-4"
                          key={item._id}
                        >
                          <div className="card h-100 shadow">
                            <Carousel
                              autoPlay={false}
                              animation="slide"
                              indicators={
                                (item?.course_img?.length || 0) > 1
                              }
                              navButtonsAlwaysInvisible={
                                (item?.course_img?.length || 0) <= 1
                              }
                            >
                              {item?.course_img?.map((image, index) => (
                                <img
                                  key={image?._id || image?.url || index}
                                  src={image?.url}
                                  className="card-img-top"
                                  alt={item?.desciption || "Course"}
                                  style={{
                                    height: "180px",
                                    objectFit: "cover",
                                  }}
                                />
                              ))}
                            </Carousel>

                            <div className="card-body pb-0">
                              <div className="d-flex justify-content-end mb-2">
                                <button
                                  type="button"
                                  className="btn btn-link text-danger p-0"
                                  onClick={() =>
                                    handlewhistlist(item._id)
                                  }
                                  aria-label="Remove course from wishlist"
                                >
                                  <FavoriteIcon />
                                </button>
                              </div>

                              <h5 className="card-title fw-normal">
                                {item.desciption}
                              </h5>

                              <ul className="list-inline mb-0">
                                <li className="list-inline-item me-0 small">
                                  <i className="fas fa-star text-warning" />
                                </li>
                                <li className="list-inline-item me-0 small">
                                  <i className="fas fa-star text-warning" />
                                </li>
                                <li className="list-inline-item me-0 small">
                                  <i className="fas fa-star text-warning" />
                                </li>
                                <li className="list-inline-item me-0 small">
                                  <i className="fas fa-star text-warning" />
                                </li>
                                <li className="list-inline-item me-0 small">
                                  <i className="fas fa-star-half-alt text-warning" />
                                </li>
                                <li className="list-inline-item ms-2 h6 fw-light mb-0">
                                  4.5/5.0
                                </li>
                              </ul>
                            </div>

                            <div className="card-footer pt-0 pb-3">
                              <hr />
                              <div className="d-flex justify-content-between">
                                <span className="h6 fw-light mb-0">
                                  <i className="far fa-clock text-danger me-2" />
                                  9h 56m
                                </span>
                                <span className="h6 fw-light mb-0">
                                  <i className="fas fa-table text-orange me-2" />
                                  65 lectures
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <i className="bi bi-heart display-4 text-muted" />
                      <h5 className="mt-3 mb-1">Your wishlist is empty</h5>
                      <p className="text-muted mb-0">
                        Courses added to your wishlist will appear here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default UserWiishlist;
