import React from "react";

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white px-6 md:px-16 py-20 bg-[url('/background.svg')] bg-cover bg-center">
      <div className="mt-30">
      {/* Title Section */}
      <h1 className="text-4xl md:text-6xl font-bold mb-10 text-center">
        About Us
      </h1>
      </div>
      {/* Content Section */}
      <div className="flex flex-col md:flex-row  justify-between gap-10 max-w-7xl w-full">
        {/* Text Section */}
        <div className="max-w-2xl">
          <p className="text-2xl leading-relaxed ">
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout. The point
            of using Lorem Ipsum is that it has a more-or-less normal
            distribution of letters, as opposed to using 'Content here, content
            here', making it look like readable English.
          </p>
          <p className="text-2xl leading-relaxed mt-4">
            Many desktop publishing packages and web page editors now use Lorem
            Ipsum as their default model text, and a search for 'lorem ipsum'
            will uncover many websites still in their infancy. Various versions
            have evolved over the years, sometimes by accident, sometimes on
            purpose (injected humour and the like).
          </p>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="/AboutUs_pic.svg"
            alt="About Us"
            className="w-full max-w-lg rounded-lg shadow-lg object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
