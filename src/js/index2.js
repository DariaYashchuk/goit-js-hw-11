import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import NewApiService from './imgs-api-service';

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  button: document.querySelector('button'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let gallerySimpleLightbox = new SimpleLightbox('.gallery a');
const newApiService = new NewApiService();

refs.form.addEventListener('submit', onFormSubmit);

refs.loadMoreBtn.addEventListener('click', onLoarMore);

async function onFormSubmit(e) {
  try {
    e.preventDefault();

    newApiService.query = refs.input.value;
    // const inputValue = refs.input.value;
    // const inputValue = e.currentTarget.value;
    console.log(inputValue);
    if (inputValue !== '') {
      const response = await newApiService.fetchImg();
      console.log(response);
      if (response.length === 0 || response.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notiflix.Notify.success(
          `Hooray! We found ${response.totalHits} images`
        );

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

async function onLoarMore() {
  await newApiService.fetchImg();
}
