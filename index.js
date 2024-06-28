// Get the client
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { getMenuItems }from './methods.js';
import { getUsers }from './methods.js';




const app = express()
app.use(cors());
app.use(session ({
    secret: 'secret key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30000 }
}))

app.use(express.json()); //Allows to accept JSON

const port = 5000

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-Width, Content-Type, Accept"
    );
    next();
}); 



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

// app.get('/api/login', (req, res) => {
    
//     console.log(req.session);
//     res.send("hello")
//     console.log(req.session.id);
// })

app.post('/api/login', async (req, res) => {
    req.session.isAuth = true;
    let users = await getUsers();
    

    let user = users[0].find(x => x.username === req.body.username)
    console.log("Body!!!!!!!!!")
    console.log(req.body)
    if (user == null){
        return res.status(400).send('Cannot Find User')
    }
    else{
        if ( req.body.password == user.password){
            res.send({records:[], error:"" })
            
        }else{
            // res.status(500).send('Wrong Password');
            res.send({records:[], error:"WRONG PASSWORD!!!!" })
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