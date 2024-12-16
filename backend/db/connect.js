import { createConnection } from 'mysql2'

const connection = createConnection({
  // host: 'localhost',
  host: 'host.docker.internal', // using this as my db is in local pc not in docker container
  user: 'root',
  password: 'anonymous',
  database: 'piedpiper'
})
connection.connect(function (err) {
  if(err){
    console.log("error occurred while connecting");
    console.log(err);
  }
  else{
    console.log("connection created with Mysql successfully");
  }
})