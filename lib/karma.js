/*jshint esversion: 8 */
const Server = require('karma').Server
module.exports = karma = (config) => {
    const option = config.karma;
    const server = new Server(option);
    server.start();
};