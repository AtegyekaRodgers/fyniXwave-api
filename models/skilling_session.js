const mongoose = require('mongoose');

const skillingSessionSchema = mongoose.Schema({
    sessionTitle: { type: String, trim: true },
    sessionDate: { type: String, trim: true }, //Date or 'continuous'
    weekDays: {type: [String]},
    presenter: { type: String, trim: true }, //trainer _id
    profilePicture: { type: String },
    cloudinaryId: { type: String },
    description: { type: String },
    tags: [{type: String, trim: true, required: false}],
    startTime: {type: String},
    endTime: {type: String },
    ongoing: {type: Boolean, required: true }, // true/false
    parentClasss: {type: String, required: false}, //will hold _id for the parent classs if applicable
    parentInstitution: {type: String, required: true}, //_id for the parent institution, default institution is Delv
    sessionAddressLink: { type: String }, //eg, Zoom meeting link 
    modifiedAt: {type: Date},
  }, { timestamps: true});

module.exports = mongoose.model('SkillingSession', skillingSessionSchema);
