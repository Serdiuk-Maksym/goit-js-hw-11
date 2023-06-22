import axios from 'axios';
export { findImages };

async function findImages(name, perPg, pag) {
  const bazUrl = 'https://pixabay.com/api/';
  const keyApi = '?key=37647312-75763e51f9f1f1c0faecc27a9';
  const auxiliaryUrl =
    '&image_type=photo&orientation=horizontal&safesearch=true';
  const respons = await axios.get(
    `${bazUrl}${keyApi}&q=${name}${auxiliaryUrl}&per_page=${perPg}&page=${pag}`
  );
  return respons;
}
