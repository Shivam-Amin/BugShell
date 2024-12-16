import React from "react";
import ReactLoading from "react-loading";
import '../css/loading.css'

const Loading = ({clr, children}) => {
  // const {loading} = useContext(Context)
  const color = (clr) ? clr : '#fff'
  return (
    <div className="loading">
      <ReactLoading className="icon" type="bubbles" color={color}
        height={100} width={50} />
      {children}
    </div>
  );
}

export default Loading;