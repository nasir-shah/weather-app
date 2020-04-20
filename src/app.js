const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve 
app.use(express.static(publicDirectoryPath))

console.log(publicDirectoryPath)

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App!',
        name: 'Nasir Fareed Shah'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Us',
        name: 'Nasir Fareed Shah'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        message: 'I am here to help you!',
        name: 'Nasir Fareed Shah'

    })
})

app.get('/weather', (req, res) => {
    const location = req.query.address
    if (!location) {
        return res.send({
            error: 'You have to provide the address!'
        })
    }

    geocode(location, (error,response)=>{
        if(error){
            return res.send({
                error: error
            })
        }
        longitude = response.body.features[0].center[0]
        latitude = response.body.features[0].center[1]
        place = response.body.features[0].place_name
        forecast(longitude,latitude,(error,{temp,feels_like})=>{
            if(error){
                return res.send({
                    error: error
                })
            }
            res.send({
                temperature: temp,
                place: place,
                feels_like: feels_like
            })
            })
     })

    // res.send({
    //     temperature: 27,
    //     place: 'Erlangen',
    //     address: req.query.address
    // })
})

app.get('/products', (req, res) => {
    console.log(req.query.search)
    if (!req.query.search) {
        return res.send({
            error: 'You must provide the search term'
        })
    }
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Nasir Fareed Shah',
        errormessage: 'Help Article Not Found'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Nasir Fareed Shah',
        errormessage: 'Page Not Found'
    })
})

// app.get('/help/*',(req, res)=>{
//     res.send('Help article not found!')
// })


// app.get('*',(req, res)=>{
//     res.send('Page Not Found!')
// })

app.listen(port, () => {
    console.log('Our app is up and running at port :: ' + port)
})