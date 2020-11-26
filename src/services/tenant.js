const Tenant = require('../models/tenant')
const Room = require('../models/room')

// Create tenant
const tenantNew = async (tenantObject) => {
    const tenant = new Tenant(tenantObject)
    const room = await Room.findByIdAndUpdate(tenantObject.room, {
        tenant: tenant._id
    })

    await tenant.save()
    await room.save()
}

// List tenants
const tenantList = async (_id) => {
    const tenants = await Tenant.find({ property: _id })
        .lean()
        .populate('room')
        .exec()

    return { tenants }
}

// Update tenant
const tenantInfoUpdate = async (tenantObject) => {
    const tenant = await Tenant.findByIdAndUpdate(tenantObject._id, {
        first_name: tenantObject.first_name,
        last_name: tenantObject.last_name,
        mobile: tenantObject.mobile,
        email: tenantObject.email,
        room: tenantObject.room
    }, { new: true })

    await Room.findByIdAndUpdate(tenantObject.currentRoom, {
        tenant: null
    })

    await Room.findByIdAndUpdate(tenantObject.room, {
        tenant: tenant._id
    })

    return { tenant }
}

// Delete tenant
const tenantDelete = async (tenantObject) => {
    await Tenant.findOneAndDelete({ _id: tenantObject._id })

    await Room.findByIdAndUpdate(tenantObject.room, {
        tenant: null
    })
}

module.exports = {
    tenantNew,
    tenantList,
    tenantInfoUpdate,
    tenantDelete
}