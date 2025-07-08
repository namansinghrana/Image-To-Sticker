import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export interface ProcessImageParams {
  image: File;
  borderThickness: number;
  borderColor: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
  backgroundColor: {
    r: number;
    g: number;
    b: number;
  };
}

export const processImage = async (params: ProcessImageParams): Promise<Blob> => {
  const formData = new FormData();
  formData.append('image', params.image);
  formData.append('border_thickness', params.borderThickness.toString());
  formData.append('border_r', params.borderColor.r.toString());
  formData.append('border_g', params.borderColor.g.toString());
  formData.append('border_b', params.borderColor.b.toString());
  formData.append('border_a', params.borderColor.a.toString());
  formData.append('bg_r', params.backgroundColor.r.toString());
  formData.append('bg_g', params.backgroundColor.g.toString());
  formData.append('bg_b', params.backgroundColor.b.toString());

  const response = await axios.post(`${API_BASE_URL}/process`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    responseType: 'blob',
  });

  return response.data;
};