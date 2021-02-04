//to grab the things needed
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

//to create a schema
const classsSsessionSchema = new Schema({
    classs: { type: Schema.Types.ObjectId, ref: "Classs"},
    ssession: { type: Schema.Types.ObjectId, ref: "Ssession"}
});

classsSsessionSchema.plugin(uniqueValidator);
//to turn the schema into a model, then export that model
module.exports = mongoose.model("ClasssSsession", classsSsessionSchema);
