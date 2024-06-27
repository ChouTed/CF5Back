import { response } from 'express';
import mysql from 'mysql2/promise';


let connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'asoe',
  });


async function getMenuItems(){
    let res = await connection.query(
        'SELECT * FROM `products` ORDER BY product_name;'
    ).then(response => {return response});


    return res; 

}

async function getUsers(){
    let res = await connection.query(
        'SELECT username,password FROM `user_login` '
    ).then(response => {return response});
    
    return Object.values(JSON.parse(JSON.stringify(res)));

}


export  {
    getMenuItems,
    getUsers
}

