const mongoose = require('mongoose')
const validator = require('validator')
const meetingSchema = new mongoose.Schema({
    Title : {
        type : String,
        required: true,
    },
    Participants: {
        Name : {
            type: String,
            required: true,
        },
        Email : {
            type: String,
            required: true,
            validate: (value)=>{
                return validator.isEmail(value)
            }
        },
        RSVP : {
            type: String,
            required: true,
        }
    },
    StartTime: {
        type : Date,
        required: true
    },
    EndTime: {
        type: Date,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Meeting_test', meetingSchema)