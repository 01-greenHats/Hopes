'use strict';

class Model {

    constructor(schema) {

        this.schema = schema;
    }

    create(record) {

        let newRecord = new this.schema(record);
        return newRecord.save();
    }

    get(_id) {
        let obj = _id ? {
            _id
        } : {};
        return this.schema.find(obj);
    }

    getOne(obj) { // console.log('----------',this.schema);
        return this.schema.findOne(obj);
    }

    getPaymentsByUserId(userId){
        return this.schema.find({userId})
    }

    getAllPosts(obj) {

        return this.schema.find(obj);
        // console.log('----------',this.schema);
        // return this.schema.findOne(obj);
    }
    // get all fav users for one donor
    getAllUsersByDonorId(obj) {

        return this.schema.find(obj).populate('favUsers');
        // console.log('----------',this.schema);
        // return this.schema.findOne(obj);
    }


    update(_id, record) {
        return this.schema.findByIdAndUpdate(_id, record, {new: true});
    }
    updateOne(_id, record) {
        return this.schema.findOneAndUpdate(_id, record, {new: true, upsert: true});
    }


    delete(_id) {
        return this.schema.findByIdAndDelete(_id);
    }
    
}

module.exports = Model;
