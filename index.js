const express =require("express");
const users=require("./sample.json");
const cors=require('cors');
const fs =require("fs");


const app=express();
app.use(express.json());
const port = 8000;

app.use(cors({ origin: 'http://localhost:5173',
methods:["GET","POST", "PATCH", "DELETE"] }));


//Display All User
app.get("/users",(req,res) =>{

    fs.readFile('./sample.json', 'utf8', (err, users) => {
        if (err) {
          console.error(err);
          return;
        }
        return res.json(JSON.parse(users));
      });

    
});

// Delete user detail
app.delete("/users/:id",(req,res)=>{
    let id = Number(req.params.id);
    let filteredUsers=users.filter((user) => user.id !== id);

    fs.writeFile("./sample.json", JSON.stringify(filteredUsers), err => {
        if (err) {
          console.error(err);
          return res.json(err)
        } else {
            return res.json(filteredUsers)
        }
      });

});

// Add New User
app.post("/users",(req,res) => {
  let {name,age,City} = req.body;
  if(!name || !age || !City){
    res.status(400).send({message: "All Fields Required"});
  }
  let id = Date.now();
  users.push({id, name, age, City});

  fs.writeFile("./sample.json", JSON.stringify(users), err => {
    if (err) {
      console.error(err);
      return res.json(err)
    } else {
        return res.json({message: "User Details added Success"})
    }
  });
});

// Update User Route
app.patch("/users/:id",(req,res) => {
  let id = Number(req.params.id); 
  let {name,age,City} = req.body;
  if(!name || !age || !City){
    res.status(400).send({message: "All Fields Required"});
  }
  let index = users.findIndex((user) => user.id == id);
  users.splice(index,1,{ ...req.body });

  fs.writeFile("./sample.json", JSON.stringify(users), err => {
    if (err) {
      console.error(err);
      return res.json(err)
    } else {
        return res.json({message: "User Details Updated Success"})
    }
  });

});



app.listen(port,(err) => {
    console.log(`App is running in port ${port}`);
});

