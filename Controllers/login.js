const { client } = require('../db/connect');
const bcrypt = require('bcrypt');
const { CommandCompleteMessage } = require('pg-protocol/dist/messages');

// Registration code
const register = async (req,res) =>{
   
 let  {username, email, password} = req.body;

  
  if (!username || !email || !password){
    res.send({message:'Please enter all values'});
  }
  
  if (password.length < 5){
    res.send({message:'Please enter a strong password'});
  } 

  const hashedPassword = await bcrypt.hash(password,5);
  
  console.log({username, email, hashedPassword});

  await client.query(`SELECT * FROM users WHERE email = '${email}'`, (err,result)=>{
    //Proper error handlling needs to be added 
    if (err) {
      console.log(err)
    }

    if (result.rows.length>0){
      res.send('Email Already Exist');
    }
  });       
    
  await client.query(`insert into users (username,email, password) values ('${username}','${email}', '${hashedPassword}');`);         
  res.send("User added successfully")
      
}

//Login code
const login = async  (req,res)=> {
  const {email, password} = req.body;

const enteredPassword = await client.query (`SELECT password FROM users where email = $1;`,[email],(err,result)=> {

  try {
  
  if(result.rows.length===0){
  res.send('Please enter a valid password')
  } else {

    const validPass = result.rows[0].password;
    console.log(validPass);
    bcrypt.compare(password,validPass,(err,isMatch)=>{
      if (err) {
        console.log(err);
      }

      if (isMatch) {
        console.log("Successful")
      } else {
        //password is incorrect
        console.log("Password is incorrect");
      }



    });
  }

  } catch(error){

    console.log(err);
  }






});





}


//Dashboard
const dashboard = async (req,res) =>{
//    client.query('SELECT * FROM users');

  const a =  
    await client.query('SELECT * from users;');

//   res.send("reached");
  res.send(a.rows);
      
}



module.exports = {login, register, dashboard}