import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


function withReduxFeach(WrappedComponent, action, Selector) {
    return function withReduxfeach (props) {
        const dispatch = useDispatch(action);

        useEffect(()=> {
            dispatch(action())
        } , [])

        const {isloading, error, ...data} = useSelector(Selector);

        console.log(data);
        
        return(<WrappedComponent {...data} {...props} />)
    }
}

export default withReduxFeach;