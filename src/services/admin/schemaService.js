import API from "../common/api";

const BASE_URL = "/admin/post-seo";

export const schemaService = {
  // Lấy schema của một post
  getPostSchema: async (postId) => {
    try {
      const response = await API.get(`${BASE_URL}/${postId}/schema`);
      return response.data;
    } catch (error) {
      console.error('Error getting post schema:', error);
      throw error;
    }
  },

  // Cập nhật schema cho post
  updatePostSchema: async (postId, schema) => {
    try {
      const response = await API.put(`${BASE_URL}/${postId}/schema`, {
        schema
      });
      return response.data;
    } catch (error) {
      console.error('Error updating post schema:', error);
      throw error;
    }
  }
};
