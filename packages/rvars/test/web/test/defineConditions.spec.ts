import { joinURL } from 'ufo'
import { afterAll, beforeAll, describe, test } from 'vitest'
import { preview } from 'vite'
import type { PreviewServer } from 'vite'
import puppeteer from 'puppeteer'
import type { Browser } from 'puppeteer'

describe('defineConditions Browser', () => {
  let server: PreviewServer
  let pageURL: string
  let browser: Browser

  beforeAll(async () => {
    server = await preview({ root: joinURL(process.cwd(), 'test/web') })
    const addressInfo = server.httpServer.address()
    pageURL = `http://localhost:${
      typeof addressInfo === 'object' && addressInfo !== null ? addressInfo.port : 3000
    }`

    browser = await puppeteer.launch({ headless: true, defaultViewport: null })
  })

  afterAll(async () => {
    await browser.close()
    await new Promise<void>((resolve, reject) => {
      server.httpServer.close((error) => (error ? reject(error) : resolve()))
    })
  })

  test('it observes the window width', async ({ expect }) => {
    try {
      const page = await browser.newPage()
      await page.setViewport({ width: 800, height: 640, isMobile: false })
      await page.goto(pageURL)

      expect(
        await page.evaluate((listItem) => listItem.textContent, (await page.$('#mobile'))!)
      ).toBe('true')

      expect(
        await page.evaluate((listItem) => listItem.textContent, (await page.$('#tablet'))!)
      ).toBe('true')

      expect(
        await page.evaluate((listItem) => listItem.textContent, (await page.$('#laptop'))!)
      ).toBe('false')

      expect(
        await page.evaluate((listItem) => listItem.textContent, (await page.$('#desktop'))!)
      ).toBe('false')
    } catch (e) {
      expect(e).toBeUndefined()
    }
  })
})
