const state = {
  term: ''
}

const API_KEY = '0qyagM2WTPkO5DQgT3mcFPZfiwzxmJr5'

const searchButton = document.getElementById('searchGif')
const searchInput = document.getElementById('searchTerm')
const gifImageTag = document.getElementById('gifImage')
const loading = document.getElementById('loadingContainer')

const searchGif = async term => {
  const res = await fetch(
    `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${term}&limit=25&offset=0`
  )

  return res.json()
}

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const changeImgSrc = (imgTag, src) =>
  new Promise((resolve, reject) => {
    imgTag.src = src
    imgTag.onload = () => resolve()
  })

const handleElementVisibility = (element, state) =>
  (element.style.display = state)

const changeStateItem = (scope, key, val) => (scope[key] = val)

const changeStateTerm = e => changeStateItem(state, 'term', e.target.value)

const changeGif = async term => {
  const gifObj = await searchGif(term)
  const randomIndex = random(0, gifObj.data.length - 1)
  const gifUrl =
    gifObj.data.length === 0
      ? 'https://cdn.dribbble.com/users/547471/screenshots/3063720/not_found.gif'
      : await gifObj.data[randomIndex].images.original.url

  await changeImgSrc(gifImageTag, gifUrl)
}

const resetSearch = (inputTag, scope) => {
  inputTag.value = ''
  inputTag.blur()
  changeStateItem(scope, 'term', '')
}

const handleFormSubmit = async e => {
  e.preventDefault()

  const term = state.term

  if (term.trim() === '') {
    return
  }

  try {
    handleElementVisibility(loading, 'flex')
    resetSearch(searchInput, state)
    await changeGif(term)
  } catch (error) {
    throw new Error(error)
  } finally {
    handleElementVisibility(loading, 'none')
    searchInput.focus()
  }
}

searchButton.addEventListener('click', handleFormSubmit)

searchInput.addEventListener('input', changeStateTerm)
