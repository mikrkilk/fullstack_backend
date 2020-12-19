const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

morgan.token('json', function (req, res) { 
    return req.method==="POST"?JSON.stringify(req.body):''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'))


let persons = [
      {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    person = persons.find(person => person.id === id)
    if(person) response.status(200).json(person)
    else response.status(404).end()
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name||!body.number) {
        return response.status(400).json({ 
        error: 'content missing' 
    })}
    if(persons.find(person=>person.name === body.name)) {
        return response.status(409).json({error: 'Name must be unique'})
    }
    const person = {
        name:body.name,
        number:body.number,
        id:generateId()
    }
    persons=persons.concat(person)
    response.json(body)
})

app.get('/info', (request, response) => {
    response.send('<div>Phonebook has info for '+persons.length+' people</div><div>'+new Date(Date.now()).toString()+'</div>')
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const generateId = () => {
    let id = Math.floor(Math.random()*10000)
    let found = persons.find(person=>person.id===id)
    while(found) {
        id = Math.floor(Math.random()*10000)
        found = persons.find(person=>person.id===id)
    }
    return(id)
}