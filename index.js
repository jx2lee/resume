import { promises as fs } from 'fs'
import * as theme from 'jsonresume-theme-paper'
import puppeteer from 'puppeteer'
import { render } from 'resumed'

const args = process.argv.slice(2);
if (args.length === 0) {
    console.error('Usage: node script.js <path_to_resume.json>');
    process.exit(1);
}
const resumePath = args[0];

const resume = JSON.parse(await fs.readFile(resumePath, 'utf-8'))
const html = await render(resume, theme)

const browser = await puppeteer.launch()
const page = await browser.newPage()

await page.setContent(html, { waitUntil: 'networkidle0' })
await page.pdf({ path: resumePath.split('.').slice(0, -1) + '.pdf', format: 'a4', printBackground: true })
await browser.close()
