if(process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoURI: 'mongodb+srv://admin:987654321@vidjot-uwhs6.mongodb.net/test?retryWrites=true&w=majority'
  }
} else {
  module.exports = {
    mongoURI: 'mongodb://localhost/vidjot-dev'
  }
}