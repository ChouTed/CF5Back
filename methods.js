import mysql from 'mysql2/promise';


let connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'asoe',
  });


async function getMenuItems(){
    console.log("heheh")
    let resultsR = []
    let res = await connection.query(
        'SELECT * FROM `products` ORDER BY product_name;'
    ).then(response => {return response});


    return res; 

}

export  {
    getMenuItems
}

