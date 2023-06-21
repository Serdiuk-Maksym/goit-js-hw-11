export { createCards };
export { findImages };
export { hidingBtnLoadMore };
import axios from 'axios';
import { Notify } from 'notiflix';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.css';
import { nameImages } from './index';
import { galleryEl } from './index';
import { buttonEl } from './index';
export { page, perPage };
let page = 0;
let perPage = 40;

async function findImages() {
  let perPg = 40;
  perPage = perPg;
  page += 1;
  const bazUrl = 'https://pixabay.com/api/';
  const keyApi = '?key=37647312-75763e51f9f1f1c0faecc27a9';
  const auxiliaryUrl =
    '&image_type=photo&orientation=horizontal&safesearch=true';
  const respons = await axios.get(
    `${bazUrl}${keyApi}&q=${nameImages}${auxiliaryUrl}&per_page=${perPg}&page=${page}`
  );
  return respons;
}

function createCards(arr) {
  const object = arr.data.hits;
  const card = object
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return ` <div class="photo-card">
    <a class="gallery__link" href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" width = "300" height="250"/>
    </a>
    <div class="info">
    <p class="info-item">
    <b>Likes</b>
    ${likes}
    </p>
    <p class="info-item">
    <b>Views</b>
    ${views}
    </p>
    <p class="info-item">
    <b>Comments</b>
    ${comments}
    </p>
    <p class="info-item">
    <b>Downloads</b>
    ${downloads}
    </p>
    </div>
    </div> `;
      }
    )
    .join('');
  return (
    galleryEl.insertAdjacentHTML('beforeend', card),
    new simpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionsDelay: 250,
      disableScroll: false,
    })
  );
}

function hidingBtnLoadMore(total) {
  let comparison = page * perPage < total;
  if (!comparison) {
    (buttonEl.disabled = true),
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
  } else {
    return;
  }
}