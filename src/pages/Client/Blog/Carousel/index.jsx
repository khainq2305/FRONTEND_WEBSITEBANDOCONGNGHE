import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';

const Carousel = ({ title, items, currentIndex, visibleCount }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="p-4 sm:p-0 group">
        <div className="mb-4 sm:mb-6 text-left">
          <h2 className="inline-block text-xl sm:text-2xl font-bold text-gray-800 uppercase tracking-wider pb-2 border-b-4 border-primary rounded-sm">
            {title}
          </h2>
        </div>

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              width: `calc(${(100 / visibleCount) * items.length}%)`,
              transform: `translateX(-${currentIndex * (100 / items.length)}%)`,
            }}
          >
            {items.map((post) => (
              <div
                key={post.id}
                className="flex-shrink-0 px-1.5 sm:px-2 sm:py-2"
                style={{ width: `calc(100% / ${items.length})` }}
              >
                <a href={post.link} className="block group">
                  <div className="relative w-full h-22 sm:h-35 overflow-hidden rounded-md shadow-sm mb-2 sm:mb-3">
                    <img
                      src='https://images.samsung.com/is/image/samsung/assets/vn/smartphones/galaxy-z-fold6/buy/Color_Selection_Pink_PC.png'
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 group-hover:text-primary transition-colors line-clamp-2 leading-tight h-8 sm:h-10">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 sm:mt-1 flex items-center">
                      <FontAwesomeIcon icon={faClock} className="mr-1.5" />
                      {post.createdAt}
                    </p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
