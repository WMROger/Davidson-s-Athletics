import React from 'react'

const Home = () => {
  return (
    <>
    <div className='bg-white'>
    {/*Hero Section*/}
      <div className='h-auto w-full'>
          <img className="w-full h-auto object-cover" 
               src="/Home Assets/Hero.svg" 
               alt="Hero" />
      </div>
      
      {/*Parent Container*/}
      <div className='w-full py-30 px-10 md:px-20 bg-orange-100 flex flex-col md:flex-row justify-between gap-8'>
        {/* Text Section */}
        <div className='md:w-1/2 md:text-left text-center ml-28 pr-15 mt-7'>

            <h1 className="text-4xl font-semibold text-gray-800 " 
                style={{ fontFamily: 'Inter, sans-serif' }}> 
                  Custom T-Shirts 
            </h1>

              <p className='text-2xl/8 mt-3 '
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                Make custom T-shirts that they will be pleased to wear-all at prices that fit every budget.
              </p>

              <button type="button"  className='bg-black text-white text-xl hover:bg-orange-300 hover:text-black transition duration-300  rounded-xl px-8 py-4 mt-3'  >
                See all products
              </button>
        </div>
        {/* Image */}
          <div className='md:w-1/2 flex justify-center '>
            <img src='/Home Assets/home_picture1.svg' 
                 className="w-full max-w-md md:max-w-lg lg:max-w-xl h-auto  drop-shadow-xl" 
                 alt="Custom T-Shirts"/>
          </div>    
      </div>

     {/*Parent Container Category*/}
      <div className='w-full py-20 px-10 md:px-20 flex-col md:flex-row justify-between gap-8'>
         {/* Text Section */}
            <div className='md:w-1/2 md:text-left text-center ml-28 mt-7'>
              <h1 className="text-4xl font-semibold text-gray-800 " 
                style={{ fontFamily: 'Inter, sans-serif' }}>
                Pick your custom shirt style
              </h1>

              <p className='text-2xl/8 mt-3 '
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                Our custom T-shirts come in a variety of sleeve and neck styles whatever you need, we’ve got you covered.
              </p>

              {/* Apparel Category Container*/}
              <div className='md:w-full flex justify-between items-center gap-x-80'>


                <div className='text-center flex-1 mt-10'>
                  <img src='/Home Assets/home_img_shortSleeve.svg'
                      className="w-auto max-w-[250px] h-auto drop-shadow-xl mx-auto" 
                      alt="Short Sleeve"/>
                  <p className='text-xl pt-5 font-light'>Short Sleeves</p>
                </div>

                <div className='text-center flex-1 '>
                  <img src='/Home Assets/home_img_longSleeve.svg'
                      className="w-auto max-w-[250px] h-auto drop-shadow-xl mx-auto" 
                      alt="Long Sleeve"/>
                  <p className='text-xl pt-5 font-light'>Long Sleeves</p>
                </div>

                <div className='text-center flex-1'>
                  <img src='/Home Assets/home_img_sleeveless.svg'
                      className="w-auto max-w-[250px] h-auto drop-shadow-xl mx-auto" 
                      alt="Short Sleeve"/>
                  <p className='text-xl pt-5 font-light'>Tank tops and Sleeveless</p>
                </div>

            
              </div>  

            </div>

      </div>
    </div>

      
      </>
  )
}

export default Home
