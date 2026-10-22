import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  ProgressBar } from "react-loader-spinner";

function withReduxFeach(WrappedComponent, action, Selector) {
  return function withReduxfeach(props) {
    const dispatch = useDispatch(action);

    useEffect(() => {
      dispatch(action());
    }, []);

    const { isloading, error, ...data } = useSelector(Selector);

    if (isloading) {
      return (
        <div style={{display:'flex', justifyContent:'center'}}>
          <ProgressBar
            visible={isloading}
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="progress-bar-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      );
    }

    if (error) {
      return (
        <div
          style={{
            background: "red",
            padding: "15px",
            width: "fit-content",
            borderRadius: "5px",
            marginLeft: "18px",
          }}
        >
          {error}
        </div>
      );
    }

    return <WrappedComponent {...data} {...props} />;
  };
}

export default withReduxFeach;
