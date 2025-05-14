// import './News.css'
import Card from './Card'
import Carousel from './Carousel'
import Carousel2 from './Carousel2'
import MidNews from './MidNews'
import SibarMid from './SibarMid'
import SibarTop from "./SibarTop"
import TopNews from "./TopNews"


const newsPosts = Array.from({ length: 10 }, (_, i) => ({
  title: `Tin nóng Galaxy S25 #${i + 1}`,
  date: '09/05/2025',
  image: 'https://images.samsung.com/vn/smartphones/galaxy-s25/buy/product_color_blueBlack_plus_PC.png'
}));

const productPosts = Array.from({ length: 10 }, (_, i) => ({
  title: `Sản phẩm nổi bật #${i + 1}`,
  date: "09/05/2025",
  image: 'https://tintuc.dienthoaigiakho.vn/wp-content/uploads/2025/05/cach-lam-trend-pixsever-3-350x250.jpg',
})); 
const News = () => {
    return (
        <div className="max-w-screen-xl mx-auto w-full px-4">
            <div className='flex flex-col lg:flex-row justify-between px-0 md:px-4'>
                <div className="w-full py-4 md:py-0">
                    <TopNews />
                </div>
                <div style={{ maxWidth: '390px' }}>
                    <SibarTop />
                </div>
            </div>

            <div className='my-5'>
                <Carousel title="Tin Tức sam sum" items={newsPosts} visibleCount={5} />
            </div>
            
            <div className='flex flex-col lg:flex-row justify-between gap-4 px-0 md:px-4'>
                <div className="w-full">
                    <MidNews />
                </div>
                <div style={{ maxWidth: '430px' }}>
                    <SibarMid />
                </div>
            </div>
            <div className='my-5'>
                <Carousel2 title="Tin nổi bật nhất" />
            </div>
            <div className='my-5'>
                <Card />
            </div>
            <div className='my-5'>
                <Carousel title="Thủ thuật - mẹo hay" items={productPosts} visibleCount={5}/>
            </div>
        </div>
    )
}

export default News
