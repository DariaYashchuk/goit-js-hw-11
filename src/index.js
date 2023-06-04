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

const API_KEY = '37001308-90f28619d2b1daf4121817c5e';
const BASE_URL = 'https://pixabay.com/api/';

let gallerySimpleLightbox = new SimpleLightbox('.gallery a');

let pages = 1;

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
    const inputValue = refs.input.value;
    console.log(inputValue);
    if (inputValue !== '') {
      const response = await fetchImg(inputValue, pages);
      console.log(response);
      if (response.length === 0 || response.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notiflix.Notify.success(
          `Hooray! We found ${response.totalHits} images`
        );

        pages += 1;

        imgsMarkup(response.hits);

        refs.loadMoreBtn.style.display = 'block';
        gallerySimpleLightbox.refresh();
      }
    } else {
      Notiflix.Notify.failure('Please fill in the request');
    }
  } catch (error) {
    console.log(error);
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
