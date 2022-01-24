// Import Express
const express = require('express')

// Import Moment เพื่อไว้จัดรูปแบบวันที่
const moment = require('moment')

// Import CSV writer
const createCsvWriter = require('csv-writer').createObjectCsvWriter

//import html-pdf
const ejs = require('ejs')
const pdf = require('html-pdf')
const path = require('path')

//Import objectID ของ mongoDB
const objectId = require('mongodb').ObjectId

const routerBe = express.Router()

// Import mongodb_dbconfig
 const { connectDb, getDb } = require ('../config/mongodb_dbconfig')
 var db
 connectDb(() => (db = getDb()))

routerBe.get('',(req, res)=>{
    res.render(
        'pages/be/dashboard', 
        { 
            title: 'Dashboard', 
            heading: 'Dashboard',
            layout: './layouts/be'
        }
    )
})

// CRUD Category ================================================
// Read Category
routerBe.get('/category',async (req, res)=>{

    const category = await db.collection('category').find({}).sort({CategoryID:1}).toArray()
    //res.json(category)

    res.render(
        'pages/be/category', 
        { 
            title: 'Category', 
            heading: 'Category',
            layout: './layouts/be',
            data: category,
            moment: moment
        }
    )
})

// Create Category
routerBe.get('/create_category',(req, res)=>{
    res.render(
        'pages/be/create_category', 
        { 
            title: 'Create Category', 
            heading: 'Create Category',
            layout: './layouts/be'
        }
    )
})

// Create Category POST
routerBe.post('/create_category', async (req, res)=>{

    //อ่าน categoryID ก่อนเพิ่ม
    const category = await db.collection('category').findOne({},{sort:{CategoryID:-1},limit:1})
    //หา category จาก db.collection โดย sort จากมากไปน้อยด้วย -1 (ใช้ 1 เรียงน้อยไปมาก) limit คือเอามาจำนวนเดียว
    // console.log(category.CategoryID)
    // return 0

    const categoryID = category.CategoryID + 1

    // รับค่าจากฟอร์ม
    // let CategoryID = req.body.CategoryID            ไม่จำเป็นต้องรับค่าแล้ว
    let CategoryName = req.body.CategoryName
    let CategoryStatus = req.body.CategoryStatus
    let curdatetime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
    let errors = false

    //console.log(CategoryID+CategoryName+CategoryStatus)
    // Validate ฟอร์มว่าป้อนข้อมูลครบหรือยัง
    if(CategoryName.length === 0 || CategoryStatus === '')
    {
        errors = true
        // แสดงข้อความแจ้งเตือน
        req.flash('error','ป้อนข้อมูลในฟิลด์ให้ครบก่อน')
        // ให้ทำการ reload ฟอร์ม
        res.render(
            'pages/be/create_category', 
            { 
                title: 'Create Category', 
                heading: 'Create Category',
                layout: './layouts/be'
            }
        )

    }else{
        // Insert to mongodb
        await db.collection('category').insertOne({
            CategoryID: parseInt(categoryID),                       //convert ให้เป็น integer
            CategoryName: CategoryName,
            CategoryStatus: parseInt(CategoryStatus),               //convert ให้เป็น integer
            CreatedDate: curdatetime,
            ModifiedDate: curdatetime
        })

        // แสดงข้อความแจ้งเตือน
        req.flash('success','เพิ่มหมวดหมู่สินค้าเรียบร้อยแล้ว')

        res.render(
            'pages/be/create_category', 
            { 
                title: 'Create Category', 
                heading: 'Create Category',
                layout: './layouts/be'
            }

            
        )
    }
})
          //  db.category.updateOne ({name:'Teerapat Seangtong'}{$set:{email:'1234@gmail.com',age:28}})   เพิ่ม db
          //  db.category.deleteOne({name:'Teerapat})          ลบ db

// Edit Category
routerBe.get('/edit_category/:id', async (req, res)=>{  //กำหนดให้รับ _ID ด้วย

        const objId = new objectId(req.params.id)
        const category = await db.collection('category').find({"_id": objId}).toArray()

    res.render(
        'pages/be/edit_category', 
        { 
            title: 'Edit Category', 
            heading: 'Edit Category',
            layout: './layouts/be',
            data: category
        }
    )
})

