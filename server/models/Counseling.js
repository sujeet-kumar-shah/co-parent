import mongoose, { model } from "mongoose";

const QyerySchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name :{
      type:String,
      require:true,
      default:'',
    },
    status:{
      type:String,
      require:true,
      default:'pending',
    },
    query_type:{
     type:String,
     require:true
    },
    message:{
       type:String,
    },
    contact_number:{
        type:Number,
        required:true,
    },
    percent:{
        type:Number,
        required:false,
        default:"0"
    },
    created_at:{
        type: Date,
        default: Date.now,
    }
})
const Counseling = mongoose.model('Qyery',QyerySchema);

export default Counseling;