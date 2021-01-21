import React from "react";
import HeaderContainer from "./HeaderContainer.js";


const BusyView = () => {
  return <>
    <HeaderContainer
      rightContent={null}
    />
    <main>
      <section id="section_busy">
        <img
          style={{
            width: "100px",
          }}
          src={"/assets/icons/pending-24px.svg"}
          alt={"Loading ..."}
          className="svg-icon"
        />
        <p>Loading ...</p>
      </section>
    </main>
  </>;
};

export default BusyView;
