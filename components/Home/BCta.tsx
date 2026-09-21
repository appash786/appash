import Image from "next/image";
import React from "react";
import DecryptedText from "../Text/DecryptedText";
import BlockReveal from "../Text/BlockReveal";
const BCta = () => {
  return (
    <section className="w-full z-6 h-screen ">
      <div className="flex justify-center items-center h-full">
        <p className="text-black z-6 font-semibold text-center leading-39 text-[11rem]">
          <BlockReveal
            className=" text-black block"
            color="#A50000"
            delay={0.15}
            duration={1.2}
          >
            <p className=" text-black block uppercase">BUT i’m HERE</p>
          </BlockReveal>
          <br />{" "}
          <span className="font-bold text-[#A50000]">
            {" "}
            <BlockReveal
              className=" text-black block"
              color="#A50000"
              delay={0.15}
              duration={1.2}
            >
              <p className=" text-[#A50000] block uppercase ">NOT TO TALK</p>
            </BlockReveal>

          </span>
          <br />
                      <BlockReveal
              className=" text-black block"
              color="#A50000"
              delay={0.15}
              duration={1.2}
            >
              <p className=" text-black block uppercase "> ABOUT mySELF </p>
            </BlockReveal>
         <br />{" "}
          
        </p>
      </div>
    </section>
  );
};

export default BCta;
