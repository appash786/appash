import BlockReveal from "../Text/BlockReveal";

const Brief = () => {
  return (
    <section className="w-full px-4 z-6 xl:h-screen flex  items-center justify-center  min-h-[30vh] ">
      <div className="flex justify-center -500 items-center h-full">
        {/* Changed from <p> to <div> to allow nested block elements */}
        <div className="text-black z-6 font-semibold text-center leading-10 xl:leading-27 text-[2.5rem] xl:text-[9rem]">
          <BlockReveal
            className="text-black block"
            color="#A50000"
            delay={0.15}
            duration={1.2}
          >
            {/* Changed from <p> to <span> to prevent paragraph nesting */}
            <span className="text-black block">EVERY FRAME</span>
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
              <span className="text-[#A50000] block">TELLS A STORY.</span>
            </BlockReveal>
          </span>
          <br />
          <BlockReveal
            duration={1.2}
            className="text-black block"
            color="#A50000"
            delay={0.15}
          >
            <span className="text-black block"> EVERY PIXEL HAS </span>
          </BlockReveal>
          <br />{" "}
          <span className="font-bold ">
            {" "}
            <BlockReveal
              duration={1.2}
              className="text-black block"
              color="#A50000"
              delay={0.15}
            >
              <span className="text-[#A50000] block"> A PURPOSE. </span>
            </BlockReveal>
          </span>
        </div>
      </div>
    </section>
  );
};

export default Brief;