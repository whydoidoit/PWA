

async function load(src) {
    return require(`../${src}/index.html`)
    // return import(`../${src}/index.html`)
}

module.exports = load

