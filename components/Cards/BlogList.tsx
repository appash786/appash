import Image from "next/image";
import LineBar from "../LineBar";

const BlogList = ({ lists }: any) => {
  return (
    <div className="w-full flex gap-5 flex-col relative">
      {lists.map((item: any, index: number) => (
        <div key={item.id ?? index}>
          <div className="blog-item w-full flex group xl:px-16 border-b border-gray-300/50  py-5">
            <div className="flex xl:flex-row flex-col px-3">
              <div className="relative aspect-video duration-75 xl:w-[900px] w-full overflow-hidden shadow-md bg-gray-100">
                {/* Tags Container */}
                <div className="absolute right-3 top-3 z-10 flex max-w-[30%] flex-wrap justify-end gap-2">
                  {item.tags.map((tag: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-center rounded bg-amber-100 px-2.5 py-1 shadow-sm text-amber-900"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider">
                        {tag}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="absolute w-full flex items-center justify-center h-full  z-9">
                  <div className="flex flex-col items-center group-hover:opacity-100 opacity-0 duration-700   justify-center ">
                    <Image src={'/Assets/Icons/view.png'} width={32} height={32} style={{ width: '32px', height: 'auto' }} alt="view" />
                    <p className="text-3xl mt-2 font-semibold uppercase">
                      Read
                    </p>
                  </div>
                </div>

                {/* Background Image */}
                <Image
                  className="object-cover  scale-110 duration-500 group-hover:blur-sm group-hover:brightness-70 transition-all "
                  src={item.image}
                  alt="Story thumbnail"
                  fill
                  sizes="500px"
                />
              </div>

              <div className="xl:ml-8 mt-2 xl:mt-0 flex flex-col w-full justify-between">
                <div>
                  <p className="BlackT text-xl max- leading-tight font-medium xl:text-3xl">{item.title}</p>
                  <p className="BlackT text-sm max-w-2xl mt-3 hidden xl:flex opacity-70">
                    It is a long established fact that a reader will be
                    distracted by the readable content of a page when looking at
                    its layout. The point of using Lorem Ipsum is that it has a
                    more-or-less normal distribution of letters, as opposed to
                    using 'Content here, content here', making it look like
                    readable English. Many desktop publishing packages and web
                    page editors now use Lorem Ipsum as their default model
                    text, and a search for 'lorem ipsum' will uncover
                  </p>
                  <p></p>
                </div>
                <p className="BlackT text-gray-500 text-xs mt-2 xl:text-md">{item.readTime}</p>
              </div>

              <div className="w-[5%] flex justify-center items-center">
                <p className="text-black hidden xl:flex">{">"}</p>
              </div>
            </div>
          </div>
          <LineBar />
        </div>
      ))}
    </div>
  );
};

export default BlogList;
