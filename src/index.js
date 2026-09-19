import { string, setLocale } from 'yup';
import { proxy, subscribe } from 'valtio/vanilla'
import { updateUI } from './View.js';
import i18next from 'i18next';
import resources from './locales/index.js';

const newInstance = i18next.createInstance()

newInstance.init({
  lng: 'ru',
  debug: false,
  resources,
}).then(() => {

  setLocale({
    mixed: {
      required: () => ({ key: 'empty' }),
    },
    string: {
      url: () => ({ key: 'wrong' }),
    },
  })

  // entered string is required and must be url
  const searchSchema = string()
    .required()
    .url()

  const state = proxy({
    searchForm: {
      status: 'filling',  // processing, success, failed
      errors: [],
      links: []
    }
  })

  const form = document.querySelector('#search-form')

  // setting localization
  document.querySelector('h1').textContent = newInstance.t('header.h1')
  document.querySelector('#quote').textContent = newInstance.t('header.quote')
  document.querySelector('#headerLabel').textContent = newInstance.t('header.label')
  document.querySelector('#rss-search').placeholder = newInstance.t('header.placeholder')
  document.querySelector('#submit-button').textContent = newInstance.t('header.submitButton')
  document.querySelector('#rss-example').textContent = newInstance.t('header.example')

  // validate entered URL
  const validate = (url) => {
    if (state.searchForm.links.includes(url)) {
      state.searchForm.errors = [newInstance.t('header.messages.exists')]
      state.searchForm.status = 'failed'  // failed
      console.log(state.searchForm) //
      return
    }
    searchSchema.validate(url)
      .then(() => {
        state.searchForm.links.push(url)
        state.searchForm.status = 'success' // success
        console.log(state.searchForm) //
        state.searchForm.errors = []
      })
      .catch(err => {
        state.searchForm.status = 'failed'  // failed
        console.log(state.searchForm) //
        state.searchForm.errors = err.errors.map(({ key }) => newInstance.t(`header.messages.${key}`))
      })
  }

  // subscribe View.js on change of state
  subscribe(state, () => updateUI(state.searchForm, newInstance))

  // when user inputs address
  form.addEventListener('input', (e) => {
    const formData = new FormData(form)
    const url = formData.get('search')
    if (url !== '') {
      state.searchForm.status = 'filling'  // filling
      console.log(state.searchForm) //
    }
  })

  // when "Add" button is pressed
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(form)
    const url = formData.get('search')
    state.searchForm.status = 'processing'  // processing
    console.log(state.searchForm) //
    validate(url)
  })
}).catch((err) => {
  console.error('Ошибка инициализации i18next:', err)
})