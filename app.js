const express = require('express')                      //เรียกใช้ module express
const expressLayouts = require('express-ejs-layouts')   //เรียกใช้ module express ejs layout
const app = express()                                   //สร้าง object ให้ express

//กำหนด port สำหรับ project deployed on heroku
const port = process.env.PORT || 3000

//แก้ปัญหา at 'http://localhost:5000/api/categories' from origin 'http://localhost:4200' has been blocked by CORS policy: No 'Access-Control-Allow-Origin'
// Fix CORS
var allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")                                      //domain ที่อนุญาติ
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');                  //method ที่อนุญาติ
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control");

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next()
    }
};
app.use(allowCrossDomain)

const router = require('./routes/routerFe')             //เรียกใช้ module router จาก ./routes/routerFe ที่ export มา
const routerBe = require('./routes/routerBe')
const routerApi = require('./routes/api')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')


app.use(express.static('assets'))                       //ประกาศให้ปรับแต่งรูปแบบจาก  folder assets ด้วย method จาก express
app.use(expressLayouts)                                 //เรียกใช้ module express ให้จัด layout ตาม module express ejs layout
app.set('layout','./layouts/fe')                        //set layout จากไฟล์ ./layouts/fe.ejs เป็น df
app.set('view engine','ejs')                            //set view engine ให้ใช้รูปแปปของ ejs
app.use(express.json())                                 //ทำให้อ่าน json จาก form ได้
app.use(express.urlencoded({extended:false}))           //set ให้รับค่ามาแล้วใช้งานได้เลย

app.use(session({
    cookie:{maxAge:60000},
    store: new session.MemoryStore,
    saveUninitialized: true,
    resave:'true',
    secret:'secret'
}))                                                     //Df cookies    

app.use(flash())
app.use(methodOverride('_method'))
app.use('/',router)                                     //เรียกใช้ module router ให้หน้า DF '/'
app.use('/be',routerBe)
app.use('/api',routerApi)
app.listen(port,()=>{                                   //ใช้ port 3000 แสดงผล server
    console.log('Run on port 3000')
})