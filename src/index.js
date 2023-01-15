import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const searchCountry = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchCountry.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(evt) {
  evt.preventDefault();
  const searchCountryValue = searchCountry.value.trim();
  fetchCountries(searchCountryValue)
    .then(returnedCountries)
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
    });
}

function oneCountryInfo({ flags, name, capital, population, languages }) {
  return `
      <div class="container">
        <div class="box">
          <img class="img" src="${flags.svg}" alt="${
    name.official
  }" width="100" />
          <h2 class="name">${name.official}</h2>
        </div>
        <p class="capital"><span class="country-info__weight">Capital:</span> ${capital}</p>
        <p class="population"><span class="country-info__weight">Population:</span> ${population}</p>
        <p class="languages"><span class="country-info__weight">Languages:</span> ${Object.values(
          languages
        )}</p>
      </div>
    `;
}

function oneCountryList({ flags, name }) {
  return `
    <li class="list-item">
      <img class="list-item__img" src="${flags.svg}" alt="${name.official}" width="200" />
      <h2 class="list-item__name">${name.official}</h2>
    </li>
    `;
}

function returnedCountries(countries) {
  if (countries.status === 404) {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    Notify.failure('Oops, there is no country with that name');
  }
  if (countries.length >= 1 && countries.length < 10) {
    const markup = countries.map(country => oneCountryList(country));
    countryInfo.innerHTML = markup.join('');
    countryList.innerHTML = '';
  }
  if (countries.length === 1) {
    const markup = countries.map(country => oneCountryInfo(country));
    countryInfo.innerHTML = markup.join('');
    countryList.innerHTML = '';
  }
  if (countries.length >= 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  }
}
