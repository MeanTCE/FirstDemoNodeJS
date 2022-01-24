// Import Express
const express = require('express')

// Import Moment เพื่อไว้จัดรูปแบบวันที่
const moment = require('moment')

//Import objectID ของ mongoDB
const objectId = require('mongodb').ObjectId

// Import mongodb_dbconfig
const { connectDb, getDb } = require ('../config/mongodb_dbconfig')
var db
connectDb(() => (db = getDb()))

const routerApi = express.Router()

// CRUD Category ================================================
// Read Category
routerApi.get('/categories',async (req, res)=>{

    const categories = await db.collection('category').find({}).sort({CategoryID:1}).toArray()
    res.json(categories)
})

// Read Category from ID
routerApi.get('/category/:id',async (req, res)=>{
    const objID = new objectId(req.params.id)
    const category = await db.collection('category').find({"_id":objID}).toArray()
    res.json(category)
})

// Create Category
routerApi.post('/create_category', async (req,res)=>{
    const category = await db.collection('category').findOne({},{sort: {CategoryID:-1}, limit:1})
    const categoryID = category.CategoryID + 1

    //รับค่าจากฟอร์ม
    let CategoryName = req.body.CategoryName
    let CategoryStatus = req.body.CategoryStatus
    let curdatetime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")

    //Validate data
    if(CategoryName.length === 0 || CategoryStatus === ''){
        res.json({'msg': 'ข้อมูลไม่ครบ'})
    }else{
        //insert to mongodb
        await db.collection('category').insertOne({
            CategoryID: categoryID,
            CategoryName: CategoryName,
            CategoryStatus: parseInt(CategoryStatus),
            CreatedDate: curdatetime,
            ModifiedDate: curdatetime
        })
        res.json({'msg':'Add item done'})
    }
})

//Edit Category
routerApi.put('/edit_category/:id', async (req,res)=>{
    const objID = new objectId(req.params.id)

    //รับค่าจากฟอร์ม
    let CategoryName = req.body.CategoryName
    let CategoryStatus = req.body.CategoryStatus
    let curdatetime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")

    //Validate data
    if(CategoryName.length === 0 || CategoryStatus === ''){
        res.json({'msg': 'ข้อมูลไม่ครบ'})
    }else{
        //Update to mongodb
        await db.collection('category').updateOne({_id: objID},
        {    $set: {
                CategoryName: CategoryName,
                CategoryStatus: parseInt(CategoryStatus),
                ModifiedDate: curdatetime
                }
        } )
       res.json({'msg':'Update done'})
    }
})

//Delete category
routerApi.delete('/delete_category/:id', async (req,res)=>{
    const objID = new objectId(req.params.id)
    await db.collection('category').deleteOne({"_id": objID})
    res.json({'msg':'Delete Done'})
})

// CRUD Product ================================================
// Read Product
routerApi.get('/products', async (req,res)=>{
    const products = await db.collection('products').aggregate(
        [
            {
                $lookup: {
                    from: 'category',
                    localField: 'CategoryID',
                    foreignField: 'CategoryID',
                    as: 'category'
                }
            },
            {
                $match:{
                    "products":{"$ne":[]}
                }
            },
            {
                $sort:{
                    "_id":-1
                }
            }
        ]
    ).toArray()
    res.json(products)
})

//Read Product from ID
routerApi.get('/products/:id', async (req,res)=>{
    const objID = new objectId(req.params.id)
    const products = await db.collection('products').aggregate(
        [
            {
                $lookup: {
                    from: 'category',
                    localField: 'CategoryID',
                    foreignField: 'CategoryID',
                    as: 'category'
                }
            },
            {
                $match: {
                    "_id": objID
                }
            }
        ]
    ).toArray()
    res.json(products)
})

//Create Product
routerApi.post('/create_products', async (req,res)=>{
    const products = await db.collection('products').findOne({},{sort: {ProductID: -1}, limit: 1})
    const productID = products.ProductID + 1
    
    //รับค่าจากฟอร์ม
    let ProductName = req.body.ProductName
    let CategoryID = req.body.CategoryID
    let UnitPrice = req.body.UnitPrice
    let UnitInStock = req.body.UnitInStock
    let ProductPicture = req.body.ProductPicture
    let curdatetime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")

    //Validate Data
    if( ProductName.length === 0 || CategoryID === '' || UnitPrice === '' || UnitInStock === '' ){
        res.json({'msg':'ข้อมูลไม่ครบ'})

    }else{
        //Insert to mongodb
        await db.collection('products').insertOne({
            ProductID: productID,
            CategoryID: parseInt(CategoryID),
            ProductName: ProductName,
            UnitPrice: parseInt(UnitPrice),
            UnitInStock: parseInt(UnitInStock),
            ProductPicture: ProductPicture,
            CreatedDate: curdatetime,
            ModifiedDate: curdatetime
        })
        res.json({'msg':'Add Product Done'})
    }
})

//Edit Product
routerApi.put('/edit_products/:id', async (req,res)=>{
    const objID = objectId(req.params.id)

    //รับค่าจากฟอร์ม
    let ProductName = req.body.ProductName
    let CategoryID = req.body.CategoryID
    let UnitPrice = req.body.UnitPrice
    let UnitInStock = req.body.UnitInStock
    let ProductPicture = req.body.ProductPicture
    let curdatetime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")

    //Validate Data
    if( ProductName.length === 0 || CategoryID === '' || UnitPrice === '' || UnitInStock === '' ){
        res.json({'msg':'ข้อมูลไม่ครบ'})
    }else{
        await db.collection('products').updateOne({_id: objID},{
            $set:{
                CategoryID: parseInt(CategoryID),
                ProductName: ProductName,
                UnitPrice: parseInt(UnitPrice),
                UnitInStock: parseInt(UnitInStock),
                ProductPicture: ProductPicture,
                ModifiedDate: curdatetime
            }
        })
        res.json({'msg':'Update Product Done'})
    }
})

routerApi.delete('/delete_products/:id', async (req,res)=>{
    const objID = new objectId(req.params.id)
    await db.collection('products').deleteOne({"_id": objID})
    res.json({'msg':'Delete Product Done'})
})

module.exports = routerApi