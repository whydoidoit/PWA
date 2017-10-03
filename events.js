const Events = require('eventemitter2')

module.exports = new Events({wildcard: true, delimiter: ':'})
