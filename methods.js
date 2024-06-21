import mysql from 'mysql2/promise';


const connection = null;




async function getMenuItems(){
    const [results, fields] = await connection.query(
        'SELECT * FROM `tables`'
    );
    return [results, fields] ; 

}

export default 
    getMenuItems;


