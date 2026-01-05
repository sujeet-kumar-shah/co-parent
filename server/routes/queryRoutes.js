import express from 'express';
import Counseling from '../models/Counseling.js';

const router = express.Router();

router.post('/counselingForm',async(req,res)=>{
 const {name,contact_number,message,percentage,query_type,userId} = req.body
 const queryData = new Counseling({
      userId:userId,
      name :name,
      query_type:query_type,
      contact_number:contact_number,
      percent:percentage,
 });

 const counselingQuery = await queryData.save();
        res.status(201).json(counselingQuery);

})
export default router;