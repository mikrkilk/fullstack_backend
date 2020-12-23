require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./modules/person')
const app = express()

app.use(cors())
app.use(express.static('build'))
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
  Person.find({})
    .then(persons => response.json(persons))
})
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
  .then(person =>response.json(person))
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
    .then(person =>response.json(person))
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name||!body.number) {
        return response.status(400).json({ 
        error: 'content missing' 
    })}
    //if(persons.find(person=>person.name === body.name)) {
    //    return response.status(409).json({error: 'Name must be unique'})
    //}
    const person = new Person({
        name:body.name,
        number:body.number,
    })
    person.save().then(savedPerson => response.json(savedPerson))
    
})

app.get('/info', (request, response) => {
    response.send('<div>Phonebook has info for '+persons.length+' people</div><div>'+new Date(Date.now()).toString()+'</div>')
})

const PORT = process.env.PORT
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