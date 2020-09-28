const UnitRegis = require('../models/unit-registration-model')

deleteRegistration = async (req, res) => {
    await UnitRegis.findOne({ reg_id: req.params.id }, (err, data) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!data) {
            return res
                .status(404)
                .json({ success: false, error: `Unit not found` })
        }
        data.remove().then(()=>{
            return res.json({data: 'data successfully removed'})
        }).catch(e=>{
            return res.status(404).json({data: 'data failed removed'})
        })
    }).catch(err => console.log(err))
}

getRegistration = async (req, res) => {
    await UnitRegis.find({}, (err, data) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        return res.status(200).json({ success: true, data: data })
    }).sort({reg_id: -1}).catch(err => console.log(err))
}

module.exports = {
    deleteRegistration,
    getRegistration,
}