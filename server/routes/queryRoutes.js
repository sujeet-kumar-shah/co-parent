import express from 'express';
import Counseling from '../models/Counseling.js';

const router = express.Router();

router.post('/counselingForm',async(req,res)=>{
 const {name,contact_number,message,percentage,query_type,userId} = req.body
 const queryData = new Counseling({
      userId:userId,
      name :name,
      query_type:query_type,
      message:message,
      contact_number:contact_number,
      percent:percentage,
 });

 const counselingQuery = await queryData.save();
        res.status(201).json(counselingQuery);

})
router.post('/status/:id',async(req,res)=>{
 const {status} = req.body
   let  queryData ;

      queryData = await Counseling.findOneAndUpdate(
         { _id: req.params.id },
         { status: status },
         { new: true }   // returns updated document
     );


res.status(200).json({
    success: true,
    data: queryData
});
})
export default router;