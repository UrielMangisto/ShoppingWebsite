import api from './api';

export const imageService = {
  getImageById: async (imageId) => {
    return api.get(`/images/${imageId}`);
  },
};

export default imageService;

