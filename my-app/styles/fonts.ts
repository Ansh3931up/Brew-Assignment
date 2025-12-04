import { Red_Hat_Display, DM_Sans } from 'next/font/google'

export const headingFont = Red_Hat_Display({
  subsets: ['latin'],
  variable: '--font-heading'
})

export const bodyFont = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body'
})

export const fonts = {
  heading: headingFont,
  body: bodyFont
}
