import mysql from 'mysql2/promise';
import expressMySQLSession from 'express-mysql-session';
import session from 'express-session';



let connection = await mysql.createPool({
    connectionLimit : 10,
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'asoe',
  });

  const MySQLStore = expressMySQLSession(session);
  const sessionStore = new MySQLStore({}, connection);


async function getMenuItems(){
    let res = await connection.query(
        'SELECT * FROM `products` ORDER BY product_name;'
    ).then(response => {return response});


    return res; 

}

async function getOrderDetails(table_id){
    let res = await connection.query(
        'SELECT * FROM orders_specific os '+
        'join orders o on o.order_id = os.order_id and o.table_id = os.table_id where '+
         ' os.table_id = ' + parseInt(table_id) +' and o.active = 1'
    ).then(response => {return response});
    console.log(res)

    return res; 

}

async function getUsers(){
    let res = await connection.query(
        'SELECT username,password FROM `user_login` '
    ).then(response => {return response});
    
    return Object.values(JSON.parse(JSON.stringify(res)));

}

async function insertOrderHeader(data){
    console.log("Table ID")
    console.log(data.table_id)
    let timestamp_z = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let query ='INSERT INTO `orders` (table_id, time_in, time_out,active) VALUES ( '+ parseInt(data.table_id) +',"' + timestamp_z + '","' +timestamp_z +'",'+1 +')'
    console.log("QUERY")
    console.log(query)
    let res = await connection.query(query).then(response => {return response});
    let table_id =data.table_id 
    for (let i in data.data){
        console.log("Data Array")
        console.log(data.data[i])
        let res2 = await insertOrderData(data.data[i],res[0].insertId,data.table_id)
        console.log("Res2")
        console.log(res2)
    }
    
    
    return res;

}

async function insertOrderData(orderData,order_id,tableld){
    // console.log(orderData)
    let timestamp_z = new Date().toISOString().slice(0, 19).replace('T', ' ');
    console.log("Order ID")
    console.log(order_id)
    let values = order_id + ','
    values = order_id + ','
    values += orderData.product_id +','
    values += orderData.product_quantity +','
    values += parseInt(tableld) +','
    values += '0,'

    let newValue = values.slice(0,-1)

    newValue += ")"
    let query ='INSERT INTO `orders_specific` (order_id, product_id,product_quantity,table_id,order_type) VALUES ( ' + newValue
    console.log("Query")
    console.log(query)
    try{
        let res = await connection.query(query).then(response => {return response});
        
        return res;
    }catch(err){
        console.error(err)
        // connection.release();
    }

}

async function updateOrderData(orderData,tableld,order_id){
    // console.log(orderData)
    let timestamp_z = new Date().toISOString().slice(0, 19).replace('T', ' ');
    console.log("Order ID")
    console.log(order_id)
    let values = order_id + ','
    values = order_id + ','
    values += orderData.product_id +','
    values += orderData.product_quantity +','
    values += parseInt(tableld) +','
    values += '0,'

    let newValue = values.slice(0,-1)

    newValue += ")"
    let queryDb ='INSERT INTO `orders_specific` (order_id, product_id,product_quantity,table_id,order_type) VALUES ( ' + newValue
    console.log("Query")
    // console.log(query)
    try{
        let resHOrderHeader = await connection.query(
            'SELECT * FROM `orders_specific` where table_id = ' + tableld.toString() + ' and order_id = '+ order_id 
        ).then(response => {return response});
        for(let i in orderData){
            let found = false;

            for(let j in resHOrderHeader[0]){
                console.log("OLD LINE: "+resHOrderHeader[0][j].product_id)
                console.log("NEW LINE: "+orderData[i].product_id)
                if(resHOrderHeader[0][j].product_id == orderData[i].product_id){
                    found = true;
                }
            }
            let  FINDUP = resHOrderHeader[0].find((x)=> x.product_id == orderData[i].product_id)
            console.log("FINDUP")
            console.log(resHOrderHeader[0][0])
            console.log("FINDUP")
            if (found){

                queryDb = 'update orders_specific set product_quantity = ' + orderData[i].product_quantity + ' where product_id = ' +  orderData[i].product_id
            }else{
                // delete
                console.log(orderData[i])
                queryDb = 'delete from  orders_specific where product_id = ' +  orderData[i].product_id +' and order_id = ' +order_id +' and table_id = ' + tableld
            }
        }
        // console.log(queryDb)
        // console.log(resHOrderHeader)
        let res = await connection.query(queryDb).then(response => {return response});
        
        return res;
    }catch(err){
        console.error(err)
        // connection.release();
    }

}

export  {
    connection,
    sessionStore,
    getMenuItems,
    getUsers ,
    insertOrderHeader,
    getOrderDetails,
    updateOrderData
}

