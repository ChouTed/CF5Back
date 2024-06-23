import mysql from 'mysql2/promise';


let connection = null;

connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'asoe',
  });




async function getMenuItems(){
    const [results, fields] = await connection.query(
        'SELECT * FROM `tables`'
    ).then(response => (this.results = response));

    // console.log(results)
    return JSON.stringify(results); 

}

export default {
    getMenuItems
}

