import './sass/main.scss';
import env from './js/env';
import { refs } from './js/refs';
import { SearchEngine } from './js/searchEngine';
import imageCardTml from './templates/photoCardTpl.hbs';
import notiflix from 'notiflix';

let remainDownloadCards = null;

const searchEngine = new SearchEngine(env.baseUrl);

refs.searchBtn.addEventListener('click', searchBtnListener);
refs.loadMoreBnt.addEventListener('click', loadMoreListener);

async function searchBtnListener(e) {
  e.preventDefault();

  hideLoadMoreBtn();

  const data = await (await searchEngine.get(refs.searchInput.value)).data;

  if (data.hits.length === 0) {
    notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  } else {
    remainDownloadCards = data.totalHits - data.hits.length;
    notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    refs.galleryEl.innerHTML = imageCardTml(data.hits);
    hideLoadMoreBntIfDone();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

async function loadMoreListener(e) {
  try {
    const data = await (await searchEngine.getNext()).data;
    remainDownloadCards -= data.hits.length;

    refs.galleryEl.insertAdjacentHTML('beforeend', imageCardTml(data.hits));
  } catch (error) {
    notiflix.Notify.failure(error.message);
  } finally {
    hideLoadMoreBntIfDone();
  }
}

function hideLoadMoreBntIfDone() {
  if (remainDownloadCards === 0) {
    hideLoadMoreBtn();
    notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
  } else {
    hideLoadMoreBtn(false);
  }
}

function hideLoadMoreBtn(hide = true) {
  refs.loadMoreBnt.style.visibility = hide ? 'hidden' : 'visible';
}
