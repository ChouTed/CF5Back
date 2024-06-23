// Get the client
import express from 'express';
import cors from 'cors';
import getMenuItems from './methods.js';
import mysql from 'mysql2/promise';



// Create the connection to database



const app = express()
app.use(cors());
const port = 5000

let connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'asoe',
  });

async function getMenuItems2(){
    console.log("heheh")
    let resultsR = []
    let res = await connection.query(
        'SELECT * FROM `tables`'
    ).then(response => {return response[0]});


    return res; 

}

app.get('/getMenu', async (req, res) => {
    let result= await getMenuItems2();
    console.log(typeof(result));
    console.warn(result[0])
    res.send(result[0]);
})

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