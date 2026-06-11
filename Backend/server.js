require ('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const app = express()
const cors = require('cors')
app.use(cors())

app.use(express.json())
const authRoutes = require('./routes/authRoutes')
app.use('/api/auth',authRoutes)

const jobRoutes = require('./routes/jobRoutes')
app.use('/api/job',jobRoutes)
mongoose.connect(process.env.MONGO_URI,{
    serverSelectionTimeoutMS:5000,
    family:4,
})
.then(()=>console.log('Mongodb Connected'))
.catch((err)=>console.log(err))

app.get('/',(req,res)=>{
    res.send('Job Board API is running')
})

app.listen(process.env.PORT, ()=>
console.log('Server running'));