if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI:'mongodb://holarmyde:Alanu_1952@ds261114.mlab.com:61114/vidjot-prod'}
}else{
    module.exports = {
        mongoURI: 'mongodb://kunle:kb2232@ds261114.mlab.com:61114/vidjot-prod'
    }
}