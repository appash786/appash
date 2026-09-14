import Image from "next/image";
import React from "react";
import DecryptedText from "../Text/DecryptedText";

const Brief = () => {
  return (
    <section className="w-full z-6 h-screen ">
      <div className="flex justify-center items-center h-full">
        <p className="text-black z-6 font-semibold text-center leading-39 text-[11rem]">
          EVERY FRAME <br />{" "}
          <span className="font-bold text-[#A50000]">
            {" "}
            <DecryptedText
              text="TELLS A STORY."
              animateOn="inViewHover"
              revealDirection="center"
              sequential
              speed={80}
              maxIterations={12}
            />
          </span>
          <br />
          EVERY PIXEL HAS <br />{" "}
          <span className="font-bold text-[#A50000]">            <DecryptedText
              text="A PURPOSE."
              animateOn="inViewHover"
              revealDirection="center"
              sequential
              speed={80}
              maxIterations={12}
            /></span>
        </p>
      </div>
    </section>
  );
};

export default Brief;
