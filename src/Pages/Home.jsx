import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ChevronDown } from 'lucide-react';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const faqs = [
  {
    question: "What material are the personalized T-shirts made of?",
    answer:
      "We offer cotton, blend, and polyester options. Our soft-touch custom tees are made of 100% ringspun cotton, which is more breathable and feels softer. We also have personalized T-shirts made from performance fabric, which is moisture-wicking for maximum comfort.",
  },
  {
    question: "What sizes are the T-shirts available in?",
    answer:
      "Adults' T-shirts from VistaPrint are available in XXS – 5XL. We also offer kids' sizes. To find the exact length and width of each size, check our size charts tab on the T-shirt page of your choice.",
  },
  {
    question: "Can I print my artwork or design onto the T-shirts?",
    answer:
      "Yes, of course. To make your own T-shirt, you can upload your design to the front of your tee and add custom elements like text. For some of our personalized T-shirts, reverse side printing is also available.",
  },
  {
    question: "Is there a minimum order quantity for custom T-shirts?",
    answer:
      "There is no minimum order quantity for T-shirts printed with direct-to-garment or heat transfer printing options. For screenprint T-shirts, the minimum order quantity is 6.",
  },
];

const Home = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <div className="bg-white">
        {/* Hero Section with Carousel */}
        <div className="h-auto w-screen">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            loop={true}
            className="w-screen h-auto"
          >
            {["Hero", "Hero1", "Hero2"].map((img, index) => (
              <SwiperSlide key={index}>
                <img
                  className="w-screen h-auto object-cover"
                  src={`/Home Assets/${img}.svg`}
                  alt={`Hero ${index}`}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Custom T-Shirts Section */}
        <div className="w-full py-20 px-10 md:px-47 bg-orange-100 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl font-semibold text-gray-800">
              Custom T-Shirts
            </h1>
            <p className="text-2xl mt-3">
              Make custom T-shirts that they will be pleased to wear—all at
              prices that fit every budget.
            </p>
            <Link
              to="/shop"
              className="bg-black text-white text-xl hover:bg-orange-300 hover:text-black transition duration-300 rounded-xl px-8 py-4 mt-3 inline-block"
            >
              See all products
            </Link>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/Home Assets/home_picture1.svg"
              className="w-full max-w-md md:max-w-lg lg:max-w-xl h-auto drop-shadow-xl"
              alt="Custom T-Shirts"
            />
          </div>
        </div>

        {/*Parent Container Category*/}
        <div className="w-full py-20 px-10 md:px-20 flex-col md:flex-row justify-between gap-8">
          {/* Text Section */}
          <div className="md:w-1/2 md:text-left text-center ml-28 mt-7">
            <h1
              className="text-4xl font-semibold text-gray-800 "
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Pick your custom shirt style
            </h1>

            <p
              className="text-2xl/8 mt-3 "
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Our custom T-shirts come in a variety of sleeve and neck styles
              whatever you need, we've got you covered.
            </p>

            {/* Apparel Category Container*/}
            <div className="md:w-full flex justify-between items-center gap-x-75">
              <div className="text-center flex-1 mt-10">
                <img
                  src="/Home Assets/home_img_shortSleeve.svg"
                  className="w-auto max-w-[250px] h-auto drop-shadow-xl mx-auto"
                  alt="Short Sleeve"
                />
                <p className="text-xl pt-5 font-light">Short Sleeves</p>
              </div>

              <div className="text-center flex-1 ">
                <img
                  src="/Home Assets/home_img_longSleeve.svg"
                  className="w-auto max-w-[250px] h-auto drop-shadow-xl mx-auto"
                  alt="Long Sleeve"
                />
                <p className="text-xl pt-5 font-light">Long Sleeves</p>
              </div>

              <div className="text-center flex-1">
                <img
                  src="/Home Assets/home_img_sleeveless.svg"
                  className="w-auto max-w-[250px] h-auto drop-shadow-xl mx-auto"
                  alt="Short Sleeve"
                />
                <p className="text-xl pt-5 font-light">
                  Tank tops and Sleeveless
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Design Section */}
        <div className="w-full py-20 px-10 md:px-20 bg-gray-800 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/Home Assets/home_picture1.svg"
              className="w-full max-w-md md:max-w-lg lg:max-w-xl h-auto drop-shadow-xl"
              alt="Custom T-Shirts"
            />
          </div>
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl font-semibold text-gray-200">
              Designing tees for your team just got easier.
            </h1>
            <p className="text-2xl mt-3 text-gray-200">
              Create a look for the entire team without the need to start your
              design from scratch. Easy, simple, fast.
            </p>
            <button className="bg-orange-100 text-black text-xl hover:bg-orange-300 transition duration-300 rounded-xl px-8 py-4 mt-3">
              Get Started
            </button>
          </div>
        </div>

        {/* Our Services Section */}
        <div className="w-full py-20 px-10 md:px-20 bg-[#FFF9F0]">
          <div className="container mx-25">
            {/* Heading */}
            <div className="mb-6">
              <h1 className="text-4xl font-semibold text-gray-800 border-gray-300 pb-2 inline-block">
                Our Services
              </h1>
              <p className="text-2xl text-gray-700">
                Our custom T-shirts come in a variety of sleeve and neck styles whatever you <br></br>need, 
                we've got you covered.
              </p>
            </div>
            
            {/* Description */}
            <div className="mb-10">
            
            </div>
            
            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Sublimation Service */}
              <Link to="/shop" className="relative group overflow-hidden rounded-lg shadow-lg">
                <img 
                  src="/Home Assets/Sublimation.svg" 
                  alt="Sublimation printing process" 
                  className="w-full h-auto object-fill transition-transform duration-300 group-hover:scale-105"
                />

              </Link>
              
              {/* Customize Service */}
              <Link to="/ShopPages/RequestForm" className="relative group overflow-hidden rounded-lg shadow-lg">
                <img 
                  src="/Home Assets/Customize.svg" 
                  alt="T-shirt customization workspace" 
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="w-full py-20 px-10 bg-white md:px-46">
          <div className="md:w-5/7 text-center md:text-left">
            <h1 className="text-4xl font-semibold text-gray-800">
              Frequently Asked Questions
            </h1>
            <div className="mt-10 space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-gray-300 rounded-lg">
                  <button
                    className="w-full text-left p-4 flex hover:bg-gray-50 justify-between items-center"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span className="text-xl font-semibold text-gray-800">
                      {faq.question}
                    </span>
                    <span className="transition-transform duration-300 ease-in-out">
                      <ChevronDown 
                        className={`w-6 h-6 transition-transform duration-300 ${
                          openIndex === index ? "transform rotate-180" : ""
                        }`} 
                      />
                    </span>
                  </button>
                  <div 
                    className={`transition-all duration-700 ease-in-out overflow-hidden ${
                      openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="p-4 text-lg text-black border-b border-gray-700">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

       {/* Footer */}
      <div className="w-full  pb-20 pt-10 px-10 bg-gray-800 mt-10">
        <div className="container mx-auto text-white">
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-bold">Davidson Athletics</h3>
              <p className="text-sm mt-2">© 2025 Davidson Athletics. All rights reserved.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold">Contact Us</h3>
              <p className="text-sm mt-2">Email: support@davidsonathletics.com</p>
              <p className="text-sm">Phone: +1 234 567 890</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Home;