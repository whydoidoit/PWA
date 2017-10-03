async function load(src) {
    return require(`../${src}/index.html`)
}

module.exports = load
