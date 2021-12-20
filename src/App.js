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
  const [type, setType] = useState('All')


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
    console.log('Chạy add')
  }

  // Thay đổi trạng thái
  function changeStatus(id,inprogress){
    db.collection("todos").doc(id).update({
        inprogress: !inprogress
    }).then(()=>{
      if(type === 'Done')
      {
        for(let i =0; i<value.length;i++){
          if(value[i].id === id){
            value[i].inprogress = true
            console.log(todos)
          }
      }
        handleDone();
      }
    if(type === 'OnProgress'){
      for(let i =0; i<value.length;i++){
        if(value[i].id === id){
          value[i].inprogress = false
          console.log(todos)
        }
      }
      handleOnProgress()
    }    
    }
    )
}

  // Xóa
  function deleteTodo(id){
    db.collection("todos").doc(id).delete().then(() =>{
      const a= [];
    for(let i =0; i<value.length;i++){
      
        if(value[i].id !== id){
          
          a.push(value[i]);
        }
    }
    setValue(a);

    const b= [];
    for(let i =0; i<todos.length;i++){
        if(todos[i].id !== id){
            b.push(todos[i]);
          }
    }
    setTodos(b);})
  }

  // Sửa
  function editTodo(id){
   if(editingText!=="")
    db.collection("todos").doc(id).update({
      todo: editingText,
    }).then(()=>{
      if(type === 'Done'){
        for(let i =0; i<value.length;i++){
            if(value[i].id === id){
              value[i].todo = editingText 
              console.log(todos)
            }
        }
        handleDone();
      }
    if(type === 'OnProgress'){
      for(let i =0; i<value.length;i++){
        if(value[i].id === id){
          value[i].todo = editingText 
          console.log(todos)
        }
    }
    }    
      handleOnProgress()
    
    })
    setTodoEditing(null);
    setEditingText("");
  }

  function handleAll(){
    setValue(todos);
    setType('All');
}

function handleDone(){
    const a= [];
    for(let i =0; i<todos.length;i++){
        if(todos[i].inprogress === false)
            a.push(todos[i]);
    }
    setValue(a);
    setType('Done');
}

function handleOnProgress(){
    const a= [];
    for(let i =0; i<todos.length;i++){
        if(todos[i].inprogress === true)
            a.push(todos[i]);
    }
    setValue(a);
    setType('OnProgress');
}

function onKeyDown(e){

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
          <button className={(type === 'All') ? 
            'tabs__choice tabs__choice--choose' 
            : 'tabs__choice '} 
            onClick={handleAll}>All</button>
            <button className={(type === 'Done') ? 
              'tabs__choice tabs__choice--choose' 
            : 'tabs__choice '} 
            onClick={handleDone}>Done</button>
            <button className={(type === 'OnProgress') ? 
              'tabs__choice tabs__choice--choose' 
            : 'tabs__choice '} 
            onClick={handleOnProgress}>On progress</button>
          </div>
        {
        value.map((todo) => (
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
              <input
              className="todo__row__text" 
              onClick={()=>changeStatus(todo.id,todo.inprogress)}
              value={todo.todo}
              readOnly
              />
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
                onClick={() => setTodoEditing(todo.id, todo.todo,todo.inprogress)}
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
