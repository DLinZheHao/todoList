// 建立初始 mongodb data 
//  const item1 = new Item({
    //     name: 'Welcome to your todolist!'
    // });
    
    // const item2 = new Item({
    //     name: 'Hit the + button to add a new item.'
    // });
    
    // const item3 = new Item({
    //     name: '<-- Hit this to delete an item>'
    // });
    
    // const defaultItems = [item1, item2, item3];
    
    // Item.insertMany(defaultItems, (err) => {
    //     if(err){
    //         console.log(err)
    //     }else {
    //         console.log('Success! Inserted items.');
    //     }
    // })

//-------------------------------------------------------------

// 嘗試模組化 輸入資料
// 

// const itemData = (content) => {
//     const itemSchema = new mongoose.Schema(
//     {
//         name: String
//     },
//     {
//         collection: 'Items'
//     }
//     );

//     const Item = itemSchema.model('Item', itemSchema);

//     const item = new Item({
//         name: `${content}`
//     });
// }

//-------------------------------------------------------------