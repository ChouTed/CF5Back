import mysql from 'mysql2/promise';


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

export  {
    getMenuItems2
}

