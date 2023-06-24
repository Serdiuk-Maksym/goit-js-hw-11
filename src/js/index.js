import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { findImages } from './api';

const galleryEl = document.querySelector('.gallery');
const fromEl = document.querySelector('#search-form');
const buttonEl = document.querySelector('.load-more');
const inputEl = document.querySelector('input');
let lightbox = null;
let nameImages = '';
let page = 0;
let perPage = 40;
fromEl.addEventListener('submit', create);
buttonEl.addEventListener('click', loadMore);
buttonEl.style.display = 'none';

function loadMoreOnScroll() {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.offsetHeight;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollBottom = scrollTop + windowHeight;

  if (scrollBottom >= documentHeight) {
    loadMore();
  }
}

function loadMore() {
  page += 1;
  findImages(nameImages, perPage, page)
    .then(res => {
      if (!res.data.hits.length > 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        // Знищення попереднього екземпляру simpleLightBox і очищення галереї
        const lightbox =
          document.querySelector('.gallery a').dataset.simpleLightbox;
        if (lightbox) {
          lightbox.destroy();
        }
        return createCards(res), hidingBtnLoadMore(res.data.totalHits);
      }
    })
    .catch(error => {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
}

function create(e) {
  window.addEventListener('scroll', loadMoreOnScroll);
  nameImages = '';
  page = 0;
  galleryEl.innerHTML = '';
  buttonEl.classList.remove('block');
  e.preventDefault();
  if ((e.action = inputEl.value === '')) {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  nameImages = e.action = inputEl.value;
  page += 1;
  findImages(nameImages, perPage, page)
    .then(res => {
      if (!res.data.hits.length > 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        return (
          createCards(res),
          buttonEl.classList.add('block'),
          (buttonEl.disabled = false)
        );
      }
    })
    .catch(error => {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
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
   <a class="gallery-link" href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" width="300" height="250"/>
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
  galleryEl.insertAdjacentHTML('beforeend', card);

  if (lightbox) {
    lightbox.destroy();
  }

  lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionsDelay: 250,
    disableScroll: false,
  });
  lightbox.refresh();

  if (!hidingBtnLoadMore(arr.data.totalHits)) {
    window.removeEventListener('scroll', loadMoreOnScroll);
  }
}

function hidingBtnLoadMore(total) {
  let comparison = page * perPage < total;
  if (!comparison) {
    // ...
    return false; // Повертаємо false, якщо всі зображення завантажено
  } else {
    return true;
  }
}
