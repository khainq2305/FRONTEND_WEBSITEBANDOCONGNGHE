import React, { useState, useEffect, useRef } from "react";
import ProductImageSection from "./ProductImageSection";
import ProductOptions from "./ProductOptions";
import RelatedProductsSlider from "./RelatedProductsSlider";
import ProductReviewSection from "./ProductReviewSection";
import TechnicalSpec from "./TechnicalSpec";
import ProductQA from "./ProductQA";
import ProductInfoBox from "./ProductInfoBox";
import AddToCartSuccessToast from './AddToCartSuccessToast';
import { useParams } from "react-router-dom";
import { productService } from "../../../services/client/productService";
import { cartService } from "../../../services/client/cartService";
import { bannerService } from "../../../services/client/bannerService";
import { toast } from "react-toastify";

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
        className={`w-4 h-4 ${index < rating ? "text-yellow-400" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.049 2.293c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const Breadcrumb = ({ productName }) => {
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
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={breadcrumbRef}
      className={`md:sticky md:top-0 md:z-20 transition-all duration-200 ease-in-out ${isDocked ? "bg-white md:shadow-md max-w-screen-xl mx-auto" : "bg-transparent"
        }`}
    >
      <div
        className={`flex items-center flex-wrap gap-x-1.5 gap-y-1 px-4 py-2 text-sm text-gray-500 ${isDocked ? "md:py-3" : "max-w-screen-xl mx-auto md:py-3"
          }`}
      >
        <a href="/" className="hover:text-blue-500 flex items-center">
          <HomeIcon className="w-4 h-4 mr-1 flex-shrink-0" />
          <span>Trang chủ</span>
        </a>
        <span className="text-gray-400">/</span>
        <a href="/products" className="hover:text-blue-500">
          Sản phẩm
        </a>
        <span className="text-gray-400">/</span>
        <span className="transition-colors duration-200 text-gray-700 font-medium">
          {productName}
        </span>
      </div>
    </div>
  );
};

const ProductTitleHeader = ({ productName, rating, reviewCount }) => (
  <div className="px-4 md:px-0 pt-2 md:pt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-4 md:mb-6">
    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{productName}</h1>
    {typeof rating === "number" && typeof reviewCount === "number" && (
      <div className="flex items-center space-x-1 text-sm text-gray-600 flex-shrink-0">
        <StarRating rating={rating} />
        <span>({reviewCount} đánh giá)</span>
      </div>
    )}
  </div>
);


const ProductDescription = ({ description }) => {
  if (!description) {
    return null;
  }
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Mô tả chi tiết sản phẩm</h2>
      <div
        className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
};

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [allProductImagesData, setAllProductImagesData] = useState([]);
  const [productOptionsData, setProductOptionsData] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [productColorsData, setProductColorsData] = useState([]);
  const [productDetailBanners, setProductDetailBanners] = useState([]);

  const productName = product?.name || "";
  const productRating = product?.rating || 0;
  const productReviewCount = product?.reviews?.length || 0;

  const [skuId, setSkuId] = useState(null);
  useEffect(() => {
    if (!selectedOption || !product?.skus) return;

    const matched = product.skus.find((s) => s.skuCode === selectedOption);
    if (matched) {
      setSkuId(matched.id);
    } else {
      setSkuId(null);
    }
  }, [selectedOption, product]);
  useEffect(() => {
    const fetchProductAndBanners = async () => {
      if (!slug) return;
      try {
        const response = await productService.getBySlug(slug);
        const fetchedProduct = response.data.product;

        if (!fetchedProduct) {
          setProduct(null);
          return;
        }
        setProduct(fetchedProduct);

        const skus = fetchedProduct.skus || [];

        if (skus.length === 0) {
          setProductOptionsData([]);
          if (fetchedProduct.thumbnail) {
            setAllProductImagesData([
              {
                imageThumb: fetchedProduct.thumbnail,
                imageFull: fetchedProduct.thumbnail,
                label: "Ảnh đại diện",
              },
            ]);
            setMainImage(fetchedProduct.thumbnail);
          } else {
            setAllProductImagesData([]);
            setMainImage("");
          }
          return;
        }

        const options = skus
          .filter((sku) => sku.skuCode && sku.price)
          .map((sku) => {
            const vals = (sku.variantValues || [])
              .map((vv) => vv.variantValue?.value)
              .filter((v) => !!v);
            const label = vals.length > 0 ? vals.join(" - ") : sku.skuCode;
            const colorVV = (sku.variantValues || []).find((vv) => {
              return vv.variantValue?.variant?.name
                .toLowerCase()
                .includes("màu");
            });
            const colorId = colorVV ? colorVV.variantValue.id : null;
            const colorLabel = colorVV ? colorVV.variantValue.value : null;
            const colorCode = colorVV ? colorVV.variantValue.colorCode : null;
            const imageUrl = colorVV ? colorVV.variantValue.imageUrl : null;

            return {
              skuId: sku.id,
              label,
              price: parseFloat(sku.price).toLocaleString("vi-VN") + "₫",
              originalPrice: sku.originalPrice
                ? parseFloat(sku.originalPrice).toLocaleString("vi-VN") + "₫"
                : "",
              numericPrice: parseFloat(sku.price),
              numericOriginalPrice: sku.originalPrice ? parseFloat(sku.originalPrice) : null,
              tradeInPrice: "",
              colorId,
              colorLabel,
              colorCode,
              imageUrl,
            };
          });

        setProductOptionsData(options);

        if (options.length > 0) {
          setSelectedOption(options[0].label);
          setSelectedColor(options[0].colorLabel || "");
        } else {
          setSelectedOption("");
          setSelectedColor("");
        }

        const rawColorValues = [];
        skus.forEach((sku) => {
          (sku.variantValues || []).forEach((vv) => {
            const variantName = vv.variantValue?.variant?.name?.toLowerCase() || "";
            if (variantName.includes("màu")) {
              rawColorValues.push({
                id: vv.variantValue.id,
                label: vv.variantValue.value,
                colorCode: vv.variantValue.colorCode || null,
                imageUrl: vv.variantValue.imageUrl || null,
              });
            }
          });
        });
        const uniqColors = Array.from(
          new Map(rawColorValues.map((item) => [item.id, item])).values()
        );
        setProductColorsData(uniqColors);

        if (uniqColors.length > 0) {
          setSelectedColor(uniqColors[0].label);
        } else {
          setSelectedColor("");
        }

        const allImages = [];
        skus.forEach((sku) => {
          (sku.ProductMedia || []).forEach((m) => {
            const vals = (sku.variantValues || [])
              .map((vv) => vv.variantValue?.value)
              .filter((v) => !!v);
            const label = vals.length > 0 ? vals.join(" - ") : sku.skuCode;
            allImages.push({
              imageThumb: m.mediaUrl,
              imageFull: m.mediaUrl,
              label,
            });
          });
        });
        if (allImages.length === 0 && fetchedProduct.thumbnail) {
          allImages.push({
            imageThumb: fetchedProduct.thumbnail,
            imageFull: fetchedProduct.thumbnail,
            label: "Ảnh đại diện",
          });
        }
        setAllProductImagesData(allImages);

        if (allImages.length > 0) {
          setMainImage(allImages[0].imageFull);
        } else if (fetchedProduct.thumbnail) {
          setMainImage(fetchedProduct.thumbnail);
        } else {
          setMainImage("");
        }

        if (fetchedProduct.id) {
          try {
            const bannerRes = await bannerService.getByProductId(fetchedProduct.id);
            setProductDetailBanners(bannerRes?.data?.data || []);
          } catch (bannerError) {
            console.error("Lỗi khi lấy banner cho sản phẩm:", bannerError);
            setProductDetailBanners([]);
          }
        }


      } catch (error) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
        toast.error("Không thể tải thông tin sản phẩm.");
        setProduct(null);
      }
    };

    fetchProductAndBanners();
  }, [slug]);

  const handleAddToCart = (selectedLabel) => {
    const matchedOption = productOptionsData.find((opt) => opt.label === selectedLabel);
    if (!matchedOption) {
      toast.error("Không tìm thấy biến thể tương ứng");
      return;
    }

    cartService
      .addToCart({ skuId: matchedOption.skuId, quantity: 1 })
      .then(() => {

        if (toast.isActive("add-to-cart-success-toast")) {
          toast.dismiss("add-to-cart-success-toast");
        }

        toast(
          ({ closeToast }) => (
            <AddToCartSuccessToast
              closeToast={closeToast}
              productName={productName}
              productImage={matchedOption.imageUrl || mainImage || product?.thumbnail}
              productPrice={matchedOption.price}
            />
          ),
          {
            toastId: "add-to-cart-success-toast",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            closeButton: false,
          }
        );
      })
      .catch((err) => {

        if (err.response && err.response.data && err.response.data.message) {

          toast.warn(err.response.data.message);
        } else {

          toast.error("Thêm vào giỏ hàng thất bại!");
        }
        console.error("Lỗi addToCart:", err);
      });
  };

  return (
    <div>
      <Breadcrumb productName={productName} />
      <div className="max-w-screen-xl mx-auto py-3 md:pt-1 md:pb-6 text-sm text-gray-800">
        <ProductTitleHeader
          productName={productName}
          rating={productRating}
          reviewCount={productReviewCount}
        />
        <div className="md:px-0 grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6 items-start mb-6">
          <ProductImageSection
            mainImage={mainImage}
            setMainImage={setMainImage}
            allImages={allProductImagesData}
            productName={productName}
            stickyTopOffset="md:top-11"
          />
          <ProductOptions
            productOptionsData={productOptionsData}
            productColorsData={productColorsData}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            onAddToCart={handleAddToCart}
            stickyTopOffset="md:top-11"
            banners={productDetailBanners}
          />
        </div>
        <div className="px-4 md:px-0 grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6 items-start mb-6">

          <div className="space-y-6">
            <ProductInfoBox productInfo={product?.productInfo} />


          </div>


          <div className="md:sticky md:top-11 h-fit">

          </div>
        </div>

        <div className="px-4 md:px-0 grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6 items-start mb-6">

          <div className="space-y-6">
            <ProductDescription description={product?.description} />

          </div>




          <div className="sticky top-20 md:sticky md:top-11 h-fit">
            <TechnicalSpec specs={product?.specs} />
          </div>
        </div>

        <div className="px-4 md:px-0 mt-4 md:mt-6">
          <RelatedProductsSlider />
        </div>

        <div className="px-4 md:px-0 grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6 items-start my-6">
          <div>
            {ProductReviewSection && (
              <ProductReviewSection skuId={skuId} productName={productName} />

            )}
            <ProductQA questions={[]} totalQuestions={0} showAll={false} setShowAll={() => { }} />
          </div>
          <div />
        </div>
      </div>
    </div>
  );
}
