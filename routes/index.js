const express = require('express');
require('svelte/ssr/register')
const router = express.Router();
const stateRouter = require('../states')
const events = require('../events')
const shortid = require('shortid')
const redis = require('3r/redis')
const merge = require('lodash/merge')

function createUserRouter(user) {
    user.router = Object.assign({}, stateRouter)
    let go = user.router.go
    user.stateParameters = user.stateParameters || {}
    user.router.go = async function (state, parameters, options) {
        user.state = state
        user.stateParameters = parameters
        return user
    }
    return user
}

/* GET home page. */
router.get('/', async function (req, res) {
    var id = req.cookies.routerId
    var user
    if (!id) {
        id = shortid.generate()
        user = {}
        createUserRouter(user)
        await events.emitAsync(`initialize:${id}`, user)
    } else {
        user = JSON.parse((await redis.get(`--router-state--${id}`)) || "{}")
        createUserRouter(user)

    }
    await events.emitAsync(`retrieve:${id}`, user)
    res.cookie('routerId', id, {maxAge: 1000 * 60 * 60 * 24 * 7 * 12})
    var state = await stateRouter.go(user.state || 'app.home', user.stateParameters, null, user)
    delete user.router
    await redis.set(`--router-state--${id}`, JSON.stringify(user))
    res.render('index', {contents: state.html, styles: state.css, context: JSON.stringify(user)});
})

router.put('/', async function (req, res) {
    var id = req.cookies.routerId
    var user
    if (!id) {
        res.status(404).send("No user")
        return
    }
    user = JSON.parse((await redis.get(`--router-state--${id}`)) || "{}")
    merge(user, req.body)
    await redis.set(`--router-state--${id}`, JSON.stringify(user))
    res.status(200).send("ok")
})

router.post('/raiseEvent', async function (req, res) {
    try {
        var id = req.cookies.routerId
        if (!id) {
            res.status(404).send("User not found")
            return
        }
        var user = JSON.parse((await redis.get(`--router-state--${id}`)) || "{}")
        createUserRouter(user)
        await events.emitAsync.apply(events, [req.body.event, user, req.body].concat(req.body.parameters.split(',')))
        delete user.router
        await redis.set(`--router-state--${id}`, JSON.stringify(user))
        res.status(200).redirect(req.headers.referer)
    } catch (e) {
        console.error(e)
    }
})

module.exports = router
