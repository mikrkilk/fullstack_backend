const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

if (!(new Set([3,5]).has(process.argv.length))) {
  console.log('Please provide the password and optionally the entry to be added as arguments: node mongo.js <password> <name> <number>')
  process.exit(1)
}


const password = process.argv[2]

const url =
  `mongodb+srv://usser:${password}@cluster0.jymbt.mongodb.net/persons?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: {
    type:String,
    unique:true,
    required:true
  },
  number: {
    type:String,
    required:true
  }
})
personSchema.plugin(uniqueValidator)

const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 3) {
    console.log('Phonebook:')
    Person
    .find({})
    .then(persons => {
        persons.map(person => console.log(person.name + ' '+person.number))
        mongoose.connection.close()
    })
    
} else {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
      })
    person.save()
    .then(result => {
      console.log(`Added ${person.name} number ${person.number} to phonebook`)
      mongoose.connection.close()
    })
    .catch(error => {
        console.log(error)
        mongoose.connection.close()})
    
}



