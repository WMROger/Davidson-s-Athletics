import React from "react";
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <>
      <div className="bg-white">
        {/*Hero Section*/}
        <div className="h-auto w-full">
          <img
            className="w-full h-auto object-cover"
            src="/Home Assets/Hero.svg"
            alt="Hero"
          />
        </div>

        {/*Parent Container*/}
        <div className="w-full py-30 px-10 md:px-20 bg-orange-100 flex flex-col md:flex-row justify-between gap-8">
          {/* Text Section */}
          <div className="md:w-1/2 md:text-left text-center ml-28 pr-15 mt-7">
            <h1
              className="text-4xl font-semibold text-gray-800 "
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Custom T-Shirts
            </h1>

            <p
              className="text-2xl/8 mt-3 "
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Make custom T-shirts that they will be pleased to wear-all at
              prices that fit every budget.
            </p>

            <Link
              to="/shop"
              className="bg-black text-white text-xl hover:bg-orange-300 hover:text-black transition duration-300 rounded-xl px-8 py-4 mt-3 inline-block"
            >
              See all products
            </Link>
          </div>
          {/* Image */}
          <div className="md:w-1/2 flex justify-center ">
            <img
              src="/Home Assets/home_picture1.svg"
              className="w-full max-w-md md:max-w-lg lg:max-w-xl h-auto  drop-shadow-xl"
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
              whatever you need, we’ve got you covered.
            </p>

            {/* Apparel Category Container*/}
            <div className="md:w-full flex justify-between items-center gap-x-100">
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
        {/*Parent Container*/}
        <div className="w-full py-30 px-10 md:px-20 bg-gray-800 flex flex-col md:flex-row justify-between gap-8">
          {/* Image */}
          <div className="md:w-1/2 flex mr-5 justify-center ">
            <img
              src="/Home Assets/home_picture1.svg"
              className="w-full max-w-md md:max-w-lg lg:max-w-xl h-auto  drop-shadow-xl"
              alt="Custom T-Shirts"
            />
          </div>
          {/* Text Section */}
          <div className="md:w-1/2 md:text-left text-center ml-2 mr-80 pr-1 mt-7">
            <h1
              className="text-4xl font-semibold text-gray-200 "
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Designing tees for your team just got easier.
            </h1>

            <p
              className="text-2xl/8 mt-3 text-gray-200 "
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Create a look for the entire team without the need to start your
              design from scratch. Easy, simple, fast.
            </p>

            <button
              type="button"
              className="bg-orange-100 text-black text-xl hover:bg-orange-300 hover:text-black transition duration-300  rounded-xl px-8 py-4 mt-3"
            >
              Get Started{" "}
            </button>
          </div>
        </div>
        <div className="w-full py-20 px-10 bg-orange-100 md:px-20 flex flex-col md:flex-row justify-between gap-8">
          {/* Text Section */}
          <div className="md:w-5/7 md:text-left text-center mx-auto mt-7">
            <h1
              className="text-4xl font-semibold text-gray-800"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Frequently Asked Questions
            </h1>

            {/* FAQ Item 1 */}
            <div className="mt-10">
              <h2 className="text-2xl font-semibold text-gray-800">
                What material are the personalized T-shirts made of?
              </h2>
              <p className="text-lg mt-2">
                We offer cotton, blend, and polyester options. Our soft-touch
                custom tees are made of 100% ringspun cotton, which is more
                breathable and feels softer. We also have personalized T-shirts
                made from performance fabric, which is moisture-wicking for
                maximum comfort.
              </p>
            </div>

            {/* Divider */}
            <hr className="my-6 border-gray-400" />
            {/* FAQ Item 2 */}
            <div className="mt-10">
              <h2 className="text-2xl font-semibold text-gray-800">
                What sizes are the T-shirts available in?
              </h2>
              <p className="text-lg mt-2">
                Adults’ T-shirts from VistaPrint are available in XXS – 5XL. We
                also offer kids’ sizes. To find the exact length and width of
                each size, check our size charts tab on the T-shirt page of your
                choice.
              </p>
            </div>

            {/* Divider */}
            <hr className="my-6 border-gray-400" />
            {/* FAQ Item 3 */}
            <div className="mt-10">
              <h2 className="text-2xl font-semibold text-gray-800">
                Can I print my, artwork or design onto the T-shirts?
              </h2>
              <p className="text-lg mt-2">
                Yes, of course. To make your own T-shirt, you can upload your
                design to the front of your tee and add custom elements like
                text. For some of our personalized T-shirts, reverse side
                printing is also available.
              </p>
            </div>

            {/* Divider */}
            <hr className="my-6 border-gray-400" />
            {/* FAQ Item 4 */}
            <div className="mt-10">
              <h2 className="text-2xl font-semibold text-gray-800">
                Is there a minumum order quantity for custom T-shit?
              </h2>
              <p className="text-lg mt-2">
                There is no minimum order quantity for T-shirts printed with
                direct-to-garment or heat transfer printing options. For
                screenprint T-shirts, the minimum order quantity is 6.
              </p>
            </div>

            {/* Divider */}
            <hr className="my-6 border-gray-400" />
          </div>
        </div>

        <div className="w-screen h-50 flex items-center justify-center bg-[url('/background.svg')] bg-cover bg-center"></div>
        </div>
    </>
  );
};

export default Home;
