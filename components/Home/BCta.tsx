import BlockReveal from "../Text/BlockReveal";

const BCta = () => {
  return (
    <section className="w-full z-6 h-[30vh] xl:h-screen ">
      <div className="flex justify-center xl:items-center h-full">
        {/* Changed from <p> to <div> to allow nested block elements */}
        <div className="text-black z-6 font-semibold text-center text-[3rem] leading-[1] xl:leading-39 xl:text-[11rem]">
          <BlockReveal
            className="text-black block"
            color="#A50000"
            delay={0.15}
            duration={1.2}
          >
            {/* Changed from <p> to <span> */}
            <span className="text-black block uppercase">BUT i’m HERE</span>
          </BlockReveal>
          <br />{" "}
          <span className="font-bold text-[#A50000]">
            {" "}
            <BlockReveal
              className="text-black block"
              color="#A50000"
              delay={0.15}
              duration={1.2}
            >
              <span className="text-[#A50000] block uppercase ">NOT TO TALK</span>
            </BlockReveal>
          </span>
          <br />
          <BlockReveal
            className="text-black block"
            color="#A50000"
            delay={0.15}
            duration={1.2}
          >
            <span className="text-black block uppercase xl:text-[11rem] text-[2.6rem]"> ABOUT mySELF </span>
          </BlockReveal>
          <br />{" "}
        </div>
      </div>
    </section>
  );
};

export default BCta;