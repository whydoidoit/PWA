const StateRouter = require('asr-iso')
const dynamic = require('./components/wrapper/dynamic')
const events = require('./events')

var stateRouter = StateRouter(clientRenderer, '#here', {
    templateConstructor: function (info) {
        return dynamic(info.template)
    }
})

stateRouter.on('add', function (state, isServer) {
    state.activate = svelteActivate
    if (!isServer) {
        var resolve = state.resolve
        if (resolve) {
            state.resolve = function (data) {
                if (window.dataIslands) {
                    if (dataIslands[state.name]) {
                        Object.assign(data, dataIslands[state.name])
                        delete dataIslands[state.name]
                        return Promise.resolve(data)
                    }
                }
                return resolve.apply(state, Array.prototype.slice.call(arguments))
            }
        }
    }
})

var defaultOptions = {}

function clientRenderer(stateRouter) {
    const asr = {
        makePath: stateRouter.makePath,
        stateIsActive: stateRouter.stateIsActive,
    }

    async function render(context, cb) {
        let {element: target, template, content} = context
        if (typeof target === 'string') {
            target = document.querySelector(target)
        }
        const rendererSuppliedOptions = Object.assign({}, defaultOptions, {
            target,
            data: Object.assign(content, defaultOptions.data, {asr}),
        })

        function construct(component, options) {
            return options.methods
                ? instantiateWithMethods(component, options, options.methods)
                : new component(options)
        }

        let svelte

        try {
            if (typeof template === 'string') {
                let constructor = await dynamic(template)
                svelte = construct(constructor.default, rendererSuppliedOptions)
            } else {
                cb(new Error("Must supply a string template to ensure server side and client side rendering match"))
                return
            }
        } catch (e) {
            cb(e)
            return
        }

        function onRouteChange() {
            svelte.set({
                asr,
            })
        }

        stateRouter.on('stateChangeEnd', onRouteChange)

        svelte.on('destroy', () => {
            stateRouter.removeListener('stateChangeEnd', onRouteChange)
        })

        svelte.mountedToTarget = target
        return svelte
    }

    return {
        render,
        reset: async function reset(context, cb) {
            const svelte = context.domApi
            const element = svelte.mountedToTarget

            svelte.teardown()

            const renderContext = Object.assign({element}, context)

            await render(renderContext, cb)
        },
        destroy: function destroy(svelte, cb) {
            svelte.teardown()
            cb()
        },
        getChildElement: function getChildElement(svelte, cb) {
            try {
                const element = svelte.mountedToTarget
                const child = element.querySelector('ui-view') || element.querySelector('[ui-view]')
                cb(null, child)
            } catch (e) {
                cb(e)
            }
        },
    }
}

function svelteActivate(context) {
    if (context.isServer) {
        let dom = context.domApi;
        dom.data = Object.assign({}, context.data, context.parameters, dom.context)
        dom.css = dom.templateInstance.renderCss().css
        dom.element = dom.templateInstance.render(dom.data);
    } else {
        context.domApi.set(Object.assign({}, context.data, context.parameters, typeof window !== 'undefined' ? window.__context : null))
    }
}

stateRouter.addState({
    name: 'app',
    route: '/',
    data: {
        name: 'mike'
    },
    template: 'holder'
})

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    })
}

stateRouter.addState({
    name: 'app.home',
    route: 'home',
    data: {
        surname: 'talbot'
    },
    template: 'basic',
    resolve: async function (data) {
        console.log("resolve")
        await delay(1000)
        data.firstname = "Mike"
    }
})


module.exports = stateRouter

events.on('retrieve:*', function(user) {
    user.info = user.info || "Information data"
})

events.on('clicked:*', async function(user) {
    await user.router.go('app')
})
