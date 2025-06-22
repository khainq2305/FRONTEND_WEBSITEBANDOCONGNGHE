import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';

// Import các component con và service
import ProductImageSection from './ProductImageSection';
import ProductOptions from './ProductOptions';
import RelatedProductsSlider from './RelatedProductsSlider';
import ProductReviewSection from './ProductReviewSection';
import TechnicalSpec from './TechnicalSpec';
import ProductQA from './ProductQA';
import ProductInfoBox from './ProductInfoBox';
import AddToCartSuccessToast from './AddToCartSuccessToast';
import { productService } from '../../../services/client/productService';
import { cartService } from '../../../services/client/cartService';
import { bannerService } from '../../../services/client/bannerService';
import { productViewService } from '../../../services/client/productViewService';
import { productQuestionService } from '@/services/client/productQuestionService';
import Loader from '../../../components/common/Loader'; // điều chỉnh lại path nếu khác

const HomeIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
);

const StarRating = ({ rating, totalStars = 5 }) => (
  <div className="flex items-center">
    {[...Array(totalStars)].map((_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.049 2.293c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const Breadcrumb = ({ productName, productCategory }) => {
  const [isDocked, setIsDocked] = useState(false);
  const breadcrumbRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!breadcrumbRef.current) return;
      if (window.innerWidth >= 768) {
        setIsDocked(breadcrumbRef.current.getBoundingClientRect().top <= 0);
      } else {
        setIsDocked(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={breadcrumbRef}
      className={` backdrop-blur-sm transition-shadow duration-200 ease-in-out ${isDocked ? 'md:sticky md:top-0 md:z-20 md:shadow-md' : ''}`}
    >
      <div className="max-w-[1200px] mx-auto flex items-center flex-wrap gap-x-1.5 gap-y-1 px-4 py-2.5 text-sm text-gray-500">
        <Link to="/" className="hover:text-primary flex items-center">
          <HomeIcon className="w-4 h-4 mr-1" />
          Trang chủ
        </Link>
        <span className="text-gray-400">/</span>
        {productCategory && (
          <>
            <Link to={`/category/${productCategory.slug}`} className="hover:text-primary">
              {productCategory.name}
            </Link>
            <span className="text-gray-400">/</span>
          </>
        )}
        <span className="text-gray-700 font-medium">{productName}</span>
      </div>
    </div>
  );
};

const ProductDescription = ({ description }) => {
  if (!description) {
    return null;
  }
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Mô tả chi tiết sản phẩm</h2>
      <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: description }} />
    </div>
  );
};
export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate(); // ✅ THÊM DÒNG NÀY
  const [product, setProduct] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [imagesForSelectedVariant, setImagesForSelectedVariant] = useState([]);
  const [productOptionsData, setProductOptionsData] = useState([]);
  const [productDetailBanners, setProductDetailBanners] = useState([]);
  const [skuId, setSkuId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [user, setUser] = useState(null);
// Trong ProductDetail.jsx, thay thế useEffect fetchProductData hiện tại bằng đoạn sau:

useEffect(() => {
  const fetchProductData = async () => {
    if (!slug) return;
    try {
      const response = await productService.getBySlug(slug);
      console.log('➤ API trả về product:', response.data.product);
      const fetchedProduct = response.data.product;
      if (!fetchedProduct) {
        setProduct(null);
        return;
      }
      setProduct(fetchedProduct);

      // Build options, kèm flashSaleInfo
      const options = (fetchedProduct.skus || [])
        .filter(sku => sku.skuCode && (sku.price || sku.originalPrice))
        .map(sku => {
          // Label và giá như trước
          const vals = (sku.variantValues || [])
            .map(vv => vv.variantValue?.value)
            .filter(Boolean);
          const label = vals.length > 0 ? vals.join(' - ') : sku.skuCode;
          const numericSalePrice = parseFloat(sku.price ?? 0);
          const numericOriginalPrice = parseFloat(sku.originalPrice ?? 0);
          const finalPrice = numericSalePrice > 0 ? numericSalePrice : numericOriginalPrice;
          const strikethroughPrice = numericOriginalPrice > finalPrice ? numericOriginalPrice : null;

          // Lấy flash sale từ relation trên backend (FlashSaleItem hoặc flashSaleItem)
       // SỬA THÀNH:
const activeFlashSaleItem = sku.flashSaleSkus?.[0] ?? null;
const flashSaleInfo = activeFlashSaleItem
  ? {
      endTime: activeFlashSaleItem.flashSale.endTime,
      quantity: activeFlashSaleItem.quantity
    }
  : null;


          // Trả về object option bao gồm flashSaleInfo
          return {
            skuId: sku.id,
            label,
            price: finalPrice > 0
              ? finalPrice.toLocaleString('vi-VN') + '₫'
              : 'Liên hệ',
            originalPrice: strikethroughPrice
              ? strikethroughPrice.toLocaleString('vi-VN') + '₫'
              : null,
            numericPrice: finalPrice,
            numericOriginalPrice,
            variantImage: sku.ProductMedia?.[0]?.mediaUrl || null,
            colorCode: (sku.variantValues || [])
              .find(vv => vv.variantValue?.variant?.name.toLowerCase().includes('màu'))
              ?.variantValue.colorCode || null,
            imageUrl: (sku.variantValues || [])
              .find(vv => vv.variantValue?.variant?.name.toLowerCase().includes('màu'))
              ?.variantValue.imageUrl || null,
            inStock: sku.stock > 0,
            flashSaleInfo,    // ← Thêm trường này
          };
        });

      setProductOptionsData(options);
      if (options.length > 0) {
        setSelectedOption(options[0].label);
      }

      // Lấy banner nếu cần
      if (fetchedProduct.id) {
        bannerService
          .getByProductId(fetchedProduct.id)
          .then(res => setProductDetailBanners(res.data.data || []))
          .catch(err => console.error('Lỗi lấy banner:', err));
      }
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
      toast.error('Không thể tải thông tin sản phẩm.');
      setProduct(null);
    }
  };

  fetchProductData();
}, [slug]);

  useEffect(() => {
    if (!product || !selectedOption) return;

    const selectedSku = product.skus.find((sku) => {
      const vals = (sku.variantValues || []).map((vv) => vv.variantValue?.value).filter(Boolean);
      const label = vals.length > 0 ? vals.join(' - ') : sku.skuCode;
      return label === selectedOption;
    });

    if (selectedSku) {
      setSkuId(selectedSku.id);
      if (selectedSku.ProductMedia && selectedSku.ProductMedia.length > 0) {
        const skuImages = selectedSku.ProductMedia.map((m) => ({
          imageThumb: m.mediaUrl,
          imageFull: m.mediaUrl,
          label: selectedOption
        }));
        setImagesForSelectedVariant(skuImages);
        setMainImage(skuImages[0].imageFull);
      } else {
        const fallbackImage = product.thumbnail
          ? [{ imageThumb: product.thumbnail, imageFull: product.thumbnail, label: 'Ảnh đại diện' }]
          : [];
        setImagesForSelectedVariant(fallbackImage);
        setMainImage(product.thumbnail || '');
      }
    }
  }, [product, selectedOption]);
  useEffect(() => {
    if (!product?.id) return;
    productQuestionService
      .getByProductId(product.id)
      .then((res) => setQuestions(res.data || []))
      .catch(() => setQuestions([]));
  }, [product]);

  useEffect(() => {
    if (product && product.id) {
      productViewService.trackView(product.id).catch((err) => console.error('Lỗi ghi nhận lượt xem:', err));

      const VIEWED_PRODUCTS_KEY = 'viewed_products';
      try {
        let viewedIds = JSON.parse(localStorage.getItem(VIEWED_PRODUCTS_KEY)) || [];
        viewedIds = viewedIds.filter((id) => id !== product.id);
        viewedIds.unshift(product.id);
        const MAX_VIEWED_PRODUCTS = 20;
        if (viewedIds.length > MAX_VIEWED_PRODUCTS) {
          viewedIds = viewedIds.slice(0, MAX_VIEWED_PRODUCTS);
        }
        localStorage.setItem(VIEWED_PRODUCTS_KEY, JSON.stringify(viewedIds));
      } catch (error) {
        console.error('Lỗi localStorage:', error);
      }
    }
  }, [product]);

  const handleAddToCart = (selectedLabel) => {
    const matchedOption = productOptionsData.find((opt) => opt.label === selectedLabel);
    if (!matchedOption) {
      toast.error('Không tìm thấy biến thể tương ứng');
      return;
    }

    cartService
      .addToCart({ skuId: matchedOption.skuId, quantity: 1 })
     .then((res) => {
  window.dispatchEvent(new Event('cartUpdated'));

  const backendMsg = res?.data?.message || '';
  const showExtraNotice = backendMsg.includes('vượt quá giới hạn');

  if (toast.isActive('add-to-cart-success-toast')) {
    toast.dismiss('add-to-cart-success-toast');
  }

  toast(
    ({ closeToast }) => (
      <AddToCartSuccessToast
        closeToast={closeToast}
        productName={product.name}
        productImage={matchedOption.variantImage || mainImage || product?.thumbnail}
        productPrice={matchedOption.price}
        extraMessage={showExtraNotice ? backendMsg : null} // 👈 truyền thông báo nếu có
      />
    ),
    {
      toastId: 'add-to-cart-success-toast',
      autoClose: 4000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      closeButton: false,
      style: { background: 'transparent', boxShadow: 'none', padding: 0 },
      bodyStyle: { padding: 0 }
    }
  );
})

    .catch((err) => {
  const backendMsg = err?.response?.data?.message;
  if (backendMsg?.includes('giới hạn Flash Sale')) {
    toast.info(backendMsg); // 👉 hiện thông báo nhẹ nhàng nếu là thông báo hướng dẫn
  } else {
    toast.warn(backendMsg || 'Thêm vào giỏ hàng thất bại!');
  }
  console.error('Lỗi addToCart:', err);
});
  };
const handleBuyNow = async (selectedLabel) => {
  const matchedOption = productOptionsData.find((opt) => opt.label === selectedLabel);

  if (!matchedOption) {
    toast.error('Vui lòng chọn phân loại sản phẩm!');
    return;
  }

  try {
    await cartService.addToCart({ skuId: matchedOption.skuId, quantity: 1 });

    const cartRes = await cartService.getCart();
    const addedItem = cartRes.data?.cartItems?.find(item => item.skuId === matchedOption.skuId);
    if (addedItem) {
      await cartService.updateSelected({
        cartItemId: addedItem.id,
        isSelected: true
      });
    }

    // ✅ Dispatch sự kiện để header lắng nghe và cập nhật số lượng
    window.dispatchEvent(new Event('cartUpdated'));

    localStorage.setItem("selectedCartItems", JSON.stringify([
      {
        skuId: matchedOption.skuId,
        quantity: 1,
        price: matchedOption.numericOriginalPrice,
        finalPrice: matchedOption.numericPrice,
        productName: product.name,
        productSlug: product.slug,
        image: matchedOption.variantImage || product.thumbnail,
        variantDisplay: matchedOption.label,
        stock: 999
      }
    ]));

    navigate('/checkout');
  } catch (error) {
    const message = error?.response?.data?.message || 'Thêm sản phẩm thất bại!';
    toast.warn(message);
  }
};
;



 if (!product) {
  return <Loader fullscreen />;
}


  const productName = product.name;
  const productRating = product.averageRating || 0;
  const productReviewCount = product.reviews?.length || 0;
  const selectedSku = product?.skus?.find((sku) => sku.id === skuId);
  const isFavorited = selectedSku?.isFavorited ?? false;

  return (
    <div className="bg-gray-50">
      <Breadcrumb productName={productName} productCategory={product.category} />
      <div className="max-w-[1200px] mx-auto py-3 md:pt-1 md:pb-6 text-sm text-gray-800">
        <div className="px-4 md:px-0 grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6 items-start mb-6">
          <ProductImageSection
            key={skuId} // ⚠️ Bắt buộc re-render nếu skuId thay đổi
            mainImage={mainImage}
            setMainImage={setMainImage}
            allImages={imagesForSelectedVariant}
            productName={productName}
            productId={product?.id}
            skuId={skuId}
          />

          <ProductOptions
            productName={productName}
            onBuyNow={handleBuyNow}
            rating={productRating}
                badge={product?.badge} // ✅ THÊM DÒNG NÀY
            reviewCount={productReviewCount}
            productOptionsData={productOptionsData}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            onAddToCart={handleAddToCart}
            banners={productDetailBanners}
          />
        </div>

        <div className="px-4 md:px-0 grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6 items-start mb-6">
          <div className="space-y-6">
            {product.productInfo && <ProductInfoBox productInfo={product.productInfo} />}
            <ProductDescription description={product.description} />
          </div>
          <div className="sticky top-16 h-fit">{product.specs && <TechnicalSpec specs={product.specs} />}</div>
        </div>

        <div className="px-4 md:px-0 mt-4 md:mt-6">
          <RelatedProductsSlider categoryId={product.categoryId} currentProductId={product.id} />
        </div>

        <div className="px-4 md:px-0 mt-6 space-y-6">
          <ProductReviewSection skuId={skuId} productName={productName} />
          <div className="mt-8">
            <ProductQA
              questions={questions}
              totalQuestions={questions.length}
              showAll={showAll}
              setShowAll={setShowAll}
              productId={product?.id}
              user={user}
            />
          </div>

          <div />
        </div>
      </div>
    </div>
  );
}
