
import Bloglist from "@/components/Cards/BlogList";

const Blogs = () => {

  const BlogsData = [
    {
      id: 1,
      text: "Productivity", // Keeping this as your main category
      title: "10 Habits of Highly Effective Developers",
      image: "/Assets/Images/image_1.webp",
      readTime: "5 min read",
      tags: ["Focus", "Career", "Habits"],
    },
    {
      id: 2,
      text: "Web Design",
      title: "Mastering UI/UX: A Guide for Beginners",
      image: "/Assets/Images/Image_2.webp",
      readTime: "8 min read",
      tags: ["Figma", "UI/UX", "CSS"],
    },
    {
      id: 3,
      text: "Lifestyle",
      title: "How to Balance Remote Work and Personal Life",
      image: "/Assets/Images/Image_3.webp",
      readTime: "4 min read",
      tags: ["Remote", "Mental Health", "Wellness"],
    },
    {
      id: 4,
      text: "Technology",
      title: "The Future of AI in Modern Applications",
      image: "/Assets/Images/Image_2.webp",
      readTime: "10 min read",
      tags: ["Machine Learning", "Tech Trends", "OpenAI"],
    }
  ];
  return (
    <section className="relative w-screen overflow-hidden select-none py-12">
      <div className="w-full h-full flex flex-col relative z-10">
        <div className="w-full border-t border-b py-5 border-[#29221a46] px-6 sm:px-12 md:px-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 xl:gap-6">
          <p className="BlackT uppercase  tracking-tight text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[100px] leading-[0.95] text-left">
            Blogs
          </p>

          <p className="w-full BlackT md:w-[30%] lg:w-[25%] text-white/80 text-left md:text-right text-base sm:text-lg md:text-xl font-light leading-tight">
            Featured works showcasing interactive 3D web experiences and modern
            applications.
          </p>
        </div>


            <Bloglist  lists={BlogsData}  />
    
      </div>
    </section>
  );
};

export default Blogs;
