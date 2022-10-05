const express = require('express')
const cors = require('cors')
require('dotenv').config()
const morgan = require('morgan')
const mongoose = require('mongoose')
const Person = require('./models/person')
const app = express()

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)
app.use(cors())
morgan.token('postBody', request => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postBody'))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
})
const generateId = () => {
    min = Math.ceil(0);
    max = Math.floor(9999);
    return Math.floor(Math.random() * (max - min) + min)
}
app.post('/api/persons', (request, response, next) => {
    const body = request.body
    console.log( request.body )

    const person = new Person({
        id: generateId(),
        name: body.name,
        number: body.number
    })
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => next(error))
})
app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person
  .findById(id)
  .then( person => {
    if (person) {
      response.json(person)
    }else{
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
  .then(updatedPerson => {
      response.json(updatedPerson)
  })
  .catch(error => next(error))
})
  
app.get('/info', (request, response) => {
  Person
  .count()
  .then(count =>{
    response.send(`
        <p>Phonebook has info for ${count} people </>  
        <p>${new Date()} </> 
    `)
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)
  
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})