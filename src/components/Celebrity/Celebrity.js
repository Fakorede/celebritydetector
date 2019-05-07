import React from "react";

const Celebrity = ({ stats }) => {
  return (
    <div className="center ma">
      <h3>
        {"The celebrity in the uploaded image is: "}
        {stats.value}
        {"%"} {stats.name}
      </h3>
    </div>
  );
};

export default Celebrity;
