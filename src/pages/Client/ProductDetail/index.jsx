import React, { useState, useEffect, useRef } from "react";
import ProductImageSection from "./ProductImageSection";
import ProductOptions from "./ProductOptions";
// import ProductList from "./ProductList"; // Không dùng ProductList nữa
import RelatedProductsSlider from './RelatedProductsSlider'; // Đảm bảo đường dẫn này chính xác
import ProductReviewSection from "./ProductReviewSection";
import TechnicalSpec from "./TechnicalSpec";
import ProductQA from "./ProductQA";
import ProductInfoBox from "./ProductInfoBox";
import ProductHighlights from "./ProductHighlights";
import { useParams } from 'react-router-dom';
import { productService } from '../../../services/client/productService';
import { cartService } from '../../../services/client/cartService';
import { toast } from 'react-toastify'; // hoặc dùng toast custom của bạn

// --- Các component nhỏ ---
const HomeIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
);

const highlightsDataExample = {
  title: "Đặc Điểm Nổi Bật Của iPhone 16 Pro Max",
  shortFeatures: [
    "Chip A18 Pro siêu mạnh mẽ, hiệu năng đồ họa vượt trội.",
    "Hệ thống camera Pro được nâng cấp, cảm biến lớn hơn, chụp ảnh thiếu sáng ấn tượng.",
    "Màn hình ProMotion XDR với độ sáng tối đa kỷ lục, viền mỏng hơn.",
    "Thời lượng pin cải thiện đáng kể, hỗ trợ sạc nhanh MagSafe.",
    "Khung viền Titan bền bỉ, trọng lượng nhẹ hơn.",
  ],
  tableOfContents: [
    "Chip A18 Pro: Đỉnh cao hiệu năng",
    "Camera Pro: Bắt trọn mọi khoảnh khắc",
    "Màn hình: Trải nghiệm thị giác đỉnh cao",
  ],
  detailedSections: [
    {
      title: "Chip A18 Pro: Đỉnh cao hiệu năng",
      content: "iPhone 16 Pro Max được trang bị chip A18 Pro sản xuất trên tiến trình 3nm thế hệ mới, mang lại hiệu năng CPU và GPU vượt trội so với các thế hệ trước. Điều này giúp xử lý mượt mà mọi tác vụ từ cơ bản đến nặng nhất như chơi game đồ họa cao, chỉnh sửa video 4K, hay chạy các ứng dụng AI phức tạp...\nCông nghệ Neural Engine cũng được cải tiến mạnh mẽ, tăng tốc các tác vụ học máy, mang đến những trải nghiệm thông minh và cá nhân hóa hơn.",
      image: "https://cdn.dummyjson.com/products/images/smartphones/iPhone%20X/1.png"
    },
    {
      title: "Hệ thống Camera Pro đột phá",
      content: "Hệ thống camera trên iPhone 16 Pro Max tiếp tục được Apple đầu tư mạnh mẽ. Cảm biến chính lớn hơn thu được nhiều ánh sáng hơn, cải thiện đáng kể khả năng chụp ảnh trong điều kiện thiếu sáng. Camera Ultra Wide và Telephoto cũng được nâng cấp, mang đến dải zoom quang học linh hoạt và chất lượng hình ảnh chi tiết, sắc nét hơn...\nCác tính năng như Photographic Styles, Cinematic mode, ProRes video tiếp tục được tối ưu hóa, đáp ứng nhu cầu sáng tạo nội dung chuyên nghiệp.",
      points: [
          "Cảm biến chính 48MP kích thước lớn hơn.",
          "Chế độ Cinematic hỗ trợ quay video 4K HDR ở 30 fps.",
          "Ống kính Telephoto zoom quang học 5x."
      ],
      image: "https://cdn.dummyjson.com/products/images/smartphones/iPhone%20X/3.png"
    },
  ],
};

