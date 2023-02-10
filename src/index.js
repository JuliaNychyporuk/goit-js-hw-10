import './css/styles.css';
import debounce from "lodash.debounce";
import Notiflix from "notiflix";
import { fetchCountries } from "./fetchCountries"

const DEBOUNCE_DELAY = 300;
const countryInput = document.querySelector('#search-box')
const countriesListShown = document.querySelector('.country-list')
const countriesInfoShown = document.querySelector('.country-info')

countryInput.addEventListener('input', debounce(onSearchCountryInput, DEBOUNCE_DELAY))

function onSearchCountryInput(evt) {
evt.preventDefault()
clearShownInfo()

let inputValue = evt.target.value.trim()

if (inputValue !== '') {  
    fetchCountries(inputValue).then(checkSpecificityOfRequest).catch(makeFailureRequestMessage)}
}

function checkSpecificityOfRequest (countries) {

if (countries.length === 1) {
    createCountriesHtmlList (countries)
    createCountriesHtmlInfo (countries) 
} else if (countries.length > 10) {
    Notiflix.Notify.info("Too many matches found. Please enter a more specific name.")
    clearShownInfo()
} else if (countries.length >= 2 && countries.length <= 10) {
    createCountriesHtmlList (countries)
} else if (countries.length === 0) {
    clearShownInfo()
}
}

function createCountriesHtmlList (countries) {
    const templateCountry = countries.map(({name, capital, population, flags, languages}) => {
        return `<li class="country-item">
        <img width="40" height="30" src=${flags.svg} alt="Flag" class="image-flag">
        <span>${name.official}</span></li>`}).join('')
        countriesListShown.insertAdjacentHTML('beforeend', templateCountry)
}

function createCountriesHtmlInfo (country) {
    const templateInfo = 
    `<p class="country-info">Capital: ${country[0].capital}</p>
     <p class="country-info">Population: ${country[0].population}</p>
     <p class="country-info">Languages: ${Object.values(country[0].languages)}</p>`
    countriesInfoShown.insertAdjacentHTML('beforeend', templateInfo)
    }

function clearShownInfo () {
    countriesInfoShown.innerHTML = ''
    countriesListShown.innerHTML = ''
}

function makeFailureRequestMessage () {
    Notiflix.Notify.failure('Oops, there is no country with that name')
}
