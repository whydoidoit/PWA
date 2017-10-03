async function load(src) {
    return import(`../${src}/index.html`)
}

window.dynamic = load

module.exports = load
