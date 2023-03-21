import express from 'express'
import config from 'config'
import { engine } from 'express-handlebars'
import { Configuration, OpenAIApi } from 'openai'

const app = express()

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')
app.use(express.urlencoded({ extended: true }))

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY ?? config.get('OPEN_AI_KEY'),
})
const openai = new OpenAIApi(configuration)

app.get('/', (_, res) => {
  res.render('index')
})

app.post('/', async (req, res) => {
  const code = req.body.content
  const content = `
    Объясни, что делает этот код?
    ${code}
  `

  const messages = [{ role: 'user', content }]

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
    })

    res.render('index', {
      code,
      message: completion.data.choices[0].message,
    })
  } catch (e) {
    console.error(e)
  }
})

app.listen(3000)
