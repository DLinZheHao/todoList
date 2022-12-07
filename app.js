const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash')

const mongoose = require('mongoose');

// 引用 date.js 的函式
// const date = require(__dirname + '/date.js');

const { application } = require('express');

const app = express();
const port = 3000;
const url = "mongodb+srv://LinZheHao:123@mymongodb.vbtuhmm.mongodb.net/todolistDB"
const local_host = 'mongodb://localhost:27017/todolistDB'


// let items  = ["讀書","買東西","睡覺"];
// let workItems = [];


app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));

// mongoDB 連接 && 架構型態
mongoose.connect(url,{ useNewUrlParser: true});

const itemSchema = new mongoose.Schema(
    {
        name: String
    }
);

const Item = mongoose.model('Item', itemSchema);

// 初始資料
    const item1 = new Item({
        name: 'Welcome to your todolist!'
    });
    
    const item2 = new Item({
        name: 'Hit the + button to add a new item.'
    });
    
    const item3 = new Item({
        name: '<-- Hit this to delete an item>'
    });

    const defaultItems = [item1, item2, item3];

const listSchema =  {
    name: String,
    items: [itemSchema]
}

const List = mongoose.model('List', listSchema);


app.get('/', (req, res) => {
    // 引用 npm(monent) 寫成的 date.js function()
    // let day = date.getDate()

    // 從DB 找到collection 可以從裡面取資料傳遞
    Item.find({},(err, foundItems) => {
        // 初始 todolist 資料 
        if(foundItems.length === 0){
            Item.insertMany(defaultItems, (err) => {
                if(err){
                    console.log(err)
                }
                else {
                    console.log('Success! Inserted items.');
                }
            })
            res.redirect('/');
        }  // 正常新增事項
        else {
            // 傳入 list.ejs 的資料 其他線路 可以重新導向這裡 把最新的資料更新輸入
            res.render('list', {listTitle: 'Today', newListItem: foundItems})
        }
        
    })
    
});

app.post('/', (req, res) => {
    // console.log(req.body);
    // req.body.newItem 從 list.ejs 的 input submit 過來的
    const itemName = req.body.newItem
    const listName = req.body.list

    const item = new Item({
        name: itemName,
    });

    // 兩種不同架構的儲存模式 

    // 主頁只儲存item 所以使用item collection 
    if (listName === 'Today'){
        item.save();
        res.redirect('/');
    }
    // 切換至其他事項 使用 list collection  
    else {
        List.findOne({name: listName}, (err, foundList) => {
            foundList.items.push(item);
            foundList.save();
            res.redirect('/' + listName);
        })
    }
    
})

// form delete item 的 action /delete 線路
app.post('/delete', (req, res) => {
    // list.ejs 裡 checkbox this.form.submit() 當被點下 
    // value = <%= item._id %> 會回傳回來
    // console.log(req.body.checkbox);

    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === 'Today'){
        Item.findOneAndRemove(checkedItemId, (err) => {
            if(!err){
                console.log('Success! Deleted items.');
                res.redirect('/');
            }
       })
    }
    //
    else {
        List.findOneAndUpdate(
            {name: listName}, 
            {$pull: {items: {_id: checkedItemId}}}, 
            (err, foundList) => {
                if(!err){
                    res.redirect('/' + listName);
                }
            })
    }
})

// express router 動態
app.get('/:customListName',(req, res) => {
    
    const customListName = _.capitalize(req.params.customListName);
    
    List.findOne({name: customListName}, (err, foundList) => {
        if (!err){
            // findOne method 的 回傳如果沒有匹配到 有可能會是空的
            if(!foundList){
                // Create a new List
                const list = new List({
                    name: customListName,
                    items: defaultItems
                })
            
                list.save();
                res.redirect('/' + customListName);
            }else {
                // Show an existing List
                res.render('list', {listTitle: foundList.name, newListItem: foundList.items});
            }
        }
    })

})
  
// app.get('/about', (req, res) => {
//     res.render('about', );
// })

app.listen(port, (req, res) => {
    console.log('Server started on port 3000');
})




