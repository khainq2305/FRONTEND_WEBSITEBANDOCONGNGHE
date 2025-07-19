import { subject } from '@casl/ability';
import { API_BASE_URL } from '../constants/environment';

export const API_ENDPOINT = {
  client: {
    auth: {
      base: `${API_BASE_URL}`,
      login: '/login',
      register: '/register',
      resendVerificationLink: '/resend-verification-link',
      google: '/google',
      facebook: '/facebook',
      verifyEmail: '/verify-email',
      verifyResetToken: '/verify-reset-token',
      forgotPassword: '/forgot-password',
      checkVerificationStatus: '/check-verification-status',
      resendForgotPassword: '/resend-forgot-password',
      checkResetStatus: '/check-reset-status',
      resetPassword: '/reset-password',
      getResetCooldown: '/get-reset-cooldown',
      verificationCooldown: '/verification-cooldown',
      userInfo: '/user-info',
      updateProfile: '/update-profile',
      changePassword: '/change-password'
    },
    shipping: {
      base: `${API_BASE_URL}/shipping`,
      provinces: '/provinces',
      districts: '/districts',
      wards: '/wards'
    },
    userAddress: {
      base: `${API_BASE_URL}/user-address`,
      list: '/',
      create: '/',
      getDefault: '/default'
    },
    recommendation: {
      base: `${API_BASE_URL}/recommendations`,
      get: (userId, currentProductId = null) => {
        let query = `?userId=${userId}`;
        if (currentProductId) {
          query += `&currentProductId=${currentProductId}`;
        }
        return query;
      }
    },
    category: {
      base: `${API_BASE_URL}/api/client/categories`,
      combinedMenu: '/combined-menu'
    },
    section: {
      base: `${API_BASE_URL}`,
      list: '/home-sections'
    },
    product: {
      base: `${API_BASE_URL}/product`,
      baseList: `${API_BASE_URL}`,
      getBySlug: (slug) => `/product/${slug}`,
      getRelated: () => `/related`,
       getCompareByIds: (ids) => `/product/compare-ids?ids=${ids.join(',')}`
    },
    highlightedCategory: {
      base: `${API_BASE_URL}`,
      list: '/highlighted-categories'
    },
    coupon: {
      base: `${API_BASE_URL}`,
      apply: '/apply',
      available: '/available'
    },

    search: {
      base: `${API_BASE_URL}`,
      search: '/search',
      history: '/search/history'
    },
    brand: {
      base: '/api/client/brands'
    },
    systemSettings: {
      base: `${API_BASE_URL}/system-settings`,
      update: '/update',
      get: '' 
    },
    cart: {
      base: `${API_BASE_URL}/cart`,
      add: '/add',
      list: '/my-cart',
      updateQuantity: '/update-quantity',
      deleteItem: (id) => `/item/${id}`,
      updateSelected: '/update-selected',

      deleteMultiple: '/delete-multiple'
    },
    chat: {
      base: `${API_BASE_URL}/chatbox`,
      send: '/'
    },
    systemSettings: {
      base: `${API_BASE_URL}/system-settings`
    },
    order: {
      base: `${API_BASE_URL}/orders`,
      create: '/create',
      calculateFee: '/calculate-fee',
      momoPay: '/momo',
      reorder: (orderId) => `/${orderId}/reorder`,
      momoCallback: '/momo-callback',
  paymentMethods: '/payment-methods', // <-- ⭐ thêm dòng này
      vnpayCallback: '/vnpay-callback', 
      zaloPay: '/zalopay',
      payAgain: (id) => `/${id}/pay-again`,
      vnpay: '/vnpay',
       uploadProof: (orderId) => `/${orderId}/proof`,  // ← thêm đây
      shippingOptions: '/shippings/options',
      viettelMoney: '/viettel-money', 
      stripePay: '/stripe', // vào mục order
  updatePaymentStatus: (orderId) => `/${orderId}/payment-status`,
      viettelMoneyCallback: '/viettel-money/callback', 
      bookPickup: (id) => `/return/${id}/book-pickup`,
      vietqrPay: '/generate-vietqr',
      markAsCompleted: (orderId) => `/${orderId}/mark-completed`,
      return: '/return',
      cancel: (orderId) => `/${orderId}/cancel`,
      lookup: (code, phone) => `/lookup?code=${code}&phone=${phone}`
    },
    news: {
      base: `${API_BASE_URL}/tin-noi-bat`,
      featurePost: '',
      byCategory: '/theo-danh-muc',
      calculateFee: '/calculate-fee'
    },

    banner: {
      base: `${API_BASE_URL}`,
      getByType: (type) => `/banner?type=${type}`,
      getByCategory: (categoryId) => `/banner/category/${categoryId}`,
      getByProduct: (productId) => `/banner/product/${productId}`
    },
    flashSale: {
      base: `${API_BASE_URL}`,
      list: '/flash-sale/list'
    },
    wishlist: {
      base: `${API_BASE_URL}/wishlist`,
      list: '',
      add: (productId) => `/${productId}`,
      remove: (productId) => `/${productId}`
    },
    review: {
      base: `${API_BASE_URL}/review`,
      create: '/create',
      getBySku: (id) => `/sku/${id}`,
      check: (id) => `/check-can-review/${id}`
    },
    news: {
      base: `${API_BASE_URL}/tin-noi-bat`,
      featurePost: '',
      byCategory: '/theo-danh-muc',
      getBySlug: '',
      getRelated: '/bai-viet-lien-quan',
      calculateFee: '/calculate-fee'
    },
    notification: {
      base: `${API_BASE_URL}/admin/notifications`,
      getAll: '',
      create: '',
      getById: '/:id',
      update: '/:id',
      delete: '/:id',
      deleteMany: '/delete-many'
    },
    productView: {
      base: `${API_BASE_URL}/productviews`,
      track: '/',
      listByIds: '/list',
      top: '/top',
        recentlyViewedByCategoryLevel1: '/recently-viewed-by-category-level1',
         searchForCompare: '/search-compare' 
    },
    productQuestion: {
      base: `${API_BASE_URL}/product-questions`,
      create: '/create',
      reply: '/reply',
      getByProductId: (productId) => `/product/${productId}`
    }
  },
  admin: {
    permissions: {
      base: `${API_BASE_URL}/admin/permissions`,
      getAll: '/permissions',
      getSubJect: '/subjects',
      getMatrix: '/matrix',
      ActForSubject: '/actions',
      getPermByRole: '/role',
      updatePerm: '/update'
    },
    rolePermissions: {
      base: `${API_BASE_URL}/admin`,
      getAll: '/rolePermissions'
    },
    systemSettings: {
      base: `${API_BASE_URL}/admin/system-settings`
    },
    dashboard: {
      base: `${API_BASE_URL}/admin/dashboard`,
      getStats: '/stats',
      getRevenueByDate: '/revenue-by-date',
      getOrdersByDate: '/orders-by-date',
      getTopSellingProducts: '/top-selling-products',
      getFavoriteProducts: '/favorite-products'
    },
     sku: {
      base: `${API_BASE_URL}/admin/sku`,
      getAll: '/',
      logsBySkuId: (id) => `/${id}/logs`,
      importStock: (id) => `/${id}/import`,
      // getById: (slug) => `/product/${slug}`,
      exportStock: (id) =>  `/${id}/export`,
      softDelete: (id) => `/product/soft/${id}`,
      softDeleteMany: '/product/soft-delete-many',
      restore: (id) => `/product/restore/${id}`,
      restoreMany: '/product/restore-many',
      forceDelete: (id) => `/product/force/${id}`,
      updateOrderIndexBulk: '/product/update-order'
    },
    product: {
      base: `${API_BASE_URL}/admin`,
      create: '/product/create',
      list: '/product/list',
      getCategoryTree: '/categories/tree',
      getBrandList: '/brands/list',
      getById: (slug) => `/product/${slug}`,
      forceDeleteMany: '/product/force-delete-many',
      softDelete: (id) => `/product/soft/${id}`,
      softDeleteMany: '/product/soft-delete-many',
      restore: (id) => `/product/restore/${id}`,
      restoreMany: '/product/restore-many',
      forceDelete: (id) => `/product/force/${id}`,
      updateOrderIndexBulk: '/product/update-order'
    },
     sku: {
      base: `${API_BASE_URL}/admin/sku`,
      getAll: '/',
      logsBySkuId: (id) => `/${id}/logs`,
      importStock: (id) => `/${id}/import`,
      // getById: (slug) => `/product/${slug}`,
      exportStock: (id) =>  `/${id}/export`,
      softDelete: (id) => `/product/soft/${id}`,
      softDeleteMany: '/product/soft-delete-many',
      restore: (id) => `/product/restore/${id}`,
      restoreMany: '/product/restore-many',
      forceDelete: (id) => `/product/force/${id}`,
      updateOrderIndexBulk: '/product/update-order'
    },
    notification: {
      base: `${API_BASE_URL}/admin/notifications`,
      getAll: '',
      create: '',
      getById: '/:id',
      update: '/:id',
      delete: '/:id',
      deleteMany: '/delete-many',
      updateOrder: '/update-order',
      forceDelete: '/force-delete/:id'
    },
    roles: {
      base: `${API_BASE_URL}/admin/quan-ly-vai-tro`,
      getAll: '',
      create: '/',
      getById: '/',
      update: '',
      delete: '',
      deleteMany: '/delete-many',
      forceDelete: '/force-delete/:id',

      restore: '/restore/:id',
      restoreMany: '/restore-many'
    },
    category: {
      base: `${API_BASE_URL}/admin/categories`,
      getAll: '',
      getById: '/:id',
      create: '',
      update: '/:id',

      restore: '/restore/:id',
      restoreMany: '/restore-many',

      softDelete: (id) => `/soft-delete/${id}`,
      softDeleteMany: '/soft-delete',

      forceDelete: (id) => `/force-delete/${id}`,
      forceDeleteMany: '/force-delete-many'
    },
    coupon: {
      base: `${API_BASE_URL}/admin`,
      list: '/coupon/list',
      create: '/coupon/create',
      update: (id) => `/coupon/update/${id}`,
      softDelete: (id) => `/coupon/soft/${id}`,
      restore: (id) => `/coupon/restore/${id}`,
      forceDelete: (id) => `/coupon/force/${id}`,
      softDeleteMany: '/coupon/soft-delete-many',
      restoreMany: '/coupon/restore-many',
      forceDeleteMany: '/coupon/force-delete-many'
    },

    order: {
      base: `${API_BASE_URL}/admin`,
      list: '/order/list',
      getById: '/order/:id',
      updateStatus: (id) => `/order/${id}/status`,
      getReturns: (orderId) => `/order/${orderId}/returns`,
      updateReturnStatus: (id) => `/returns/${id}/status`,
      chooseReturnMethod: (id) => `/return/${id}/choose-method`,
      getRefunds: (orderId) => `/order/${orderId}/refunds`,
      updateRefundStatus: (id) => `/refunds/${id}/status`,
      cancel: '/order/:id/cancel',
        updatePaymentStatus: (id) => `/order/${id}/payment-status`, 
    },
    variant: {
      base: `${API_BASE_URL}/admin`,
      list: '/variants/list',
      create: '/variants/create',
      softDelete: (id) => `/variants/${id}`,
      forceDelete: (id) => `/variants/${id}/force`,
      restore: (id) => `/variants/${id}/restore`,
      softDeleteMany: '/variants/delete-many',
      forceDeleteMany: '/variants/force-delete-many',
      restoreMany: '/variants/restore-many',
      getAllWithValues: '/variants/with-values',
      typeCreate: '/variants/type/create'
    },
    section: {
      base: `${API_BASE_URL}/admin`,
      list: '/sections',
      create: '/sections',
      update: (slug) => `/sections/${slug}`,
      delete: (idOrSlug) => `/sections/${idOrSlug}`,
      getById: (slug) => `/sections/${slug}`,
      getAllCategories: '/sections/categories',
      updateOrder: '/sections/update-order',
      getAllProducts: '/sections/products'
    },
    banner: {
      base: `${API_BASE_URL}/admin`,
      list: '/banners',
      create: '/banners',
      getById: (slug) => `/banners/${slug}`,
      update: (slug) => `/banners/${slug}`,

      delete: (id) => `/banners/${id}`,
      forceDeleteMany: '/banners/force-delete',
      updateOrder: (id) => `/banners/${id}/update-order`,
      categoriesForSelect: '/banners/categories-for-select',
      productsForSelect: '/banners/products-for-select'
    },

    variantValue: {
      base: `${API_BASE_URL}/admin`,
      getByVariantId: (id) => `/variant-values/${id}`,
      create: '/variant-values/create',
      update: (id) => `/variant-values/${id}`,
      softDelete: (id) => `/variant-values/${id}`,
      forceDelete: (id) => `/variant-values/${id}/force`,
      restore: (id) => `/variant-values/${id}/restore`,
      softDeleteMany: '/variant-values/delete-many',
      forceDeleteMany: '/variant-values/force-delete-many',
      restoreMany: '/variant-values/restore-many',
      reorder: '/variant-values/reorder',
      createQuick: '/variant-values/create-quick'
    },

    highlightedCategoryItem: {
      base: `${API_BASE_URL}/admin`,
      list: '/highlighted-category-items/list',
      create: '/highlighted-category-items',
      update: (slug) => `/highlighted-category-items/${slug}`,
      getBySlug: (slug) => `/highlighted-category-items/${slug}`,

      delete: (id) => `/highlighted-category-items/${id}`,
      deleteMany: '/highlighted-category-items/delete-many',
      getCategories: '/highlighted-category-items/categories/list',
      reorder: '/highlighted-category-items/reorder'
    },

    flashSale: {
      base: `${API_BASE_URL}/admin`,
      list: '/flash-sales',
      create: '/flash-sales',
      update: (slug) => `/flash-sales/${slug}`,
      getById: (slug) => `/flash-sales/${slug}`,
      delete: (id) => `/flash-sales/${id}`,
      deleteMany: '/flash-sales/delete-many',
      updateSortOrder: (slug) => `/flash-sales/${slug}/items/sort-order`,
      softDelete: (id) => `/flash-sales/soft-delete/${id}`,
      softDeleteMany: '/flash-sales/soft-delete-many',
      restore: (id) => `/flash-sales/restore/${id}`,
      restoreMany: '/flash-sales/restore-many',

      forceDelete: (id) => `/flash-sales/force/${id}`,
      forceDeleteMany: '/flash-sales/force-delete-many',

      getSkus: '/flash-sales/skus/available',
      getCategories: '/flash-sales/categories/available-tree'
    },
    user: {
      base: `${API_BASE_URL}/admin`,
      users: '/users',
      roles: '/roles',
      getById: '/users',
      getByRole: '/by-role'
    },
    news: {
      base: `${API_BASE_URL}/admin/quan-ly-bai-viet`,
      getAll: '',
      create: '/them-bai-viet-moi',
      getBySlug: '/chinh-sua-bai-viet',
      update: '/cap-nhat-bai-viet',
      trashPost: '/chuyen-vao-thung-rac',
      forceDelete: '/xoa-vinh-vien',
      restorePost: '/khoi-phuc'
    },
    tags: {
      base: `${API_BASE_URL}/admin/tags`,
      getAll: ''
    },
    newsCategory: {
      base: `${API_BASE_URL}/admin/quan-ly-danh-muc`,
      getAll: '',
      create: '/them-danh-muc-moi',
      getBySlug: '/chinh-sua-danh-muc',
      update: '/cap-nhat-danh-muc',
      trashPost: '/chuyen-vao-thung-rac',
      forceDelete: '/xoa-vinh-vien',
      restorePost: '/khoi-phuc',
      postCount: '/tong-so-bai-viet'
    },
    paymentMethod: {
      base: `${API_BASE_URL}/admin/payment-methods`,
      list: '',
      create: '',
      update: (id) => `/${id}`,
      toggle: (id) => `/${id}/toggle`
    },

    shippingProvider: {
      base: `${API_BASE_URL}/admin/shipping-providers`,
      list: '',
      create: '',
      update: (id) => `/${id}`,
      toggle: (id) => `/${id}/toggle`
    },
    brand: {
      base: `${API_BASE_URL}/admin/brands`,
      getAll: '/',
      getById: (slug) => `/detail/${slug}`,
      create: '/create',
      update: (slug) => `/update/${slug}`,
      softDelete: '/soft-delete',
      forceDelete: '/force-delete',
      restore: '/restore',
      updateOrder: '/update-order'
    },
    reviews: {
      base: `${API_BASE_URL}/admin/reviews`,
      reply: (id) => `/${id}/reply`,
      getAll: ''
    },
    productQuestion: {
      base: `${API_BASE_URL}/admin/product-questions`,
      getAll: '/all',
      getById: (id) => `/${id}`,
      reply: (questionId) => `/reply/${questionId}`,
      toggleVisibility: (answerId) => `/answer/${answerId}/toggle`,
      toggleQuestionVisibility: (questionId) => `/${questionId}/toggle-visibility`
    }
  }
};

export const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_URL;
