const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

let persons = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]
// ********************************************************** Persons
/////////////////////////////////////////////////////  gets

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

function formatDate(date= new Date()) {
  const now = date; // Create a specific Date object for the example
  const options = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'longOffset',
  };
  return now.toLocaleDateString('en-US', options) + ' (' + now.toLocaleTimeString('en-US', { timeZoneName: 'short' }) + ')';
}

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${formatDate()}`)
})



app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

/////////////////////////////////////////////////////  deletes
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if (person) {
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

/////////////////////////////////////////////////////  posts
app.post('/api/persons', (request, response) => {
  const body = request.body

  for (const field of ['name', 'number']) {
    if (!body[field]) {
      return response.status(400).json({ error: `${field} missing` })
    }
  }

  if (persons.some(e => e.name === body.name)) return response.status(400).json({ error: `name must be unique` })

  const person = {
    name: body.name,
    number: body.number,
    id: generatePersonsId(),
  }

  persons = persons.concat(person)
  response.json(person)
})

const generatePersonsId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}








// ********************************************************** Notes
/////////////////////////////////////////////////////  gets
app.get('/', (request, response) => {
  response.send('<h1>Hello World!!!!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

/////////////////////////////////////////////////////  posts
app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateNotesId(),
  }

  notes = notes.concat(note)

  response.json(note)
})

const generateNotesId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

/////////////////////////////////////////////////////  deletes
app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)
  if (note) {
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
  } else {
    response.status(404).end()
  }

})


const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)