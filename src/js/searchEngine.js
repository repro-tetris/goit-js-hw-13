import axios from 'axios';

const PAGE_DEFAULT = 1;
const PER_PAGE_DEFAULT = 20;

export class SearchEngine {
  curPage;
  perPage;
  searchStr;
  #baseUrl = null;
  constructor(
    baseUrl,
    options = {
      curPage: PAGE_DEFAULT,
      perPage: PER_PAGE_DEFAULT,
    },
  ) {
    this.#baseUrl = baseUrl;
    this.curPage = options.curPage;
    this.perPage = options.perPage;
  }

  // get
  async get(searchStr) {
    this.curPage = PAGE_DEFAULT;
    this.searchStr = searchStr;
    return await axios.get(this.#buildUrl());
  }

  #buildUrl() {
    return `${this.#baseUrl}${this.searchStr}&page=${this.curPage}&per_page=${this.perPage}`;
  }

  async getNext() {
    this.curPage++;
    return await axios.get(this.#buildUrl());
  }
}
