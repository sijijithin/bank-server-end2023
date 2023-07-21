  const mongoose =require('mongoose')
  
  // get db connection String
  const connectionString=process.env.DATABASE

  mongoose.connect(connectionString,{
    useUnifiedTopology:true,
    useNewUrlParser:true
  }).then(()=>{
    console.log("Mongodb Atlas connected successfully...");
  }).catch((err)=>{
    console.log(`MongodbAtlas Connection failed,${err}`);
  })