const express=require('express');
const app=express();
port=9006;
const cors=require('cors')
const fs = require('fs');

app.use('/routes/uploads', express.static('images'))

app.use(express.urlencoded({extended:false}))
app.use(express.json({extended:true}));
app.use(cors())
const connectDB = require('./db/index.js');

app.use("/api/v1",require("./routes/index.js"));



app.get('/images/:imageName', async(req, res) => {
  const imageName = req.params.imageName
  const readStream = fs.createReadStream(`routes/uploads/${imageName}`)
  readStream.pipe(res)
})

connectDB().then((res)=>{
    app.listen(port,(req,res)=>{
        console.log("server started "+port);
    });
})


