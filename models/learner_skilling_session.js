const mongoose = require('mongoose');

const { Schema } = mongoose;

//to create a schema
const learnerSkillingSessionSchema = new Schema({
    learner: { type: Schema.Types.ObjectId, ref: "Learner"},
    session: { type: Schema.Types.ObjectId, ref: "SkillingSession"}
});

//turn the schema into a model, then export that model
module.exports = mongoose.model("LearnerSkillingSession", learnerSkillingSessionSchema);
