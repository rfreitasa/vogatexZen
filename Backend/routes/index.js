const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  const response = {
    status: 200,
    success: true,
    message: 'Success',
    data: ['Index router'],
    meta: {},
  }
  return res.status(200).send(response)
})

module.exports = router
