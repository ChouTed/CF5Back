// Get the client
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { getMenuItems }from './methods.js';
import { getUsers }from './methods.js';





const app = express();

const allowedOrigins = ['http://localhost:8080']; // Add your frontend origin here

const corsOptions = {
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true // Enable the Access-Control-Allow-Credentials CORS header
  };

app.use(cors(corsOptions))
app.use(express.json()); 
// app.use(cors());
app.use(cookieParser('mySecretkey'));
app.use(session ({
    secret: 'your-session-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))





// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "http://localhost:8080");
//     res.header('Access-Control-Allow-Credentials', true);
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//     res.header(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-Width, Content-Type, Accept"
//     );
//     next();
// }); 



app.get('/api/getUsers', async (req,res) =>{
    let users = await getUsers();
    res.json(users[0]);
})



app.get('/api/getMenu', async (req, res) => {
    let result= await getMenuItems();
    res.json(result[0]);
})



app.get('/api/login', (req, res) => {
    req.session.isAuth = true;
    res.setHeader("Access-Control-Allow-Origin", "*");
    console.log(req.session);
    res.send("hello")
    console.log(req.session.id);
})

app.post('/api/login', async (req, res) => {
    let users = await getUsers();
    let x = users[0].find(x => x.username === req.body.username)
    if (x == null){return res.status(400).send('Cannot Find User')
    }else{
            if ( req.body.password == x.password) {
                req.session.username=x;
                res.send({records:[], error:"" })
                
            }else{
                // res.status(500).send('Wrong Password');
                res.send({records:[], error:"WRONG PASSWORD!!!!" })
            }
        }
})
    

    // if (username === 'admin' && password === '123456789') {
        
    //     req.session.user=username;
    //     res.cookie('userCookie', 'cookieValue', {   httpOnly:true, secure: false});

    //     res.json({ message: 'Login successful'});
    // }else {
    //     res.status(401).json({ message: 'Invalid credentials'});
    // }


    // let user = users[0].find(x => x.username === req.body.username)
    // console.log("Body!!!!!!!!!")
    // console.log(req.body)
    // if (user == null){
    //     return res.status(400).send('Cannot Find User')
    // }
    // else{
    //     if ( req.body.password == user.password){
    //         res.send({records:[], error:"" })
            
    //     }else{
    //         // res.status(500).send('Wrong Password');
    //         res.send({records:[], error:"WRONG PASSWORD!!!!" })
    //     }
    // }



const port = 5000;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
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