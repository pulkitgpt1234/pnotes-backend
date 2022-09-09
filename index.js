const connectToDb=require('./db');
const express = require('express')

var cors = require('cors')

connectToDb();

const app = express();
const port = process.env.PORT || 5000

//using cors
app.use(cors())
//middleware to use request's body
app.use(express.json());


//available routes
// app.get('/',(req,res)=>{
//   res.send("connection success");
// })
app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));

if(process.env.NODE_ENV == "production")
{
  app.use(express.static("pnotes/build"));
  app.listen(port, () => {
    console.log(`Pnotes listening on cloud`);
  })
}
else
{
  app.listen(port, () => {
    console.log(`Pnotes listening on port localhost:${port}`)
  })
}
