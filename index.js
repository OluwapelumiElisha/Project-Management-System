require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
app.use(morgan('dev'))
app.use(express.json())
//  it allow u to get data from backend
app.use(cors())


const userRoute = require('./src/route/Auth')
const projectRoute = require('./src/route/Project')

app.use(userRoute)
app.use(projectRoute)







const mongoApiconnect = process.env.mongoURL




const start = async ()=>{
    try {
        const conn = await mongoose.connect(mongoApiconnect)
        console.log('Connected to DB');
        if (conn) {
        app.listen(process.env.Port, 'localhost', ()=>{
        console.log('Hello World am running on this port');
    })
        }
    } catch (error) {
        console.log(error);
    }
}
start()