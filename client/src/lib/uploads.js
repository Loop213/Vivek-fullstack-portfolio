import api from "./api";

export async function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read the selected image."));
    reader.readAsDataURL(file);
  });
}

export async function uploadImageAsset(file, folder) {
  const dataUrl = await fileToDataUrl(file);
  const response = await api.post("/upload/image", {
    file: dataUrl,
    folder
  });

  return response.data;
}
