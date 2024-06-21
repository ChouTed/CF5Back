// Get the client
import express from 'express';
import cors from 'cors';
import {getMenuItems} from './methods.js';



// Create the connection to database



const app = express()
app.use(cors());

const port = 5000

app.get('/getMenu', (req, res) => {
    const result= getMenuItems();
    console.log(result);
    res.send(result);
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