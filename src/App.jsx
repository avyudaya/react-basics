import { useState, useEffect } from "react"
import axios from "axios"

const Note = ({ note, toggleImportance }) => {
  const label = note.important ? 'make not important' : 'make important'
  return (
    <li>
      {note.value}
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    axios.get("http://localhost:3001/notes")
      .then(response => {
        setNotes(response.data)
      })
      .catch(err => {
        console.log(err)
      })
  }, []);

  const addNote = (event) => {
    event.preventDefault();
    const noteObj = {
      important: Math.random() < 0.5,
      value: newNote
    }

    axios
      .post('http://localhost:3001/notes', noteObj)
      .then(response => {
        setNotes(notes.concat(response.data))
        setNewNote('')
      })
      .catch(error => {
        console.log(error)
      })
  }

  const handleNote = (event) => {
    setNewNote(event.target.value)
  }

  const toggleImportanceOf = (id) => {
    const url = `http://localhost:3001/notes/${id}`
    const note = notes.find(n => n.id == id)
    const changedNote = { ...note, important: !note.important }

    axios
      .put(url, changedNote)
      .then(response => {
        setNotes(notes.map(n => n.id != id ? n : response.data))
      })
      .catch(error => {
        console.log(error)
      })
  }

  const notesFiltered = showAll == true ? notes : notes.filter(note => note.important == true)

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'impotant' : 'all'}
        </button>
      </div>
      <ul>
        {notesFiltered.map(note => <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />)}
      </ul>

      <form onSubmit={addNote}>
        <input type="text" value={newNote} onChange={handleNote} />
        <button type="submit">Save</button>
      </form>
    </div>
  )
}

export default App