const StarRating = ({ rating, totalStars = 5 }) => {
  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => (
        <svg key={index} className={`w-4 h-4 ${index < rating ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.049 2.293c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const Breadcrumb = ({ productName }) => {
  const [isDocked, setIsDocked] = useState(false);
  const breadcrumbRef = useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      if (breadcrumbRef.current) {
        if (window.innerWidth >= 768) {
          const rect = breadcrumbRef.current.getBoundingClientRect();
          setIsDocked(rect.top <= 0);
        } else {
          setIsDocked(false);
        }
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
      handleScroll(); 
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);
  return (
    <div ref={breadcrumbRef} className={`md:sticky md:top-0 md:z-20 transition-all duration-200 ease-in-out ${isDocked ? 'bg-white md:shadow-md max-w-screen-xl mx-auto' : 'bg-transparent'}`}>
      <div className={`flex items-center flex-wrap gap-x-1.5 gap-y-1 px-4 py-2 text-sm text-gray-500 ${isDocked ? 'md:py-3' : 'max-w-screen-xl mx-auto md:py-3'}`}>
        <a href="/" className="hover:text-blue-500 flex items-center">
          <HomeIcon className="w-4 h-4 mr-1 flex-shrink-0" />
          <span>Trang chủ</span>
        </a>
        <span className="text-gray-400">/</span>
        <a href="/products" className="hover:text-blue-500">Sản phẩm</a>
        <span className="text-gray-400">/</span>
        <span className={`transition-colors duration-200 ${isDocked ? 'text-gray-700' : 'text-gray-700'} font-medium`}>{productName}</span>
      </div>
    </div>
  );
};

const ProductTitleHeader = ({ productName, rating, reviewCount }) => (
  <div className="px-4 md:px-0 pt-2 md:pt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-4 md:mb-6"> {/* <--- THAY ĐỔI Ở ĐÂY */}
    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{productName}</h1>
    {typeof rating === 'number' && typeof reviewCount === 'number' && (
      <div className="flex items-center space-x-1 text-sm text-gray-600 flex-shrink-0">
        <StarRating rating={rating} />
        <span>({reviewCount} đánh giá)</span>
      </div>
    )}
  </div>
);

// --- Component ProductDetail chính ---
export default function ProductDetail() {
   const { slug } = useParams(); // ✅ LẤY slug từ route /product/:slug
  const [selectedColor, setSelectedColor] = useState("Kem");
  const [selectedOption, setSelectedOption] = useState("WIFI 12GB 256GB");
  const [showSpecModal, setShowSpecModal] = useState(false);
const [productOptionsData, setProductOptionsData] = useState([]);
const [productColorsData, setProductColorsData] = useState([]);
const [allProductImagesData, setAllProductImagesData] = useState([]); // ⬅️ chuyển lên đây
const [mainImage, setMainImage] = useState(""); // ⬅️ chuyển lên đây luôn
const [product, setProduct] = useState(null);
// lấy dynamic từ API
const productName = product?.name || "";
const productRating = product?.rating || 0;               // hoặc product.averageRating tuỳ API
const productReviewCount = product?.reviews?.length || 0; // giả sử API trả về mảng reviews

useEffect(() => {
  const fetchProduct = async () => {
    if (!slug) { // Added a check for slug presence
        console.log("Slug is missing, aborting fetch.");
        return;
    }
    try {
      console.log(`Workspaceing product with slug: ${slug}`);
      const response = await productService.getBySlug(slug);
      const fetchedProduct = response.data.product;

      // --- DEBUG LOG 1: Check the raw fetched product ---
      console.log("Fetched Product Data:", JSON.parse(JSON.stringify(fetchedProduct))); // Deep copy for logging

      if (!fetchedProduct) { // Added a check if fetchedProduct is null/undefined
          console.error("API returned no product for slug:", slug);
          setProduct(null); // Clear product state
          setProductOptionsData([]); // Clear options
          setAllProductImagesData([]); // Clear images
          // Potentially set an error message state to show to the user
          return;
      }

      setProduct(fetchedProduct);

      const skus = fetchedProduct?.skus || [];

      // --- DEBUG LOG 2: Check the SKUs array ---
      console.log("SKUs from Fetched Product:", JSON.parse(JSON.stringify(skus)));

      if (skus.length === 0) {
        console.warn("Không có SKU nào trong fetchedProduct.");
        setProductOptionsData([]); // Ensure options are cleared
        // Handle image fallback if no SKUs but product has a thumbnail
        if (fetchedProduct.thumbnail) {
            setAllProductImagesData([{
                imageThumb: fetchedProduct.thumbnail,
                imageFull: fetchedProduct.thumbnail,
                label: "Ảnh đại diện"
            }]);
            setMainImage(fetchedProduct.thumbnail);
        } else {
            setAllProductImagesData([]);
            setMainImage("");
        }
        return; // Exit if no SKUs, as options can't be generated
      }

      // ✅ Tạo dữ liệu biến thể
      const options = skus
        .filter(sku => {
          // --- DEBUG LOG 3: Check individual SKU before filtering ---
          // console.log("Filtering SKU:", sku.skuCode, "Has skuCode:", !!sku.skuCode, "Has price:", !!sku.price);
          return sku.skuCode && sku.price;
        })
        .map((sku) => ({
          label: sku.skuCode,
          price: parseFloat(sku.price).toLocaleString('vi-VN') + "₫",
          originalPrice: sku.originalPrice ? parseFloat(sku.originalPrice).toLocaleString('vi-VN') + "₫" : "", // Added check for originalPrice
          tradeInPrice: ""
        }));

      // --- DEBUG LOG 4: Check the generated options array ---
      console.log("Generated Options (Biến thể):", options);
      setProductOptionsData(options); // This should now correctly update

      if (options.length > 0) {
        setSelectedOption(options[0].label); // Set selected option based on fetched data
      } else {
        console.warn("Không có options (biến thể) nào được tạo sau khi filter. Kiểm tra skuCode và price trong SKUs.");
        setSelectedOption(""); // Clear selected option if no options generated
      }


      // ✅ Lấy ảnh sản phẩm từ media
      const allImages = [];
      skus.forEach((sku) => {
        if (sku.media && sku.media.length > 0) {
          sku.media.forEach((m) => {
            allImages.push({
              imageThumb: m.mediaUrl,
              imageFull: m.mediaUrl,
              label: sku.skuCode || "Ảnh sản phẩm"
            });
          });
        }
      });

      // Nếu không có ảnh nào từ SKUs VÀ sản phẩm có thumbnail, thì fallback
      if (allImages.length === 0 && fetchedProduct.thumbnail) { // CORRECTED: Use fetchedProduct.thumbnail
        allImages.push({
          imageThumb: fetchedProduct.thumbnail,
          imageFull: fetchedProduct.thumbnail,
          label: "Ảnh đại diện"
        });
      }
      setAllProductImagesData(allImages);
      if (allImages.length > 0 && !selectedOption) { // If options didn't determine an image yet
        setMainImage(allImages[0].imageFull);
      } else if (allImages.length === 0 && fetchedProduct.thumbnail) {
        setMainImage(fetchedProduct.thumbnail);
      } else if (allImages.length === 0) {
        setMainImage(""); // No images available
      }
      // The useEffect for selectedOption changing will handle mainImage update if options exist

      // ✅ Lấy màu từ variantValues nếu có
      const colors = new Set();
      skus.forEach((sku) => {
        sku?.variantValues?.forEach((v) => {
          if (v?.variantValue?.variant?.name?.toLowerCase().includes("màu")) {
            colors.add(v.variantValue.value);
          }
        });
      });

      const colorArray = Array.from(colors);
      setProductColorsData(colorArray);
      if (colorArray.length > 0) {
        setSelectedColor(colorArray[0]); // Set selected color based on fetched data
      } else {
        setSelectedColor(""); // Or keep your default "Kem" if no colors found
      }

    } catch (error) {
      console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
      toast.error("Không thể tải thông tin sản phẩm.");
      // Reset states to prevent displaying stale data from a previous successful fetch
      setProduct(null);
      setProductOptionsData([]);
      setAllProductImagesData([]);
      setProductColorsData([]);
      setMainImage("");
      setSelectedOption("");
      setSelectedColor("");
    }
  };

  fetchProduct();
}, [slug]); // Dependency array is correct

// This useEffect correctly updates the main image when selectedOption changes,
// AFTER productOptionsData and allProductImagesData have been populated.
useEffect(() => {
  if (!selectedOption || allProductImagesData.length === 0) {
    // If there's no selected option, or no images loaded yet,
    // we might not want to change the mainImage, or set a default.
    // If productOptionsData is empty, selectedOption might be a stale default.
    // Check if options are actually loaded for this selectedOption to be valid.
    if (productOptionsData.length === 0 && allProductImagesData.length > 0 && !mainImage) {
        // If no options, but images exist, maybe show the first image by default
        setMainImage(allProductImagesData[0].imageFull);
    }
    return;
  }

  const foundImage = allProductImagesData.find(img => img.label === selectedOption);
  if (foundImage) {
    setMainImage(foundImage.imageFull);
  } else {
    // Fallback if the selected option doesn't have a uniquely labeled image
    // but other images exist. (e.g. show first image of the product)
    if(allProductImagesData.length > 0){
        // console.log(`No specific image for option ${selectedOption}, using first available image.`);
        // setMainImage(allProductImagesData[0].imageFull); // Potentially confusing if options are distinct
    }
  }
}, [selectedOption, allProductImagesData, productOptionsData, mainImage]); // Added productOptionsData and mainImage to dependencies for more careful updates


  useEffect(() => {
  if (!selectedOption || allProductImagesData.length === 0) return;

  const foundImage = allProductImagesData.find(img => img.label === selectedOption);
  if (foundImage) {
    setMainImage(foundImage.imageFull);
  }
}, [selectedOption, allProductImagesData]);


  // Dữ liệu mẫu cho RelatedProductsSlider (bạn nên lấy dữ liệu này từ API hoặc props trong thực tế)
  const relatedProductsDataSample = [ 
    { id: "rp1", name: "Samsung Galaxy S24 Ultra 512GB", price: "31.990.000", oldPrice: "35.490.000", image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-s24-ultra-vang-1_1_1.png", discount: 10, rating: 4.9, inStock: true, soldCount: 500, isFavorite: false },
    { id: "rp2", name: "Xiaomi 14 12GB 256GB", price: "19.990.000", oldPrice: "22.990.000", image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-14-den_1_1.png", discount: 13, rating: 4.8, inStock: true, soldCount: 320, isFavorite: true },
    { id: "rp3", name: "OPPO Find N3 Flip 5G", price: "20.490.000", oldPrice: "24.990.000", image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/o/p/oppo-find-n3-flip-pink_1_1.png", discount: 18, rating: 4.7, inStock: false, soldCount: 150, isFavorite: false },
    // Thêm các sản phẩm tương tự khác nếu cần
  ];



  const [showAll, setShowAll] = useState(false); // State cho ProductQA


  const questions = [
    { user: "Nguyen Lam", time: "6 ngày trước", question: "nếu không lấy bao da thì có được giảm giá thêm không ạ?", adminReply: "CellphoneS xin chào anh Lam. Dạ hiện tại ưu đãi tặng kèm bao da bàn phím chỉ áp dụng cho học sinh sinh viên và sản phẩm quà tặng chưa hỗ trợ quy đổi." },
    { user: "Đặng Văn Việt", time: "1 tuần trước", question: "Trường hợp máy hao pin khi mới mua thì có được đổi máy mới lại không shop", adminReply: "CellphoneS xin chào anh Việt, dạ em xin gửi lại thông tin đến bộ phận liên quan kiểm tra và sẽ liên hệ lại anh trong vòng 60 phút." },
    { user: "Tuấn Phạm", time: "2 tuần trước", question: "phụ kiện đi kèm gồm những gì vậy shop. Có bao gồm bút và bao da không ạ", adminReply: "" },
  ];
  const visibleQuestions = showAll ? questions : questions.slice(0, 2);
  const stickyBreadcrumbHeightClass = "md:top-11";

  return (
    <div> 
      <Breadcrumb productName={productName} />

      <div className="max-w-screen-xl mx-auto py-3 md:pt-1 md:pb-6 text-sm text-gray-800"> {/* <--- THAY ĐỔI Ở ĐÂY */}
      <ProductTitleHeader
        productName={productName}
        rating={productRating}
        reviewCount={productReviewCount}
      />

        {/* Khối 1: Ảnh (trái) và Options (phải) */}
        <div className="md:px-0 grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6 items-start mb-6">
          <ProductImageSection
            mainImage={mainImage}
            setMainImage={setMainImage}
            allImages={allProductImagesData}  
            productName={productName}
            stickyTopOffset={stickyBreadcrumbHeightClass}
          />
      
  <ProductOptions
    selectedOption={selectedOption}
    setSelectedOption={setSelectedOption}
    selectedColor={selectedColor}
    setSelectedColor={setSelectedColor}
    productName={productName}
    productOptionsData={productOptionsData}
    productColorsData={productColorsData}
    stickyTopOffset={stickyBreadcrumbHeightClass}
      onAddToCart={(skuLabel) => {
    const matchedSku = product?.skus?.find(s => s.skuCode === skuLabel);
    if (!matchedSku) {
      toast.error("❌ Không tìm thấy SKU tương ứng");
      return;
    }

    cartService.addToCart({ skuId: matchedSku.id, quantity: 1 })
      .then(() => {
        toast.success("✅ Đã thêm vào giỏ hàng!");
      })
      .catch((err) => {
        toast.error("❌ Thêm vào giỏ hàng thất bại!");
        console.error("Lỗi addToCart:", err);
      });
  }}
  />


        </div>

        {/* Khối 2: Thông tin sản phẩm (toàn bộ chiều rộng) */}
        <div className="px-4 md:px-0 mb-6">
          <ProductInfoBox />
        </div>

        {/* Khối 3: Đặc điểm nổi bật (trái) và Thông số kỹ thuật (phải) */}
        <div className="px-4 md:px-0 grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6 items-start mb-6">
          <ProductHighlights data={highlightsDataExample} />
          {TechnicalSpec && (
            <div className={`md:sticky ${stickyBreadcrumbHeightClass} h-fit`}>
              <TechnicalSpec productName={productName} onShowModal={() => setShowSpecModal(true)} />
            </div>
          )}
        </div>

   
          <div className="px-4 md:px-0 mt-4 md:mt-6">
            
            <RelatedProductsSlider 
            />
          </div>
        
        
        {/* Khối 4: Đánh giá (trái) và Hỏi & Đáp (phải) */}
     {/* Khối 4: Cột trái chứa Review và QA, cột phải trống */}
<div className="px-4 md:px-0 grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6 items-start mb-6">
  {/* Cột trái */}
  <div>
    {/* Đánh giá */}
    {ProductReviewSection && (
      <ProductReviewSection
        productName={productName}
        rating={productRating}
        reviewCount={productReviewCount}
      />
    )}
    {/* Hỏi & Đáp */}
    {ProductQA && (
      <div className="mt-6">
        <ProductQA 
          questions={visibleQuestions} 
          totalQuestions={questions.length}
          showAll={showAll}
          setShowAll={setShowAll}
        />
      </div>
    )}
  </div>
  {/* Cột phải để trống */}
  <div />
</div>

      </div>
    </div>
  );
}
