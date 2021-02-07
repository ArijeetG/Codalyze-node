const express = require('express')
const meetingModel = require('../models/meetings')
const { URI } = require('../config')
const mongoose = require('mongoose')

const router = express.Router()

const db = (URI)
mongoose.Promise = global.Promise

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) {
        console.log(err)
    }
})

router.post('/meetings', (req, res) => {
    console.log(req.body.StartTime)
    meetingModel.find({ 'Participants.Email': `${req.body.Participants.Email}` })
        .then((doc) => {
            var flag = 0
            doc.forEach((item)=>{
                console.log(item.StartTime)
                if((new Date(`${item.StartTime}`)<=new Date(`${req.body.StartTime}`)&&new Date(`${item.EndTime}`)>new Date(`${req.body.StartTime}`)&&item.Participants.RSVP=='yes')){
                    res.send({message: `Meeting slot not available for ${req.body.Participants.Email}`})
                    flag=1
                }
            })
            console.log(flag)
            if(flag!=1){
                let msg = new meetingModel(req.body)
                msg.save()
                    .then(doc=>{
                        console.log(doc)
                        res.send(doc)
                    })
                    .catch(err=>{
                        console.log(err)
                        res.send(err)
                    })
            }
        })
        .catch(() => {
            //if (err) res.send(err)
            let msg = new meetingModel(req.body)
            msg.save()
                .then(doc => {
                    console.log(doc)
                    res.send(doc)
                })
                .catch(err => {
                    console.log(err)
                    res.send(err)
                })
        })
})

router.get('/meeting/:id', (req, res) => {
    console.log(req.params.id)
    console.log(req.query)
    meetingModel.findById({ _id: `${req.params.id}` })
        .then(doc => {
            console.log(doc)
            res.send(doc)
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
})

router.get('/meetings?', (req, res) => {
    const {page =1, limit = 10} = req.query
    if (req.query.participant) {
        meetingModel.find({ 'Participants.Email': `${req.query.participant}` }).limit(limit*1).skip((page-1)*limit).exec()
            .then((doc) => {
                console.log(doc)
                res.send(doc)
            })
            .catch((err) => {
                console.log(err)
                res.send(err)
            })
    } else {
        console.log(req.query.start, req.query.end)
        var currentDate = new Date(Date.now()).toISOString().split('T')[0]
        console.log(currentDate)
        // start = currentDate + 'T' + `${req.query.start}`
        // start = start.toString()
        // console.log(start)
        console.log(new Date(currentDate.split('-')[0], currentDate.split('-')[1], currentDate.split('-')[2], req.query.start.split(':')[0], req.query.start.split(':')[1])) //need to add 5:30hrs for IST
        var start = new Date(currentDate.split('-')[0], currentDate.split('-')[1], currentDate.split('-')[2], req.query.start.split(':')[0], req.query.start.split(':')[1])
        var end = new Date(currentDate.split('-')[0], currentDate.split('-')[1], currentDate.split('-')[2], req.query.end.split(':')[0], req.query.end.split(':')[1])
        meetingModel.aggregate([
            { $match: { $or: [{ StartTime: { $gt: start } }, { EndTime: { $lt: end } }] } }
        ])
            .then((doc) => {
                console.log(doc)
                res.send(doc)
            })
            .catch((err) => {
                console.log(err)
                res.send(err)
            })
    }
})
// router.get('/delete/:id',(req,res)=>{
//     meetingModel.findByIdAndDelete({_id: `${req.params.id}`})
//         .then((doc)=>{
//             console.log("deleted",doc)
//         })
//         .catch((Err)=>{
//             console.log(Err)
//             res.send(Err)
//         })
// })
module.exports = router