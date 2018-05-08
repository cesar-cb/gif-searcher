import puppeteer from 'puppeteer'
import faker from 'faker'

const PAGE_URL = 'http://localhost:1234/'

let page
let browser

const width = 600
const height = 900

const search = {
  term: faker.random.word()
}

beforeAll(async () => {
  const debugMode = process.env.NODE_ENV === 'debug'
  browser = await puppeteer.launch({
    headless: !debugMode,
    slowMo: debugMode ? 50 : 0,
    args: [`--window-size=${width},${height}`, '--no-sandbox', '--disable-setuid-sandbox']
  })
  page = await browser.newPage()
  page.setViewport({ width, height })
})

afterAll(() => {
  browser.close()
})

const waitForLoad = page =>
  new Promise(resolve => {
    page.on('request', req => {
      waitForLoad(page)
    })
    page.on('requestfinished', req => {
      setTimeout(() => resolve('idle'), 0)
    })
  })

describe('Search Gif', () => {
  it(
    'Should search and display a gif',
    async () => {
      await page.goto(PAGE_URL)
      await page.waitForSelector('#searchTerm')
      await page.click('#searchTerm')
      await page.type('#searchTerm', search.term)
      await page.click('#searchGif')
      await waitForLoad(page)
      const gifImage = await page.$eval('#gifImage', el => el.src)
      expect(gifImage).not.toEqual('')
    },
    16000
  )
})
