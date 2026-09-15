import { string } from 'yup';
import { proxy, subscribe } from 'valtio/vanilla'
import { updateUI } from './View.js';

const searchSchema = string()
  .required('Не должно быть пустым')
  .url('Ссылка должна быть валидным URL')

const state = proxy({
  searchForm: {
    status: 'filling',  // processing, success, failed
    errors: [],
    links: []
  }
})

const form = document.querySelector('#search-form')

const validate = (url) => {
  if (state.searchForm.links.includes(url)) {
    state.searchForm.errors = ['Ошибка: адрес уже добавлен']
    state.searchForm.status = 'failed'  // failed
    // console.log(state.searchForm) //
    return
  }
  searchSchema.validate(url)
    .then(() => {
      state.searchForm.links.push(url)
      state.searchForm.status = 'success' // success
      // console.log(state.searchForm) //
      state.searchForm.errors = []
    })
    .catch(err => {
      state.searchForm.status = 'failed'  // failed
      // console.log(state.searchForm) //
      state.searchForm.errors = err.errors
    })
}

subscribe(state, () => updateUI(state.searchForm))

form.addEventListener('input', (e) => {
  const formData = new FormData(form)
  const url = formData.get('search')
  if (url !== '') {
    state.searchForm.status = 'filling'  // filling
    // console.log(state.searchForm) //
  }
})

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const formData = new FormData(form)
  const url = formData.get('search')
  state.searchForm.status = 'processing'  // processing
  // console.log(state.searchForm) //
  validate(url)
})
