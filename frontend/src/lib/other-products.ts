export type OtherProduct = {
  name: string
  domain: string
  url: string
  tagline: string
  description: string
  highlights: string[]
}

export const OTHER_PRODUCTS: OtherProduct[] = [
  {
    name: 'WorkPilot Tools',
    domain: 'workpilottools.biz',
    url: 'https://workpilottools.biz',
    tagline: '67+ free online tools for everyday work',
    description:
      'Convert, compress, create, and edit files directly in your browser — no installs required. WorkPilot groups PDF, AI, image, audio, video, business, pregnancy, and baby & parenting tools in one place, plus practical how-to guides in the blog.',
    highlights: [
      'PDF merge, split, compress, and convert',
      'AI image tools, speech-to-text, and text-to-speech',
      'Image resize, crop, watermark, and collage maker',
      'Business utilities — invoice, QR, resume, EMI & GST calculators',
      'Pregnancy & baby tools — due date, ovulation, growth percentile',
      'BizBuilt AI — SME platform with CRM, HR, payroll & 15+ modules',
    ],
  },
  {
    name: 'English in 100 Days',
    domain: 'englishlearner.store',
    url: 'https://englishlearner.store',
    tagline: 'Spoken English for Indian learners',
    description:
      'Learn English the natural way — listen first, speak daily, and pick up grammar as you go. Built for job seekers, students, and homemakers who want confident spoken English in just 5 minutes a day, with Hindi, Bengali, Tamil, and Telugu support.',
    highlights: [
      '100-day structured program with daily 5-minute lessons',
      'AI speaking practice with pronunciation, fluency & confidence scores',
      'English Buddy — speak in Hindi, learn the English sentence instantly',
      'Real-life scenarios: interviews, restaurant, airport, and travel',
      '3-day free trial, then ₹299/month via Razorpay',
      'Bulk licenses for schools and coaching centers',
    ],
  },
]
