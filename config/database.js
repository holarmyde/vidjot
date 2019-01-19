if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI:'mongodb://Alanu_1952@ds261114.mlab.com:61114/vidjot-prod'}
}else{
    module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}