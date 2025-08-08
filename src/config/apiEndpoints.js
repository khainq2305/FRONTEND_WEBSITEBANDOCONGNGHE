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
      reorder: (orderId) => `/${orderId}/reorder`,
      shippingOptions: '/shippings/options',
      markAsCompleted: (orderId) => `/${orderId}/mark-completed`,
      cancel: (orderId) => `/${orderId}/cancel`,
      lookup: (code, phone) => `/lookup?code=${code}&phone=${phone}`
    },
    payment: {
      base: `${API_BASE_URL}/payment`,
      momoPay: '/momo',
      momoCallback: '/momo-callback',
      paymentMethods: '/payment-methods',
      vnpayCallback: '/vnpay-callback',
      zaloPay: '/zalopay',
      payAgain: (id) => `/${id}/pay-again`,
      vnpay: '/vnpay',
      uploadProof: (orderId) => `/${orderId}/proof`,
      viettelMoney: '/viettel-money',
      stripePay: '/stripe',
      payosPay: '/payos',
      payosWebhook: '/payos-webhook',

      updatePaymentStatus: (orderId) => `/${orderId}/update-payment-status`,
      viettelMoneyCallback: '/viettel-money/callback',
      vietqrPay: '/generate-vietqr',
      stripeWebhook: '/stripe-webhook'
    },
    returnRefund: {
      base: `${API_BASE_URL}/return-refund`,
      request: '/',
      getDetail: (id) => `/${id}/detail`,
      cancel: (id) => `/${id}/cancel`,
      getByReturnCode: (code) => `/by-code/${code}`,

      chooseMethod: (id) => `/${id}/choose-method`,
      bookPickup: (id) => `/${id}/book-pickup`
    },
    news: {
      base: `${API_BASE_URL}/tin-noi-bat`,
      featurePost: '',
      byCategory: '/theo-danh-muc',
      getBySlug: '',
      getRelated: '/bai-viet-lien-quan',
      calculateFee: '/calculate-fee',
      getAllTitle: '/all-title'
    },
    search: {
      base: `${API_BASE_URL}`,
      search: '/search-by-image',
      history: '/search/history',
      name: '/search-by-name',
      suggestions: '/suggestions',
      history: '/search/history'
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
    userPoint: {
      base: `${API_BASE_URL}/points`,
      total: '', // GET /points
      history: '/history' // GET /points/history
    },
    membership: {
      base: `${API_BASE_URL}/membership`,
      info: '/me' // GET /membership/me
    },

    news: {
      base: `${API_BASE_URL}/tin-noi-bat`,
      featurePost: '',
      byCategory: '/theo-danh-muc',
      getBySlug: '',
      getRelated: '/bai-viet-lien-quan',
      calculateFee: '/calculate-fee',
      getAllTitle: '/all-title'
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
    },
    spin: {
      base: `${API_BASE_URL}/spin`,
      rewards: '/rewards',
      status: '/status',
      roll: '/roll',
      history: '/history',
      claimTask: '/task'
    },
wallet: {
  base: `${API_BASE_URL}/wallet`,
  balance: '', // GET /
  transactions: '/transactions',

  // 👉 Thiết lập PIN
  sendPinVerification: '/send-pin-verification',
  verifyPinToken: '/verify-pin-token',
  setPin: '/set-pin',
  pinCooldown: '/pin-cooldown',
  verifyPinAndBalance: '/verify-pin-and-balance',

  // ✅ Thêm mới - Quên & đổi mã PIN
  sendForgotPin: '/pin/send-forgot',
  verifyForgotPinToken: '/pin/verify-forgot',
  resetPin: '/pin/reset',
  changePin: '/pin/change'
}
,
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
    Auth: {
      base: `${API_BASE_URL}/admin`,
      login: '/dang-nhap-dashboard',
      getUserInfo: '/account-info',
      logout: '/dang-xuat'
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
      exportStock: (id) => `/${id}/export`,
      softDelete: (id) => `/product/soft/${id}`,
      softDeleteMany: '/product/soft-delete-many',
      restore: (id) => `/product/restore/${id}`,
      restoreMany: '/product/restore-many',
      forceDelete: (id) => `/product/force/${id}`,
      updateOrderIndexBulk: '/product/update-order'
    },
    product: {
      base: `${API_BASE_URL}/admin/products`,
      create: '/create',
      list: '/list',
      getCategoryTree: '/categories/tree',
      getBrandList: '/brands/list',
      getById: (slug) => `/${slug}`,
      forceDeleteMany: '/force-delete-many',
      softDelete: (id) => `/soft/${id}`,
      softDeleteMany: '/soft-delete-many',
      restore: (id) => `/restore/${id}`,
      restoreMany: '/restore-many',
      forceDelete: (id) => `/force/${id}`,
      updateOrderIndexBulk: '/update-order'
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
      base: `${API_BASE_URL}/admin/roles`,
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
      base: `${API_BASE_URL}/admin/order`,
      list: '/list',
      getById: (id) => `/detail/${id}`,
      updateStatus: (id) => `/update-status/${id}`,
      cancel: (id) => `/cancel/${id}`,
      updatePaymentStatus: (id) => `/update-payment-status/${id}`
    }
    ,
    returnRefund: {
      base: `${API_BASE_URL}/admin`,
      getReturnsByOrder: (orderId) => `/order/${orderId}/returns`,
      updateReturnStatus: (id) => `/returns/${id}/status`,
      getReturnDetail: (id) => `/returns/${id}`,

      getRefundsByOrder: (orderId) => `/order/${orderId}/refunds`,
      updateRefundStatus: (id) => `/refunds/${id}/status`
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
      base: `${API_BASE_URL}/admin/banners`,
      list: '/list',
      create: '/create',
      getById: (slug) => `/detail/${slug}`,
      update: (slug) => `/update/${slug}`,
      delete: (id) => `/delete/${id}`,
      forceDeleteMany: '/force-delete-many',
      updateOrder: (id) => `/update-order/${id}`,
      categoriesForSelect: '/categories-for-select',
      productsForSelect: '/products-for-select'
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
      base: `${API_BASE_URL}/admin/highlighted-category-item`,
      list: '/list',
      create: '/',
      update: (slug) => `/${slug}`,
      getBySlug: (slug) => `/${slug}`,
      delete: (id) => `/${id}`,
      deleteMany: '/delete-many',
      getCategories: '/categories/list',
      reorder: '/reorder'
    },

    flashSale: {
      base: `${API_BASE_URL}/admin/flash-sales`,
      list: '/list',
      create: '/create',
      update: (slug) => `/update/${slug}`,
      getById: (slug) => `/detail/${slug}`,
      softDelete: (id) => `/soft-delete/${id}`,
      softDeleteMany: '/soft-delete-many',
      restore: (id) => `/restore/${id}`,
      updateOrder: '/update-order',
      restoreMany: '/restore-many',
      forceDelete: (id) => `/force/${id}`,
      forceDeleteMany: '/force-delete-many',
      getSkus: '/skus/available',
      getCategories: '/categories/available-tree'
    },
    user: {
      base: `${API_BASE_URL}/admin`,
      users: '/users',
      roles: '/roles',
      getById: '/users',
      getByRole: '/by-role'
    },
    news: {
      base: `${API_BASE_URL}/admin/post`,
      getAll: '',
      create: '/create',
      getBySlug: '/edit',
      update: '/update',
      trashPost: '/trash',
      forceDelete: '/force-delete',
      restorePost: '/restore'
    },
    tags: {
      base: `${API_BASE_URL}/admin/tags`,
      getAll: ''
    },
    newsCategory: {
      base: `${API_BASE_URL}/admin/post-category`,
      getAll: '',
      create: '/create',
      getBySlug: '/edit',
      update: '/update',
      trashPost: '/trash',
      forceDelete: '/force-delete',
      restorePost: '/restore',
      postCount: '/total-post'
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
    },
    spinReward: {
      base: `${API_BASE_URL}/admin/spin-rewards`,
      list: '/list',
      create: '/create',
      update: (id) => `/${id}`,
      delete: (id) => `/${id}`,
      getById: (id) => get(`${base}/${id}`),
    },
    spinHistory: {
      base: `${API_BASE_URL}/admin/spin-history`,
      list: '/list',
      getById: (id) => `/${id}`
    },
    userTask: {
      base: `${API_BASE_URL}/admin/user-tasks`,
      list: '/list',
      create: '/create',
      delete: (id) => `/${id}`
    },
    taskDefinition: {
      base: `${API_BASE_URL}/admin/task-definitions`,
      list: '/list',
      create: '/create',
      update: (id) => `/${id}`,
      delete: (id) => `/${id}`,
      getById: (id) => `/${id}`,
      createDefaultTasks: '/create-default-tasks'
    }
  }
};

export const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_URL;
