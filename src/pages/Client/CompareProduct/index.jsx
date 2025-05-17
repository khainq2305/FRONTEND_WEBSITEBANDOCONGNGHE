import React from 'react'
import Sidebar from './Sibar'
import ProductCard from './Products'
import CompareProductImages from './ProductImageSlider'
import Compare from './Compare'
import CompareComponents from './Compare/component'


const index = () => {
  return (

    <div className='max-w-screen-xl mx-auto w-full md:px-4 py-9'>
      <div className="flex flex-col lg:flex-row gap-2 ">
        <div className="flex-1 flex flex-wrap">
          <Sidebar />
        </div>
        <div className="flex-[3]">
          <ProductCard />
        </div>
      </div>
      <div className='pt-4'>
        <Compare />
      </div>
      <div>
        <CompareComponents />
      </div>
      <div>
        <CompareProductImages />
        
      </div>
    </div>
  )
}

export default index