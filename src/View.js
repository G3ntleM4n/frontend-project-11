import { snapshot } from 'valtio/vanilla'

const header = document.querySelector('header')
const searchField = document.querySelector('#rss-search')
const submit = document.querySelector('#submit-button')

const toggleSearchForm = (status) => {
  const errorMessage = document.querySelector('.message')
  if (errorMessage) {
    errorMessage.remove()
  }

  if (status === 'enable') {
    submit.disabled = false
    submit.classList.remove('bg-blue-300')
    submit.classList.add('bg-blue-500', 'cursor-pointer')
    searchField.classList.remove('border-red-500')

  } else if (status === 'disable') {
    submit.disabled = true
    submit.classList.remove('bg-blue-500', 'cursor-pointer')
    submit.classList.add('bg-blue-300')
  }
}
const createMessage = (status, ...errors) => {
  const span = document.createElement('span')
  if (status === 'negative') {
    span.classList.add('message', 'text-red-500')
    span.textContent = errors.join(', ')

  } else if (status === 'positive') {
    span.classList.add('message', 'text-green-500')
    span.textContent = 'RSS успешно загружен'
  }
  header.lastElementChild.after(span)
}

export const updateUI = (searchState) => {
  const searchForm = snapshot(searchState)
  const { status } = searchForm

  switch (status) {
    case 'processing': {
      toggleSearchForm('disable')
      break
    }
    case 'success': {
      toggleSearchForm('enable')
      createMessage('positive')
      searchField.value = ''
      searchField.focus()
      break
    }
    case 'failed': {
      toggleSearchForm('disable')
      searchField.classList.add('border-red-500')

      const errors = searchForm.errors
      createMessage('negative', errors)
      break
    }
    default: {
      toggleSearchForm('enable')
      break
    }
  }
}