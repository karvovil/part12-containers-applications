import { useState, useEffect } from 'react'
import personService from './persons'

const Persons = ({ persons, filter, deleteHandler }) => {
  let filteredPersons = persons.filter(person => person.name.includes(filter))
  return( filteredPersons.map(person => <Person key={person.name} person={person} deleteHandler={deleteHandler}/> ) )
}
const Person = ({person, deleteHandler}) => {
  return (
    <li key={person.name}>{person.name} {person.number} 
      <DeleteButton deleteHandler={() => deleteHandler(person.id)} />
    </li>
  )
}
const DeleteButton =({deleteHandler}) => <button onClick={()=>deleteHandler()}>delete</button>
const Filter = ({filter, handleFilterChange}) => {
  return(
    <div>
      filter with
      <input  value={filter} onChange={handleFilterChange}/>
    </div>
  )
}
const PersonForm = ({newName, newNumber, handleNameChange, handleNumberChange, addName}) => {
  return(
    <form onSubmit={addName}>
      <div>
        name: <input value={newName} onChange={handleNameChange}/>
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}
const Notification = ({ message, waitAndClear, className }) => {

  if (message === null) {
    return null
  }
  waitAndClear()
  return (
    <div className={className}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('Name')
  const [newNumber, setNewNumber] = useState('default number')
  const [filter, setFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(serverPersons => {
        console.log('promise fulfilled')
        setPersons(serverPersons)
      })
  }, [])
  console.log('render', persons.length, 'persons')

  const addName = (event) => {
    event.preventDefault()
    const newPerson = {
      name : newName,
      number : newNumber
    }
    if(persons.map(person => person.name).includes(newPerson.name)){
      if( window.confirm(`${newPerson.name} is already in book, replace number?`) ){
        const id = persons.find(prsn => prsn.name === newPerson.name).id
        console.log(id);
        personService
          .put(id, newPerson)
            .then(returnedPerson => {
            setPersons(persons.map(person => person.id === id ? returnedPerson : person))
            setNewName("")
            setNewNumber("") 
            setNotificationMessage(`Changed number of ${returnedPerson.name}`)
          })
          .catch(error => {
            setErrorMessage(`Failure editing ${newPerson.name}. ${error.response.data.error}`)
          })
      }
    }else{  
      personService
      .create(newPerson)
      .then(addedPerson => {
        console.log(addedPerson);
        setPersons(persons.concat(addedPerson))
        setNewName("")
        setNewNumber("")
        setNotificationMessage(`Added ${addedPerson.name}`)
      })
      .catch(error => {
        setErrorMessage(`Failure adding ${newPerson.name}. ${error.response.data.error}`)
      })
    }
  }
  const deleteName = (id) => {
    if (window.confirm("Delete??")) {
      personService
      .deletePerson(id)
      .then(stat => {
        console.log(stat)
        setPersons(persons.filter(person => person.id !== id))
        setNotificationMessage(`Deleted ${persons.find(prsn=>prsn.id === id).name}`)
      })
    }
  }
  const handleClearNotify = () => {setTimeout(()=>setNotificationMessage(null), 2000)}
  const handleClearError = () => {setTimeout(()=>setErrorMessage(null), 2000)}
  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) =>{
    console.log(event.target.value)
    setFilter(event.target.value)
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} waitAndClear={handleClearNotify} className={"notification"}/>
      <Notification message={errorMessage} waitAndClear={handleClearError} className={"error"}/>
      <Filter value={filter} handleFilterChange={handleFilterChange}/>
      <h3>Add a new</h3>
      <PersonForm newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} addName={addName} />
      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} deleteHandler={deleteName}/>
    </div>
  )
}
export default App