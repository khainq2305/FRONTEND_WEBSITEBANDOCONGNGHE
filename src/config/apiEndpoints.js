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
      updateProfile: '/update-profile'
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
    category: {
      base: `${API_BASE_URL}/api/client/categories`
    },
    product: {
      base: `${API_BASE_URL}/product`,
      getBySlug: (slug) => `/${slug}` // ✅ dùng slug như "iphone-15"
    },
    highlightedCategory: {
      base: `${API_BASE_URL}`,
      list: '/highlighted-categories' // 👈 route BE trả về danh mục nổi bật (public)
    },
    search: {
      base: `${API_BASE_URL}`,
      search: '/search',
      history: '/search/history'
    },
    cart: {
      base: `${API_BASE_URL}/cart`,
      add: '/add',
      list: '/my-cart', // ✅ Sửa lại cho đúng route backend
      updateQuantity: '/update-quantity', // ✔ Đúng với route backend
      deleteItem: (id) => `/item/${id}`
    },
    // Thêm vào `client` trong API_ENDPOINT:
    order: {
      base: `${API_BASE_URL}/orders`,
      create: '/create',
      calculateFee: '/calculate-fee', // 👈 thêm dòng này
      create: '/'
    },
    news: {
      base: `${API_BASE_URL}/tin-noi-bat`,
      featurePost: '',
      byCategory: '/theo-danh-muc',
      calculateFee: '/calculate-fee'
    },
    wishlist: {
      base: `${API_BASE_URL}/wishlist`,
      list: '/',
      add: (productId) => `/${productId}`,
      remove: (productId) => `/${productId}`
    }
  },
  admin: {
    product: {
      base: `${API_BASE_URL}/admin`,
      create: '/product/create',
      list: '/product/list',
      getCategoryTree: '/categories/tree',
      getBrandList: '/brands/list',
      getById: (id) => `/product/${id}`,

      softDelete: (id) => `/product/soft/${id}`,
      softDeleteMany: '/product/soft-delete-many',
      restore: (id) => `/product/restore/${id}`,
      restoreMany: '/product/restore-many',
      forceDelete: (id) => `/product/force/${id}`,
      updateOrderIndexBulk: '/product/update-order'
    },
    notification: {
      base: `${API_BASE_URL}/admin/notifications`,
      getAll: '', // GET /admin/notifications?page=...
      create: '', // POST /admin/notifications
      getById: '/:id', // GET /admin/notifications/:id
      update: '/:id', // PUT /admin/notifications/:id
      delete: '/:id', // DELETE /admin/notifications/:id
      deleteMany: '/delete-many', // POST /admin/notifications/delete-many
      updateOrder: '/update-order', // POST /admin/notifications/update-order
      forceDelete: '/force-delete/:id' // (tuỳ, nếu bạn dùng xoá cứng riêng lẻ)
    },
    category: {
      base: `${API_BASE_URL}/admin/categories`,
      getAll: '',
      getById: '/:id',
      create: '',
      update: '/:id',
      delete: '/:id',
      restore: '/restore/:id'
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
      update: (id) => `/sections/${id}`,
      delete: (id) => `/sections/${id}`,
getDetail: (id) => `/sections/${id}`,
updateOrder: '/sections/update-order' , // ✅ bổ sung dòng này
      getAllSkus: '/sections/skus' 
    },

    slider: {
      banner: {
        base: `${API_BASE_URL}/admin`,
        list: '/banners',
        create: '/banners',
        update: (id) => `/banners/${id}`,
        delete: (id) => `/banners/${id}`
      },
      placement: {
        base: `${API_BASE_URL}/admin`,
        list: '/placements',
        create: '/placements',
        update: (id) => `/placements/${id}`,
        delete: (id) => `/placements/${id}`
      },
      assignment: {
        base: `${API_BASE_URL}/admin`,
        assign: '/assignments',
        getByPlacement: (placementId) => `/placements/${placementId}/banners`,
        delete: (id) => `/assignments/${id}`
      }
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
    createQuick: '/variant-values/create-quick',

    },

    highlightedCategoryItem: {
      base: `${API_BASE_URL}/admin`,
      list: '/highlighted-category-items/list',
      create: '/highlighted-category-items',
      update: (id) => `/highlighted-category-items/${id}`,
      delete: (id) => `/highlighted-category-items/${id}`,
      deleteMany: '/highlighted-category-items/delete-many',
      getCategories: '/highlighted-category-items/categories/list',
      reorder: '/highlighted-category-items/reorder' 
    },

    flashSale: {
      base: `${API_BASE_URL}/admin`,
      list: '/flash-sales',

      create: '/flash-sales',

      update: (id) => `/flash-sale/${id}`,
      delete: (id) => `/flash-sale/${id}`,
      deleteMany: '/flash-sale/delete-many',
      restore: (id) => `/flash-sale/restore/${id}`,
      restoreMany: '/flash-sale/restore-many',
      forceDelete: (id) => `/flash-sale/force/${id}`,
      forceDeleteMany: '/flash-sale/force-delete-many',

      
      getSkus: '/flash-sales/skus/available',
      getCategories: '/flash-sales/categories/available-tree'
    },

    user: {
      base: `${API_BASE_URL}/admin`,
      users: '/users',
      roles: '/roles'
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
    brand: {
      base: `${API_BASE_URL}/admin/brands`,
      getAll: '/',
      getById: (id) => `/detail/${id}`,
      create: '/create',
      update: (id) => `/update/${id}`,
      softDelete: '/soft-delete',
      forceDelete: '/force-delete',
      restore: '/restore',
      updateOrder: '/update-order'
    },
     review: {
      base: `${API_BASE_URL}/admin/reviews`,
      getGroupedByProduct: '',               
      getBySku: (skuId) => `/${skuId}`,      
      reply: (id) => `/reply/${id}`,         
      getAll: '/all',
                        
    }
  }
};
