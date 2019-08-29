'use strict';
let BASE_IP = '192.168.1.152';
switch (process.env.NODE_ENV) {
    case 'development':
        BASE_IP = '192.168.1.152';
        // BASE_IP = '192.168.1.132:8084'; //杨涛
        break;
    case 'production':
        BASE_IP = '192.168.1.152';
        break;
    default:
        break;
}
module.exports = {
    NODE_ENV: `"${process.env.NODE_ENV}"`,
    BASE_IP: `"${BASE_IP}"`
};
