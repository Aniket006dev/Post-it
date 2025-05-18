const PORT = process.env.PORT || 3000;


const exp=require("express");
const path=require("path");
const {v4: uuidv4}=require("uuid");
const override=require("method-override");

// *************************************************
const multer = require("multer");

// Set destination and filename
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '/public/uploads'));
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, uuidv4() + ext);
    }
});

const upload = multer({ storage: storage });

// **************************************************

let app=exp();
app.use(exp.urlencoded({extended:true}))
app.use(override("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(exp.static(path.join(__dirname,"public")));

let posts=[
    {
        id: uuidv4(),
        name:"Aniket",
        content:"this is aniket mishra a software engineer",
        media:"",
        color:""
    },
    {
        id: uuidv4(),
        name:"Ram",
        content:"Yoga and Meditation is the key for healthy and stress-free life",
        media:"",
        color:""
    },
    {
        id: uuidv4(),
        name:"Anuj",
        content:"Hello there i am a content creator",
        media:"",
        color:""
    }
]

app.get("/posts",(req,res)=>{
    res.render("index.ejs",{posts})
});

app.get("/posts/new",(req,res)=>{
    res.render("new.ejs");
    
})

app.post("/posts", upload.single('media'),(req,res)=>{
    let {name,content,color}=req.body;
    let media = req.file ? `/uploads/${req.file.filename}` : "";
    let id = uuidv4();
    posts.push({id,name,content ,media,color});
    res.redirect("/posts");
})

app.get("/posts/:id",(req,res)=>{
    let {id}=req.params;
    let post=posts.find((p)=>id ==p.id);
    res.render("show.ejs",{post})
    
})

app.patch("/posts/:id",upload.single('media'),(req,res)=>{
    let {id}=req.params;
    let content=req.body.content;
    let color=req.body.color;
    let media = req.file ? `/uploads/${req.file.filename}` : "";
    let post=posts.find((p)=>id ==p.id);
    post.content=content;
    post.media=media;
    post.color=color;
    res.redirect("/posts");
    
})
app.get("/posts/:id/edit",(req,res)=>{
    let {id} = req.params;
    let post =posts.find((p)=> id===p.id);
    res.render("patch.ejs",{post});
})

app.delete("/posts/:id",(req,res)=>{
    let {id} = req.params;
    posts =posts.filter((p)=> id !== p.id);
    res.redirect("/posts")
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});