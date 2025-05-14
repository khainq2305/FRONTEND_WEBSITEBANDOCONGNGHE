import React from 'react'
import Main from './Main'
import Sibar from './Sibar'
import Sibar2 from './Sibar2'

const NewsDetails = () => {
    return (
        <>
            <div className='flex max-w-screen-xl mx-auto w-full px-4'>
                <div className="flex-[3]">
                    <Main />
                </div>
                <div className="flex-[1.5]">
                    <Sibar />
                    <Sibar2 />
                </div>
            </div>
            <p>ẻthttr</p></>
    )
}

export default NewsDetails