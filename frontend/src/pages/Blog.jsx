import React from 'react';
import { FiSearch, FiCalendar, FiUser, FiMessageSquare } from 'react-icons/fi';
import blog1 from '../assets/blog-img1.jpg';
import blog2 from '../assets/blog-img2.jpg';
import blog3 from '../assets/blog-img3.jpg';
import blog4 from '../assets/blog-img4.jpg';
import blog5 from '../assets/blog-img5.jpg';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      date: '07',
      month: 'JAN',
      title: 'Best Study Spots on Campus',
      image: blog1,
      tags: ['ADMISSIONS', 'SCHOLARSHIPS', 'READ MORE'],
      desc: 'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Morbi bibendum imperdiet bibendum. Etiam eget enim non magna vestibulum malesuada ut et lectus.',
    },
    {
      id: 2,
      date: '12',
      month: 'JAN',
      title: 'Essays of Student Events on Campus',
      image: blog2,
      tags: ['ADMISSIONS', 'SCHOLARSHIPS', 'READ MORE'],
      desc: 'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Morbi bibendum imperdiet bibendum. Etiam eget enim non magna vestibulum malesuada ut et lectus.',
    },
    {
      id: 3,
      date: '15',
      month: 'JAN',
      title: 'Annual Project Highlights',
      image: blog3,
      tags: ['ADMISSIONS', 'SCHOLARSHIPS', 'READ MORE'],
      desc: 'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Morbi bibendum imperdiet bibendum. Etiam eget enim non magna vestibulum malesuada ut et lectus.',
    },
    {
      id: 4,
      date: '20',
      month: 'JAN',
      title: 'Sample Semester Schedule',
      image: blog4,
      tags: ['ADMISSIONS', 'SCHOLARSHIPS', 'READ MORE'],
      desc: 'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Morbi bibendum imperdiet bibendum. Etiam eget enim non magna vestibulum malesuada ut et lectus.',
    },
    {
      id: 5,
      date: '25',
      month: 'JAN',
      title: 'Experience of Studying Abroad',
      image: blog5,
      tags: ['ADMISSIONS', 'SCHOLARSHIPS', 'READ MORE'],
      desc: 'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Morbi bibendum imperdiet bibendum. Etiam eget enim non magna vestibulum malesuada ut et lectus.',
    },
  ];

  return (
    <div className="bg-white font-sans w-full flex flex-col">
      {/* Search Bar Strip (Matches About/Reference Style) */}
      <div className="bg-[#002147] py-[16px] px-4 w-full border-b border-[#001b3a]">
        <div className="max-w-[750px] mx-auto flex h-[52px] shadow-sm">
          <div className="flex-1 relative flex items-center bg-white rounded-l-sm overflow-hidden">
            <FiSearch className="text-[#999] w-[18px] h-[18px] ml-5 flex-shrink-0" />
            <input 
              type="text" 
              placeholder="Search Course And Discount Courses"
              className="w-full py-2 px-4 text-[15px] text-[#555] outline-none h-full bg-transparent placeholder-[#999]"
            />
          </div>
          <button className="bg-[#f16126] text-white px-8 md:px-10 h-full text-[14px] font-semibold uppercase tracking-wide rounded-r-sm hover:bg-[#de551e] transition-colors flex-shrink-0">
            Search Course
          </button>
        </div>
      </div>

      <div className="max-w-[1140px] mx-auto px-4 py-20 pb-24">
        {/* Header */}
        <div className="text-center mb-24 space-y-4">
          <h1 className="text-[42px] font-bold tracking-tight">
            <span className="text-[#002147]">Blog </span>
            <span className="text-[#f16126]">Posts</span>
          </h1>
          <p className="text-[#64748b] max-w-4xl mx-auto text-[15px] leading-relaxed italic">
            Stay updated with the latest trends in education, campus life, and learning strategies with Mye3-e-Tuitions blog posts.
          </p>
        </div>

        {/* Blog Posts List */}
        <div className="space-y-32">
          {blogPosts.map((post) => (
            <div key={post.id} className="relative group max-w-[850px] mx-auto">
              
              {/* Title */}
              <h2 className="text-[26px] font-bold text-[#002147] mb-6 hover:text-[#f16126] cursor-pointer transition-colors mt-2">
                {post.title}
              </h2>

              {/* Featured Image */}
              <div className="overflow-hidden bg-[#f8fafc] mb-8 cursor-pointer shadow-sm border border-slate-100">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Post Metadata Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                 <span className="bg-[#4a69bd] text-white text-[11px] font-bold px-3 py-1.5 uppercase rounded-sm">ADMISSIONS</span>
                 <span className="bg-[#1dd1a1] text-white text-[11px] font-bold px-3 py-1.5 uppercase rounded-sm">SCHOLARSHIPS</span>
                 <span className="bg-[#ee5253] text-white text-[11px] font-bold px-3 py-1.5 uppercase rounded-sm whitespace-nowrap">READ MORE</span>
              </div>

              {/* Description */}
              <p className="text-[14.5px] text-[#666] leading-[1.8] mb-8 pr-4">
                {post.desc}
              </p>

              {/* "Read more" Button (Reference Style) */}
              <button className="bg-[#f16126] text-white px-8 py-2.5 text-[13px] font-bold uppercase rounded-sm hover:bg-[#de551e] transition-all shadow-md active:scale-95">
                Read more
              </button>
            </div>
          ))}
        </div>

        {/* Pagination Bar */}
        <div className="mt-28 flex justify-center items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-sm border border-slate-200 text-[#002147] font-bold hover:bg-[#f16126] hover:text-white transition-all shadow-sm">1</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-sm border border-slate-200 text-[#002147] font-bold hover:bg-[#f16126] hover:text-white transition-all shadow-sm">2</button>
          <button className="px-5 h-10 flex items-center justify-center rounded-sm border border-slate-200 text-[#002147] font-bold hover:bg-[#f16126] hover:text-white transition-all shadow-sm">NEXT</button>
        </div>
      </div>

      {/* Orange Banner Section (Same as About) */}
      <div className="bg-[#f06522] py-[55px] px-4">
        <div className="max-w-[1140px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-14">
          
          <div className="flex items-center gap-6 md:gap-14 md:w-3/4">
            {/* Perfectly matched bulb icon from reference */}
            <div className="relative flex-shrink-0 w-[80px] h-[80px] flex items-center justify-center">
              {/* Rays (8 Lines) */}
              <div className="absolute inset-0">
                {[0, 45, 90, 135, 180, 225, 270, 315].map((degree) => (
                  <div 
                    key={degree}
                    className="absolute top-1/2 left-1/2 w-[12px] h-[2.5px] bg-[#fbc02d] rounded-full"
                    style={{ 
                      transform: `translate(-50%, -50%) rotate(${degree}deg) translate(32px)` 
                    }}
                  ></div>
                ))}
              </div>
              
              {/* Bulb SVG - precise shape with glare and base */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-[42px] h-[42px] bg-[#fbc02d] rounded-full relative">
                  {/* Glare */}
                  <div className="absolute top-[6px] left-[8px] w-[8px] h-[12px] border-l-[3px] border-t-[3px] border-white/40 rounded-tl-full"></div>
                </div>
                <div className="w-[18px] h-[12px] bg-[#34495e] mt-[-3px] flex flex-col gap-[2px] items-center py-[1px] rounded-b-sm">
                  <div className="w-full h-[2px] bg-black/20"></div>
                  <div className="w-[80%] h-[2px] bg-black/20"></div>
                  <div className="w-[60%] h-[2px] bg-black/20"></div>
                </div>
              </div>
            </div>
            
            <div className="text-white">
              <h2 className="text-[20px] md:text-[27px] font-bold uppercase mb-2 tracking-wide">
                Therefore Always Free From Repetition
              </h2>
              <p className="text-white/95 text-[14px] md:text-[15px] leading-relaxed max-w-2xl">
                There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.
              </p>
            </div>
          </div>
          <div className="md:w-1/4 flex md:justify-end w-full pl-24 md:pl-0">
            <button className="border-[1.5px] border-white text-white font-medium px-8 py-[12px] text-[14.5px] rounded-[30px] hover:bg-white hover:text-[#f06522] transition-colors shadow-sm tracking-wide whitespace-nowrap">
              Book This Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
