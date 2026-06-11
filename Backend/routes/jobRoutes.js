const express = require('express')
const router = express.Router()
const {createJob,getAllJobs, getJobById, getdeleteJobById, getUpdateJobById}= require('../controllers/jobauthcontrollers')
const {protect}= require('../middleware/authmiddleware')

router.post('/create',protect,createJob)
router.get('/all',protect,getAllJobs)
router.get('/:id',protect,getJobById)
router.delete('/:id',protect,getdeleteJobById)
router.put('/:id',protect,getUpdateJobById)

module.exports = router