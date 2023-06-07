import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  button: document.querySelector('button'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let pages = 1;
class SearchRequest {
  constructor() {
    this.searchQuery = '';
  }
  get query() {
    return this.searchQuery.trim();
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
    // pages = 1;
  }
}

const searchRequest = new SearchRequest();

const API_KEY = '37001308-90f28619d2b1daf4121817c5e';
const BASE_URL = 'https://pixabay.com/api/';

let gallerySimpleLightbox = new SimpleLightbox('.gallery a');

async function fetchImg(inputValue, pages) {
  try {
    const response = await axios(
      `${BASE_URL}?key=${API_KEY}&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pages}`
    );
    return response.data;
  } catch (error) {
    console.log(error.message);
  }
}

refs.form.addEventListener('submit', onFormSubmit);

async function onFormSubmit(e) {
  // let inputValue = '';
  try {
    e.preventDefault();
    if (searchRequest.query !== refs.input.value) {
      refs.gallery.innerHTML = '';
      refs.loadMoreBtn.style.display = 'none';
      pages = 1;
    }
    searchRequest.query = refs.input.value;
    // const inputValue = e.currentTarget.value;
    console.log(searchRequest.query);
    if (searchRequest.query !== '') {
      const response = await fetchImg(searchRequest.query, pages);
      console.log(response);
      if (response.length === 0 || response.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        refs.loadMoreBtn.style.display = 'none';
        refs.gallery.innerHTML = '';
      } else {
        if (pages === 1) {
          Notiflix.Notify.success(
            `Hooray! We found ${response.totalHits} images`
          );
        }

        imgsMarkup(response.hits);

        if (response.hits.length < 40) {
          refs.loadMoreBtn.style.display = 'none';
        } else {
          refs.loadMoreBtn.style.display = 'block';
        }
        gallerySimpleLightbox.refresh();
        pages += 1;
      }
    } else {
      Notiflix.Notify.failure('Please fill in the request');
    }
  } catch (error) {
    console.log(error);
    refs.gallery.innerHTML = '';
    refs.loadMoreBtn.style.display = 'none';
    Notiflix.Notify.failure('Oops! Something went wrong. Please try again.');
  }
}

function imgsMarkup(imgs) {
  const markup = imgs
    .map(img => {
      return `<div class="photo-card" >
      <div>
      <a class="gallery__link" href="${img.largeImageURL}">
      <img class="gallery__image" src="${img.webformatURL}" alt="${img.tags}" />
   </a>
</div>

  <div class="info">
    <p class="info-item">
      <b>Likes: ${img.likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${img.views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${img.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${img.downloads}</b>
    </p>
  </div>
</div>`;
    })
    .join('');
  refs.gallery.innerHTML += markup;
}

refs.loadMoreBtn.addEventListener('click', onFormSubmit);
