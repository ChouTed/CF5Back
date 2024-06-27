// Get the client
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { getMenuItems }from './methods.js';
import { getUsers }from './methods.js';


const app = express()
app.use(cors());
const port = 5000
app.use(express.json()); //Allows application to accept JSON



app.get('/api/getUsers', async (req,res) =>{
    let users = await getUsers();
    res.json(users[0]);
})



app.get('/api/getMenu', async (req, res) => {
    let result= await getMenuItems();
    res.json(result[0]);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.get('/api/getUsers/login', async (req, res) => {
    console.log("klithike apo to back")
    let users = await getUsers();
    console.log(users.length)
    for (let i in users){
        for (let j in users[i]){
            console.log("bebe")
            console.log(users[i][j].username)
        }
        
    }
    let user = users.find((x) => {
        // console.log(x.username + "77")
        return x.username == 'admin'
    })
    console.log(users[0])
    if (user == null){
        console.log(req.body.username)
        return res.status(400).send('Cannot Find User')
    }
    else{
        if(await bcrypt.compare(req.body.password, users.password)) {
            console.log("doulepse")
            res.send('Succes')
        }else{
            res.status(500).send('Wrong Password');
        }
    }
})


// A simple SELECT query
// try {
//     console.log('trexei to back')
//   const [results, fields] = await connection.query(
//     'SELECT * FROM `tables`'
//   );


// } catch (err) {
//   console.log(err);
// }




// // Using placeholders
// try {
//   const [results] = await connection.query(
//     'SELECT * FROM `table` WHERE `name` = ? AND `age` > ?',
//     ['Page', 45]
//   );

//   console.log(results);
// } catch (err) {
//   console.log(err);
// }