routerBe.put('/edit_category/:id/:resouce', async (req,res)=>{
        //console.log(req.params.id)

        const objId = new objectId(req.params.id)
        const category = await db.collection('category').find({"_id": objId}).toArray()

        // รับค่าจากฟอร์ม
    // let CategoryID = req.body.CategoryID            ไม่จำเป็นต้องรับค่าแล้ว
    let CategoryName = req.body.CategoryName
    let CategoryStatus = req.body.CategoryStatus
    let curdatetime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
    let errors = false

    if(CategoryName.length === 0 || CategoryStatus === '')
    {
        errors = true
        // แสดงข้อความแจ้งเตือน
        req.flash('error','ป้อนข้อมูลในฟิลด์ให้ครบก่อน')
        // ให้ทำการ reload ฟอร์ม
        res.render(
            'pages/be/edit_category', 
            { 
                title: 'Edit Category', 
                heading: 'Edit Category',
                layout: './layouts/be',
                data: category
            }
        )

    }else{
        //update to mongodb
        await db.collection('category').updateOne({_id:objId},
            {
            $set:{                                                  //$set ใช้สำหรับแก้ไข
            CategoryName: CategoryName,
            CategoryStatus: parseInt(CategoryStatus),               //convert ให้เป็น integer
            ModifiedDate: curdatetime
            }
        }
        )
    }
        req.flash('success','Update Done')
        
        await res.render(
            'pages/be/edit_category', 
            { 
                title: 'Edit Category', 
                heading: 'Edit Category',
                layout: './layouts/be',
                data: category
            }
        )

})

//delete category
routerBe.delete('/delete_category/:id/:resource', async (req,res)=>{
    const objId = new objectId(req.params.id)
    await db.collection('category').deleteOne({"_id": objId})
    res.redirect('/be/category')
    })



routerBe.get('/products',async (req, res)=>{

    //const products = await db.collection('products').find({}).toArray()
    //lookup from category, product

    const products = await db.collection('products').aggregate(
        [
            {$lookup: {
                from: 'category',
                localField: 'CategoryID',
                foreignField: 'CategoryID',
                as: 'category'
                    }
                },
                {
                    $match:{
                        "products":{"$ne":[]}   //เช็คว่าไม่มีช่องว่างถึงดึงมา
                    }
                },
                {
                    $sort:{
                        "_id":-1
                    }
                },
        ]
    ).toArray()
    
    // res.json(products)
    // return 0

    res.render(
        'pages/be/products', 
        { 
            title: 'Products', 
            heading: 'Products',
            layout: './layouts/be',
            data: products,
            moment: moment
        }
    )
})



// Create Product

routerBe.get('/create_product', async (req, res)=>{
    const category = await db.collection('category').find({}).sort({CategoryID:1}).toArray()

    res.render(
        'pages/be/create_product', 
        { 
            title: 'Create Product', 
            heading: 'Create Product',
            layout: './layouts/be',
            category: category
        }
    )
})

routerBe.post('/create_product', async (req, res)=>{

    const category = await db.collection('category').find({}).sort({CategoryID:1}).toArray()

    const product = await db.collection('products').findOne({},{sort:{ProductID:-1},limit:1})

    const ProductID = product.ProductID+1

    let ProductName= req.body.ProductName
    let CategoryID= req.body.CategoryID
    let UnitPrice= req.body.UnitPrice
    let UnitInStock= req.body.UnitInStock
    let ProductPicture= req.body.ProductPicture
    let Curdatetime= moment(new Date()).format ("YYYY-MM-DD HH:mm:ss")
    let errors = false

    if(CategoryID==='--' || ProductName.length===0 || UnitPrice==='' || UnitInStock===''){
        errors=true
        req.flash('error', 'กรุณาใส่ข้อมูลให้ครบก่อน')

        res.render('pages/be/create_product', 
        { 
            title: 'Create Product', 
            heading: 'Create Product',
            layout: './layouts/be',
            category: category
        }
        )
    }else{
        await db.collection('products').insertOne({
            ProductID: ProductID,
            CategoryID: parseInt(CategoryID),
            ProductName: ProductName,
            UnitPrice: parseInt(UnitPrice),
            ProductPicture: ProductPicture,
            UnitInStock: parseInt(UnitInStock),
            CreatedDate: Curdatetime,
            ModifiedDate: Curdatetime
        })

        req.flash('success','เพิ่มสินค้าเรียบร้อยแล้ว')

        res.render('pages/be/create_product', 
        { 
            title: 'Create Product', 
            heading: 'Create Product',
            layout: './layouts/be',
            category: category
        })
    }
})


