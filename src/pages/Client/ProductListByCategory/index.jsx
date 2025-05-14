import { useEffect, useRef, useState } from 'react';
import Banner from './Banner';
import FilterBar from './FilterBar';
import SortBar from './SortBar';
import Description from './Description';
import Breadcrumb from './Breadcrumb';
import ViewedProducts from './ViewedProducts';
import ProductList from './ProductList';

export default function ProductListByCategory() {
  const [isStickySortBar, setIsStickySortBar] = useState(false);
  const sortBarRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStickySortBar(!entry.isIntersecting);
      },
      { root: null, threshold: 0, rootMargin: '-64px 0px 0px 0px' } // tùy chỉnh nếu cần
    );

    if (sortBarRef.current) {
      observer.observe(sortBarRef.current);
    }

    return () => {
      if (sortBarRef.current) {
        observer.unobserve(sortBarRef.current);
      }
    };
  }, []);

  return (
    <>
<main className="w-full flex justify-center">
  <div className="w-full max-w-screen-xl px-4">
    {!isStickySortBar && <Breadcrumb />}
    <Banner />
    <FilterBar />
    <div ref={sortBarRef} />
    <SortBar sticky={isStickySortBar} />
    <ProductList />
    <ViewedProducts />
    <Description />
  </div>
</main>



    </>
  );
}
