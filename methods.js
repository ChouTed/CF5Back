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
    try{let res = await connection.query(
        'SELECT * FROM `products` ORDER BY product_name;'
    ).then(response => {return response});


    return res; 
    }catch (err){
        console.log(err);
        return err;
    }

    

}

async function getOrderDetails(table_id){
    try{let res = await connection.query(
        'SELECT * FROM orders_specific os '+
        'join orders o on o.order_id = os.order_id and o.table_id = os.table_id where '+
         ' os.table_id = ' + parseInt(table_id) +' and o.active = 1'
    ).then(response => {return response});
    console.log(res);

    return res; 
    }catch(err){
        console.log(err);
        return err;
    }
    

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
    let timestamp_z = new Date().toISOString().slice(0, 19).replace('T', ' ');
    console.log("Order ID")
    console.log(order_id)
    
    try{
        //retrieve existing order
        let queryDb = null;
        let resHOrderHeader = await connection.query(
            'SELECT * FROM `orders_specific` where table_id = ' + tableld.toString() + ' and order_id = '+ order_id 
        ).then(response => {return response});

        let res = null;
        //loop for received orders data details
        for(let i in orderData.data){
            let  FINDUP = resHOrderHeader[0].find((x)=> {return x.product_id == orderData.data[i].product_id})
            
            console.log("~~~~~~~~~FINDUP")
            console.log(FINDUP)
            console.log("FINDUP~~~~~~~~~")

            if (FINDUP){
                // update product_quantity when product exists
                queryDb = 'update orders_specific set product_quantity = ' + orderData.data[i].product_quantity + ' where product_id = ' +  orderData.data[i].product_id
            }else{
                // insert when it does not exist
                let values = order_id + ','
                values = order_id + ','
                values += orderData.data[i].product_id +','
                values += orderData.data[i].product_quantity +','
                values += parseInt(tableld) +','
                values += '0,'

                let newValue = values.slice(0,-1)

                newValue += ")"
                queryDb = 'INSERT INTO `orders_specific` (order_id, product_id,product_quantity,table_id,order_type) VALUES ( ' + newValue
            }
            res = await connection.query(queryDb).then(response => {return response});
        }

        console.log(queryDb)
        
        //delete no longer existing products in order
        for (let k in resHOrderHeader[0] ){
            let nonExistingProduct = orderData.data.find((x)=>{return x.product_id == resHOrderHeader[0][k].product_id })
            if(!nonExistingProduct){
                let  queryDelete = 'delete from  orders_specific where product_id = ' +  resHOrderHeader[0][k].product_id +' and order_id = ' +order_id +' and table_id = ' + tableld
                let reDelete = await connection.query(queryDelete).then(response => {return response});
                // console.log(reDelete)
            }
        }

        
        return res;
    }catch(err){
        console.error(err)
        // connection.release();
    }

}

async function deleteOrder(order_id){
    try{let query = 'DELETE FROM orders_specific WHERE order_id = ' + order_id;
        let query2 = 'DELETE FROM orders WHERE order_id = ' + order_id;
        let res = await connection.query(query).then(response => {return response});
        let res2 = await connection.query(query2).then(response => {return response});
        return res, res2;
    }catch(err){
        console.log(err)
        return err
    }

}

export  {
    connection,
    sessionStore,
    getMenuItems,
    getUsers ,
    insertOrderHeader,
    getOrderDetails,
    updateOrderData,
    deleteOrder
}

