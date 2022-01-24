const express = require('express')                      //เรียกใช้ module express

const router = express.Router()                         //เรียกใช้ method router ของ express

router.get('',(req,res)=>{                              //เมื่อ req โดยมี ''ให้ res render จาก 'pages/fe/index' และแนบ value title: Home ไปด้วย
    res.render('pages/fe/index', {title: 'Home'})
})

router.get('/about',(req,res)=>{                        //เมื่อ req โดยมี '/about'ให้ res render จาก 'pages/fe/about' และแนบ value title: About ไปด้วย
    res.render('pages/fe/about', {title: 'About'})
})

router.get('/login',(req, res)=>{
    res.render(
        'pages/fe/login', 
        { 
            title: 'เข้าสู่ระบบ', 
            layout: './layouts/authen'                  //ระบุ layout ไม่ให้ใช้ df โดยระบุ path ใหม่
        }
    )
})

router.get('/register',(req, res)=>{
    res.render(
        'pages/fe/register', 
        { 
            title: 'สมัครสมาชิก', 
            layout: './layouts/authen'
        }
    )
})

router.get('/forgotpassword',(req, res)=>{
    res.render(
        'pages/fe/forgotpassword', 
        { 
            title: 'ลืมรหัสผ่าน', 
            layout: './layouts/authen'
        }
    )
})

module.exports=router                                   //export router ออกไปให้ไฟล์อื่นเรียกใช้