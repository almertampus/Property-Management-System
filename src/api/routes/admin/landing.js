const fs = require('fs')
const path = require('path')
const authentication = require('../../middlewares/authentication')
const { propertyList, propertyGet } = require('../../../services/property')
const { catalogList } = require('../../../services/catalog')
const { roomList } = require('../../../services/room')
const { tenantList } = require('../../../services/tenant')
const { bookingList } = require('../../../services/booking')

module.exports = async (app, handlebars) => {

    // Demo
    app.get('/demo', async (req, res) => {
        // Compile template
        const template = await handlebars.compile(fs.readFileSync(path.join(__dirname, '../../../../views/pages/admin/demo.hbs'), 'utf8'));

        // Render template
        const output = template({
            title: 'Demo'
        });

        res.status(200)
            .send(output)
    })

    // Sign up
    app.get('/signup', async (req, res) => {
        if (req.user && req.token) {
            res.status(401)
                .redirect('/')
        } else {
            // Compile template
            const template = await handlebars.compile(fs.readFileSync(path.join(__dirname, '../../../../views/pages/admin/signup.hbs'), 'utf8'));

            // Render template
            const output = template({
                title: 'Sign up'
            });

            res.status(200)
                .send(output)
        }
    })

    // Log in
    app.get('/', authentication, async (req, res) => {
        if (req.user && req.token) {
            // Query properties
            const { properties } = await propertyList(req.user._id)

            // Compile template
            const template = await handlebars.compile(fs.readFileSync(path.join(__dirname, '../../../../views/pages/admin/dashboard.hbs'), 'utf8'));

            // Render template
            const output = template({
                title: 'Dashboard',
                header: 'Dashboard',
                user: req.user,
                properties
            });

            res.status(200)
                .send(output)
        } else {
            // Compile template
            const template = await handlebars.compile(fs.readFileSync(path.join(__dirname, '../../../../views/pages/admin/login.hbs'), 'utf8'));

            // Render template
            const output = template({
                title: 'Log in',
                message: req.cookies.message
            });

            res.status(200)
                .send(output)
        }
    })

    // Property
    app.get('/property/:id', authentication, async (req, res) => {
        if (req.user && req.token) {
            // Query properties
            const { properties } = await propertyList(req.user._id)

            // Get specific property
            const { property } = await propertyGet(req.params.id)

            // Query catalogs
            const { catalogs } = await catalogList(req.user._id)

            // Query rooms in specific property
            const { rooms } = await roomList(req.params.id)

            // Vacant rooms
            let vacant_rooms = []
            for (let i = 0; i < rooms.length; i++) {
                if (rooms[i].tenant === null) {
                    vacant_rooms.push(rooms[i]);
                }
            }

            // Occupied rooms
            let occupied_rooms = []
            for (let i = 0; i < rooms.length; i++) {
                if (rooms[i].tenant != null) {
                    occupied_rooms.push(rooms[i]);
                }
            }

            // Query tenants in specific property
            const { tenants } = await tenantList(req.params.id)

            // Query bookings in specific property
            const { bookings } = await bookingList(req.params.id)

            // Compile template
            const template = await handlebars.compile(fs.readFileSync(path.join(__dirname, '../../../../views/pages/admin/property.hbs'), 'utf8'));

            // Render template
            const output = template({
                title: property.name,
                header: 'Property / ' + property.name,
                user: req.user,
                properties,
                catalogs,
                property,
                rooms,
                vacant_rooms: vacant_rooms.length,
                occupied_rooms: occupied_rooms.length,
                total_rooms: rooms.length,
                tenants,
                total_tenants: tenants.length,
                bookings,
                total_bookings: bookings.length
            });

            res.status(200)
                .send(output)
        } else {
            res.status(401)
                .redirect('/')
        }
    })

    // Management

    // Property
    app.get('/management/property', authentication, async (req, res) => {
        if (req.user && req.token) {
            // Query properties
            const { properties } = await propertyList(req.user._id)

            // Compile template
            const template = await handlebars.compile(fs.readFileSync(path.join(__dirname, '../../../../views/pages/admin/management/property.hbs'), 'utf8'));

            // Render template
            const output = template({
                title: 'Property Management',
                header: 'Management / Property',
                user: req.user,
                properties
            });

            res.status(200)
                .send(output)
        } else {
            res.status(401)
                .redirect('/')
        }
    })

    // Catalog
    app.get('/management/catalog', authentication, async (req, res) => {
        if (req.user && req.token) {
            // Query properties
            const { properties } = await propertyList(req.user._id)

            // Query catalogs
            const { catalogs } = await catalogList(req.user._id)

            // Compile template
            const template = await handlebars.compile(fs.readFileSync(path.join(__dirname, '../../../../views/pages/admin/management/catalog.hbs'), 'utf8'));

            // Render template
            const output = template({
                title: 'Catalog Management',
                header: 'Management / Catalog',
                user: req.user,
                properties,
                catalogs
            });

            res.status(200)
                .send(output)
        } else {
            res.status(401)
                .redirect('/')
        }
    })

    // Account

    // Edit profile
    app.get('/account/profile', authentication, async (req, res) => {
        if (req.user && req.token) {
            // Query properties
            const { properties } = await propertyList(req.user._id)

            // Compile template
            const template = await handlebars.compile(fs.readFileSync(path.join(__dirname, '../../../../views/pages/admin/account/profile.hbs'), 'utf8'));

            // Render template
            const output = template({
                title: 'Profile',
                header: 'Profile',
                user: req.user,
                properties
            });

            res.status(200)
                .send(output)
        } else {
            res.status(401)
                .redirect('/')
        }
    })

    // Change password
    app.get('/account/password', authentication, async (req, res) => {
        if (req.user && req.token) {
            // Query properties
            const { properties } = await propertyList(req.user._id)

            // Compile template
            const template = await handlebars.compile(fs.readFileSync(path.join(__dirname, '../../../../views/pages/admin/account/password.hbs'), 'utf8'));

            // Render template
            const output = template({
                title: 'Security',
                header: 'Security',
                user: req.user,
                properties
            });

            res.status(200)
                .send(output)
        } else {
            res.status(401)
                .redirect('/')
        }
    })
}