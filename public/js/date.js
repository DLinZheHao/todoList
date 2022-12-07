const moment = require('moment');

// 也可以寫成exports.getDate module省略
module.exports.getDate = function(){
    
    moment.locale('zh-tw')

    return `${moment().format('ll')} ${moment().format('dddd')}`
}

module.exports.test = function(){

    return 'no use';
}

// module.exports.getDate = getDate;
// module.exports.test = test;