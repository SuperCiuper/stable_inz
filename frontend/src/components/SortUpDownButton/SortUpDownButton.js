import React from "react";
import "./SortUpDownButton.css";
import arrowImg from "../../assets/images/arrow.png";

const SortUpDownButton = ({
  size = "2rem",
  sortedDown = true,
  setSortedDown,
  children,
}) => {
  return (
    <div className={`SortUpDownButton${sortedDown ? "-down" : "-up"}`}>
      {children}
      <button
        style={{ width: size, height: size }}
        onClick={(event) => {
          setSortedDown(!sortedDown);
        }}
      >
        <img src={arrowImg} alt="Arrow" />
      </button>
    </div>
  );
};

export default SortUpDownButton;
