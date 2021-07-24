import './sass/main.scss';
import env from './js/env';
import { refs } from './js/refs';
import { SearchEngine } from './js/searchEngine';
import imageCardTml from './templates/photoCardTpl.hbs';
import notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';

let remainDownloadCards = null;

const searchEngine = new SearchEngine(env.baseUrl);
const lightbox = new SimpleLightbox('.gallery a');
refs.searchBtn.addEventListener('click', searchBtnListener);
refs.loadMoreBnt.addEventListener('click', loadMoreListener);

async function searchBtnListener(e) {
  e.preventDefault();

  hideLoadMoreBtn();
  try {
    const data = await (await searchEngine.get(refs.searchInput.value)).data;

    if (data.hits.length === 0) {
      showMessage(
        env.messageType.ERROR,
        'Sorry, there are no images matching your search query. Please try again.',
      );
    } else {
      remainDownloadCards = data.totalHits - data.hits.length;
      showMessage(env.messageType.SUCCESS, `Hooray! We found ${data.totalHits} images.`);

      refs.galleryEl.innerHTML = imageCardTml(data.hits);
      lightbox.refresh();
      hideLoadMoreBntIfDone();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } catch (error) {
    showMessage(env.messageType.ERROR, error.message);
  }
}

async function loadMoreListener(e) {
  try {
    const data = await (await searchEngine.getNext()).data;
    remainDownloadCards -= data.hits.length;
    refs.galleryEl.insertAdjacentHTML('beforeend', imageCardTml(data.hits));
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight,
      behavior: 'smooth',
    });
    lightbox.refresh();
  } catch (error) {
    showMessage(env.messageType.ERROR, error.message);
  } finally {
    hideLoadMoreBntIfDone();
  }
}

function hideLoadMoreBntIfDone() {
  if (remainDownloadCards === 0) {
    hideLoadMoreBtn();
    showMessage(
      env.messageType.WARNING,
      "We're sorry, but you've reached the end of search results.",
    );
  } else {
    hideLoadMoreBtn(false);
  }
}

function hideLoadMoreBtn(hide = true) {
  refs.loadMoreBnt.style.visibility = hide ? 'hidden' : 'visible';
}

function showMessage(messageType, message) {
  notiflix.Notify[messageType](message);
}
