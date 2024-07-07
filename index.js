// Get the client
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { getMenuItems, getOrderDetails, updateOrderData }from './methods.js';
import { getUsers ,insertOrderHeader}from './methods.js';
import { deleteOrder } from './methods.js';
import { connection, sessionStore } from './methods.js';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';



const app = express();

const swaggerOptions = {
  swaggerDefinition: {
    myapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: ['./index.js'], // files containing annotations as above
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const allowedOrigins = ['http://localhost:8080', 'http://localhost:5000']; // Add your frontend origin here

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
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Enable all HTTP methods you want to support
    allowedHeaders: ['Content-Type', 'Authorization'],  
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


/**
 * @swagger
 * /api/isAuth:
 *   post:
 *     summary: Makes sure user is authorised by sending isAuth true
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isAuth:
 *                   type: boolean
 */
app.post('/api/isAuth', (req, res) => {
    if (req.session.isAuth) {
        res.json({ isAuth: true });
    } else {
        res.json({ isAuth: false });
    }
});

  
/**
 * @swagger
 * /api/getUsers:
 *   get:
 *     summary: Gets users from database
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 */
app.get('/api/getUsers', async (req,res) =>{
    let users = await getUsers();
    res.json(users[0]);
})


/**
 * @swagger
 * /api/getMenu:
 *   get:
 *     summary: Gets menu items from database
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 */
app.get('/api/getMenu', async (req, res) => {
    let result= await getMenuItems();
    // console.log(req)
    res.json(result[0]);
})

/**
 * @swagger
 * /api/getOrder/{table_no}:
 *   get:
 *     summary: Gets order from front-end.
 *     parameters:
 *       - in: path
 *         name: table_no
 *         required: true
 *         schema:
 *           type: string
 *         description: The table number to get the order from.
 *     responses:
 *       200:
 *         description: Successfully got order details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order_id:
 *                   type: integer
 *                   description: The ID of the order.
 *                 items:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of items in the order.
 *                 total_price:
 *                   type: number
 *                   description: Total price of the order.
 *       404:
 *         description: Order not found.
 */

app.get('/api/getOrder/:table_no', async (req, res) => {
    
    console.log("Parameter: "+req.params.table_no)
    let result= await getOrderDetails(req.params.table_no);
    res.json(result[0]);
})



/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Logins user by checking credentials combination from database
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: The updated data for the order
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             password:
 *               type: string
 * 
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 records:
 *                   type: array
 *                   items: {}
 *                 error:
 *                   type: string
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
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
    


/**
 * @swagger
 * /api/createOrder:
 *   post:
 *     summary: Creates a new order
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: The new orders data
 *         schema:
 *           type: object
 *           properties:
 *             table_id:
 *               type: string
 *             data:
 *               type: array
 *               items: 
 *                  type: object
 *                  properties:
 *                      product_id:
 *                          type: integer
 *                      product_quantity:
 *                          type: integer
 *                  
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 records:
 *                   type: array
 *                   items: {}
 *                 error:
 *                   type: string
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
app.post('/api/createOrder', async (req, res) => {
    console.log("body received" +JSON.stringify(req.body))
    let orderData = await insertOrderHeader(req.body);
    console.log(orderData[0].insertId)
    // console.log(JSON.stringify(orderData[0].insertId))
    let records = {order_id :orderData[0].insertId }
    res.json(records)
})


/**
 * @swagger
 * /api/updateOrder/{table_no}/{order_no}:
 *   post:
 *     summary: Updates an existing order
 *     parameters:
 *       - in: path
 *         name: table_no
 *         required: true
 *         schema:
 *           type: string
 *         description: The number or identifier of the table associated with the order
 *       - in: path
 *         name: order_no
 *         required: true
 *         schema:
 *           type: string
 *         description: The number or identifier of the order to be updated
 *       - in: body
 *         name: body
 *         required: true
 *         description: The updated data for the order
 *         schema:
 *           type: object
 *           properties:
 *             product_id:
 *               type: integer
 *             product_quantity:
 *               type: integer
 *     responses:
 *       200:
 *         description: Successfully updated order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message of successful update
 */
app.post('/api/updateOrder/:table_no/:order_no', async (req, res) => {
    console.log("body received" +JSON.stringify(req.body))
    let orderData = await updateOrderData(req.body,req.params.table_no,req.params.order_no);
    // console.log(orderData[0].insertId)
    // console.log(JSON.stringify(orderData[0].insertId))

    res.send("ok")
})


/**
 * @swagger
 * /api/deleteOrder/{order_id}:
 *   delete:
 *     summary: Deletes an order by order ID.
 *     parameters:
 *       - in: path
 *         name: order_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the order to delete.
 *     responses:
 *       200:
 *         description: Successfully deleted the order.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message of successful deletion.
 *       404:
 *         description: Order not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating the order was not found.
 */
app.delete('/api/deleteOrder/:order_id', async (req,res) => {
    let deleteResponse = await deleteOrder(req.params.order_id)
    console.log(deleteResponse)
    res.json(deleteResponse)
})



const port = 5000;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

