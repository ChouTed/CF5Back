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

app.post('/api/getUsers/login', async (req, res) => {
    // console.log("klithike apo to back")
    let users = await getUsers();
    let user = users[0].find(x => x.username === req.body.username)
    if (user == null){
        return res.status(400).send('Cannot Find User')
    }
    else{
        console.log(user)
        console.log('~~~~~~~~~~')
        console.log(req.body)
        if ( req.body.password == user.password){
            res.send('Success')
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