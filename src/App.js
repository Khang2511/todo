import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import './App.css';
import './reset.css'
import db from './firebase_config';
import { useState } from 'react';
import { useEffect } from 'react';

function App() {
  const [todoInput,setTodoInput] = useState('');
  const [todos, setTodos] = useState([]);
  const [todoEditing, setTodoEditing] = useState(null)
  const [editingText, setEditingText] = useState("")
  const [value, setValue]=useState([])

  useEffect(()=>{
    getTodos();
  },[])
  

  function getTodos(){
    db.collection("todos").orderBy("timeStamp").onSnapshot(function(querySnapshot){
      setTodos(querySnapshot.docs.map((doc)=>(
        {
          id: doc.id,
          todo: doc.data().todo,
          inprogress: doc.data().inprogress,
        }
      )))
      setValue(querySnapshot.docs.map((doc)=>(
        {
          id: doc.id,
          todo: doc.data().todo,
          inprogress: doc.data().inprogress,
        }
      )))
    }
    )
  }

  function addTodo(e){
    // Chặn refresh
    e.preventDefault();

    // Thêm dữ liệu vào firebase
    if (todoInput!== "") {
      db.collection("todos").add({
        inprogress: true,
        todo: todoInput,
        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
    setTodoInput('');
    
  }

  // Thay đổi trạng thái
  function changeStatus(id,inprogress){
    db.collection("todos").doc(id).update({
        inprogress: !inprogress
    })
}

  // Xóa
  function deleteTodo(id){
      db.collection("todos").doc(id).delete();
  }

  // Sửa
  function editTodo(id){
   if(editingText!=="")
    db.collection("todos").doc(id).update({
      todo: editingText,
    });

    setTodoEditing(null);
    setEditingText("");
  }

  function handleAll(){
    setValue(todos);
}

function handleDone(){
    const a= [];
    for(let i =0; i<todos.length;i++){
        if(todos[i].inprogress === false)
            a.push(todos[i]);
    }
    setValue(a);
}

function handleOnProgress(){
    const a= [];
    for(let i =0; i<todos.length;i++){
        if(todos[i].inprogress === true)
            a.push(todos[i]);
    }
    setValue(a);
}

function onKeyDown(e){
  console.log(e.key)
  console.log(todoEditing)

  if(e.key === 'Enter'){
    editTodo(todoEditing);
  }
}

  return (
    <div className="App">
      <header className="App-header">
        <h1>Todo-list</h1>
        <div className='todo'>
        <form >
          <input
          value={todoInput}
          onChange={(e) => {
            setTodoInput(e.target.value)
          }}
          ></input>
          <button onClick={addTodo}>Add</button>
        </form>
        <div className='tabs'>
          <button className="tabs__choice" onClick={handleAll}>All</button>
            <button className="tabs__choice" onClick={handleDone}>Done</button>
            <button className="tabs__choice" onClick={handleOnProgress}>On progress</button>
          </div>
        {value.map((todo) => (
          <div 
          key={todo.id} 
          className={todo.inprogress ? 'todo__row ' 
          : 'todo__row todo__row--complete'} 
          >
            {todoEditing === todo.id ? 
            (
              <form>
                <input
                type="text"
                onChange={(e) => setEditingText(e.target.value) }
                onKeyDown={onKeyDown}
                defaultValue={todo.todo}
                />
              </form>
            ) 
            : 
            (
              <div 
              className="todo__row__text" 
              onClick={()=>changeStatus(todo.id,todo.inprogress)}
              >{todo.todo}</div>
            )}
            {todoEditing === todo.id ? 
            (
              <div className="todo__row__button">
                <button 
                className="todo__row__btn"
                type='submit'
                onClick={() => editTodo(todo.id)}
                >Submit
                </button>
              </div>
            )
            :
            (
              <div className="todo__row__button">
                <button 
                className="todo__row__btn"
                onClick={()=>deleteTodo(todo.id)}
                >Delete</button>
                <button 
                className="todo__row__btn"
                onClick={() => setTodoEditing(todo.id)}
                >Edit
                </button>  
              </div>
            )}
             
        </div>
        ))}
          
        </div>
      </header>
    </div>
  );
}

export default App;
