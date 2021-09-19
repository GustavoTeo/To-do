const {request, response}=require('express');
const express = require('express');
const { v4: uuidv4 } = require('uuid')
const app = express();

app.use(express.json())


function checkExistsUserAccount(request, response, next){
    const { username } = request.headers;

    const user = users.find(user => user.username == username);

    if(!user){
        return response.status(404).send({error:"User not exists"})
    }

    request.user = user;
    return next();
}

const users = []

app.post('/users', (request, response) => {
    const { name, username } = request.body
   if(users.some(user => user.username === username)){
       return response.status(400).send({error:"User already exists"})
   }
    let user = {
        id: uuidv4(),
        name,
        username,
        todos:[]
    };
    users.push(user);
    return response.status(201).send(user);
})

app.get('/todos', checkExistsUserAccount, (request, response) => {
    const { user } = request;
    return response.status(200).json(user.todos)
})

app.post('/todos', checkExistsUserAccount, (request, response) => {
    const { user } = request;
    const { title, deadline } = request.body;
    let todo = {
        id: uuidv4(),
        title,
        done:false,
        deadline: new Date(deadline),
        created_at: new Date(),
    }
    user.todos.push(todo)
    return response.status(201).send()
})

app.put('/todos/:id', checkExistsUserAccount, (request, response) => {
    const { user } = request;
    const { title, deadline } = request.body;
    const { id } = request.params;

    let modifyTodo = user.todos.find(todo => todo.id == id);
    if(!modifyTodo){
        return response.status(404).send({error:"ToDo not found"})
    }

    modifyTodo.title = title;
    modifyTodo.deadline = new Date(deadline);

    return response.status(201).send(user);
})

app.patch('/todos/:id/done', checkExistsUserAccount, (request, response) => {
    const { user } = request;
    const { id } = request.params;

    let modifyTodo = user.todos.find(todo => todo.id == id);
    if(!modifyTodo){
        return response.status(404).send({error:"ToDo not found"})
    }
    modifyTodo.done = true;

    return response.status(201).send(user);
})

app.delete('/todos/:id', checkExistsUserAccount, (request, response) => {
    const { user } = request;
    const { id } = request.params;

    let modifyTodo = user.todos.find(todo => todo.id == id);
    if(!modifyTodo){
        return response.status(400).send({error:"ToDo not found"})
    }

   user.todos.splice(modifyTodo, 1)

    return response.status(200).send(user);
})






app.listen(3333)