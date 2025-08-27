import 'dotenv/config'

import fs from 'node:fs/promises'

import OpenAI from 'openai'

async function main() {
  const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    // eslint-disable-next-line no-process-env
    apiKey: process.env.OPENROUTER_API_KEY
  })

  const completion = await openai.chat.completions.create({
    model: 'google/gemini-2.5-flash-image-preview',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            // text: "add an extremely tiny banana that fits vertically between the man's 2 outstretched fingers"
            text: "make the man holding an extremely tiny banana vertically. don't change his hand gesture. the banana should fit inbetween his thumb and index finger"
            // text: "make this man holding a very small banana. don't change his hand gesture at all. just add the banana and make it look natural like he's holding it. the banana should be vertical and fit between his thumb and index finger. the banana should be a tiny bit smaller than his hand."
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${await fs.readFile('./media/lil-dicky.jpg', { encoding: 'base64' })}`
            }
          }
        ]
      }
    ]
  })

  const imageUrl0 = (completion.choices[0]!.message as any).images?.[0]
    ?.image_url?.url
  const imageParts = imageUrl0!.split(',')
  const imageType = imageParts[0]?.includes('image/png') ? 'png' : 'jpg'
  const imageData = imageParts[1]!
  await fs.writeFile(
    `./media/out-lil-dicky-12.${imageType}`,
    Buffer.from(imageData, 'base64')
  )
}

await main()