// Edit Product
routerBe.get('/edit_product/:id', async (req, res)=>{

    const objID = new objectId(req.params.id)
    const product = await db.collection('products').find({"_id": objID}).toArray()
    const category = await db.collection('category').find({}).toArray()

    res.render(
        'pages/be/edit_product', 
        { 
            title: 'Edit Products', 
            heading: 'Edit Products',
            layout: './layouts/be',
            data: product,
            category: category
        }
    )
})

routerBe.put('/edit_product/:id/:resource', async (req,res)=>{
    const objID = new objectId(req.params.id)
    const product = await db.collection('products').find({"_id": objID}).toArray()
    const category = await db.collection('category').find({}).toArray()

    let CategoryID = req.body.CategoryID
    let ProductName = req.body.ProductName
    let UnitPrice = req.body.UnitPrice
    let UnitInStock = req.body.UnitInStock
    let ProductPicture = req.body.ProductPicture
    let curdatetime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
    let errors = false

    if(ProductName.length === 0 || UnitPrice ==='' || UnitInStock ==='')
    {
        errors = true
        req.flash('error', 'กรุณาใส่ข้อมูลให้ครบก่อน')
        res.render(
            'pages/be/edit_product',
            {
                title: 'Edit Product',
                heading: 'Edit Product',
                layout: './layouts/be',
                data: product,
                category: category
            }
        )
    }else{
        await db.collection('products').updateOne({_id: objID},
        {
            $set:{
                CategoryID: parseInt(CategoryID),
                ProductName: ProductName,
                UnitPrice: parseInt(UnitPrice),
                ProductPicture: ProductPicture,
                UnitInStock: parseInt(UnitInStock),
                ModifiedDate: curdatetime
            }
        }
        )

        req.flash('success','Update Done')
        res.render(
            'pages/be/edit_product',
            {
                title: 'Edit Product',
                heading: 'Edit Product',
                layout: './layouts/be',
                data: product,
                category: category
            }
        )

    }
})

routerBe.delete('/delete_product/:id/:resource', async (req,res)=>{
    const objID = new objectId(req.params.id)
    await db.collection('products').deleteOne({"_id": objID })
    res.redirect('/be/products')
})

//export CSV product
routerBe.get('/exportcsv_product', async (req,res)=>{
    //lookup ข้อมูล
    const products = await db.collection('products').aggregate(
        [
            {$lookup: {
                from: 'category',
                localField: 'CategoryID',
                foreignField: 'CategoryID',
                as: 'category'
                    }
                },
                {
                    $match:{
                        "products":{"$ne":[]}   //เช็คว่าไม่มีช่องว่างถึงดึงมา
                    }
                },
                {
                    $sort:{
                        "_id":-1
                    }
                },
        ]
    ).toArray()

    //CSV writer
    let file_csv_name = "./csvexport/product-"+moment(new Date()).format("YYYY-MM-DD-ss")+".csv"

    const csvWriter = createCsvWriter({
        path: file_csv_name,
        header: [
            {id:"ProductID", title:"ProductID"},
            {id:"CategoryID", title:"CategoryID"},
            {id:"ProductName", title:"ProductName"},
            {id:"UnitPrice", title:"UnitPrice"},
            {id:"UnitInStock", title:"UnitInStock"}
        ]
    })
    csvWriter.writeRecords(products).then(()=>{
        res.download(file_csv_name)
    })
})

//export pdf product
routerBe.get('/exportpdf_product', async (req,res)=>{
    //lookup ข้อมูล
    const products = await db.collection('products').aggregate(
    [
        {$lookup: {
            from: 'category',
            localField: 'CategoryID',
            foreignField: 'CategoryID',
            as: 'category'
                }
            },
            {
                $match:{
                    "products":{"$ne":[]}   //เช็คว่าไม่มีช่องว่างถึงดึงมา
                }
            },
            {
                $sort:{
                    "_id":-1
                }
            },
    ]
    ).toArray()

    //export pdf
    let file_pdf_name = "./pdfexport/product-"+moment(new Date()).format("YYYY-MM-DD-ss")+".pdf"
    ejs.renderFile(path.join(__dirname,'../views/pages/be/',"demo.ejs"), {
        products: products}, (err, data) => {
            if(err){
                res.send(err)
            }else{
                let option = {
                    "height": "297mm",
                    "width": "210mm",
                    "border": "1cm",
                    "header":{
                        "height": "20mm"
                    }, 
                    "footer":{
                        "height": "20mm"
                    }
                }
                pdf.create(data, option).toFile(file_pdf_name, function(err, data){
                    if(err){
                        res.send(err)
                    }else{
                        res.download(file_pdf_name)
                    }
                })
            }
        }
        )

})

module.exports = routerBe