const express = require('express');
require('svelte/ssr/register')
const router = express.Router();
const StateRouter = require('abstract-state-router')
const HashBrownRouter = require('hash-brown-router')
const EventEmitter = require('eventemitter3')
const Wrapper = require('../components/wrapper/index.html')
const dynamic = require('../components/wrapper/dynamic')
const parse5 = require('parse5')
let output, _id = 0

function getView(ast) {
    for (let i = 0; i < ast.childNodes.length; i++) {
        let child = ast.childNodes[i]
        if (child.tagName === 'ui-view') return child
    }
    for (let i = 0; i < ast.childNodes.length; i++) {
        let child = ast.childNodes[i]
        let result = getView(child)
        if (result) return result
    }
    return null
}

function renderer(asr) {
    return {
        async render(info, cb) {
            let Component = await dynamic(info.template)
            console.log(info)
            let result = parse5.parseFragment(Component.render(info.content))
            let view = getView(info.element)
            view.childNodes.length = 0
            Array.prototype.push.apply(view.childNodes, result.childNodes)
            console.log(parse5.serialize(info.element))
            cb(null, result)
            return result
        },
        getChildElement(element, cb) {
            cb(null, element)
        },
        reset(info) {

        },
        destroy(element) {

        }

    }
}



var stateRouter = StateRouter(renderer)

stateRouter.addState({
    name: 'app',
    route: '/',
    data: {
        name: 'mike'
    },
    template: 'holder',
    activate: function() {
        console.log("here")
    }
})

stateRouter.addState({
    name: 'app.home',
    route: 'home',
    data: {
        surname: 'talbot'
    },
    template: 'basic',
    activate: function () {
        console.log("and here")
    }
})

/* GET home page. */
router.get('/', async function (req, res, next) {
    res.render('index', {contents: await stateRouter.renderAsHTML('app.home')});
});

module.exports = router;
