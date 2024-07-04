// Get the client
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { getMenuItems, getOrderDetails, updateOrderData }from './methods.js';
import { getUsers ,insertOrderHeader}from './methods.js';
import { connection, sessionStore } from './methods.js';




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
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 1000 * 60 * 60 * 8, // 8 hours
        secure: false,
    }
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



app.post('/api/isAuth', (req, res) => {
    if (req.session.isAuth) {
      res.json({ isAuth: true });
    } else {
      res.json({ isAuth: false });
    }
  });

  

app.get('/api/getUsers', async (req,res) =>{
    let users = await getUsers();
    res.json(users[0]);
})



app.get('/api/getMenu', async (req, res) => {
    let result= await getMenuItems();
    // console.log(req)
    res.json(result[0]);
})

app.get('/api/getOrder/:table_no', async (req, res) => {
    
    console.log(req.params.table_no)
    let result= await getOrderDetails(req.params.table_no);
    res.json(result[0]);
})

app.get('/api/login', (req, res) => {
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
                req.session.isAuth = true; //Marks session as authenticated
                req.session.save(err => {
                    if (err) {
                      console.error(err);
                      return res.status(500).send('Internal Server Error');
                    }
                    res.send({ records: [], error: "" });
                  });
            }else {
                  res.send({ records: [], error: "WRONG PASSWORD!!!!" });
            }
        }
})
    

app.post('/api/createOrder', async (req, res) => {
    console.log("body received" +JSON.stringify(req.body))
    let orderData = await insertOrderHeader(req.body);
    console.log(orderData[0].insertId)
    // console.log(JSON.stringify(orderData[0].insertId))
    let records = {order_id :orderData[0].insertId }
    res.json(records)
})


app.post('/api/updateOrder/:table_no/:order_no', async (req, res) => {
    console.log("body received" +JSON.stringify(req.body))
    let orderData = await updateOrderData(req.body,req.params.table_no,req.params.order_no);
    // console.log(orderData[0].insertId)
    // console.log(JSON.stringify(orderData[0].insertId))

    res.send("ok")
})


const port = 5000;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

