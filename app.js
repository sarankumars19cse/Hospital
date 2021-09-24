const express=require("express")
const mongoose=require("mongoose")
const alert=require("alert")

const app=express();
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.set("view engine","ejs")

mongoose.connect(process.env.MONGOD_URI||"mongodb://localhost:27017/hospitalDB", { useNewUrlParser: true, useUnifiedTopology: true });

let port=process.env.PORT||5000;

const MONGOD_URI="mongodb+srv://Saran:saran@123@cluster0.zhfzn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

const userSchema=new mongoose.Schema({
    name:String,
    password:String,
    email:String
})

const User=new mongoose.model("user",userSchema)

const admissionSchema=new mongoose.Schema({
    username:String,
    p_name:String,
    age:Number,
    dob:String,
    address:String,
    purpose:String,
    a_name:String
})

const Admission=new mongoose.model("admission",admissionSchema)

const ambulanceSchema=new mongoose.Schema({
    username:String,
    from:String,
    to:String,
    time:String,
    attenders:Number
})

const Ambulance=new mongoose.model("ambulance",ambulanceSchema)

const medicalSchema=new mongoose.Schema({
    username:String,
    doctor_name:String,
    address:String
})

const Medical=new mongoose.model("medical",medicalSchema)

let count=0;
let uname;

app.get("/",function(req,res){
    res.render("index");
})

app.get("/admission",function(req,res){
    if(count==1){
        res.render("admission");
    }
    else{
        res.redirect("/signin");
    }
})

app.get("/ambulance",function(req,res){
    if(count==1){
    res.render("ambulance");
    }
    else{
        res.redirect("/signin");
    }
})

app.get("/medical",function(req,res){
    if(count==1){
    res.render("medical");
    }
    else{
        res.redirect("/signin")
    }
})

app.get("/signin",function(req,res){
    res.render("signin");
})

app.get("/signup",function(req,res){
    res.render("signup");
})

app.get("/logout",function(req,res){
    count=0;
    res.redirect("/signin");
})

app.post("/signup",function(req,res){
    const name=req.body.user;
    User.findOne({name:name},function(e,found){
        if(e){
            console.log(e);
        }
        else{
            if(found){
                alert("User name already taken");
                res.redirect("/signup");
            }
            else{
                const NewUser=new User({
                    name:req.body.user,
                    password:req.body.pass,
                    email:req.body.mail
                });
                NewUser.save(function(e){
                    if(e){
                        console.log(e)
                    }
                    else{
                        res.redirect("/signin")
                    }
                })
            }
        }
    })
})

app.post("/signin",function(req,res){
    const name=req.body.user;
    const pass=req.body.pass;
    User.findOne({name:name},function(e,found){
        if(e){
            console.log(e)
        }
        else{
            if(found){
                if(found.password===pass){
                    count=1;
                    uname=name;
                    res.redirect("/admission")
                }
                else{
                    alert("Incorrect Password")
                    res.redirect("/signin")
                }
            }
            else{
                alert("Incorrect Username")
                res.redirect("/sigin")
            }
        }
    })
})

app.post("/admission",function(req,res){
    const NewAdmission=new Admission({
        username:uname,
        p_name:req.body.patientName,
        age:req.body.age,
        dob:req.body.dob,
        address:req.body.address,
        purpose:req.body.purpose,
        a_name:req.body.attenderName
    })
    NewAdmission.save(function(e){
        if(e){
            console.log(e)
        }
        else{
            alert("Record Saved Sucessfully");
            res.redirect("/admission")
        }
    })
})

app.post("/ambulance",function(req,res){
    const NewAmbulance=new Ambulance({
        username:uname,
        from:req.body.from,
        to:req.body.to,
        time:req.body.time,
        attenders:req.body.attenders
    })
    NewAmbulance.save(function(e){
        if(e){
            console.log(e)
        }
        else{
            alert("Record Saved Successfully")
            res.redirect("/ambulance")
        }
    })
})

app.post("/medical",function(req,res){
    const NewMedical=new Medical({
        username:uname,
        doctor_name:req.body.doctorName,
        address:req.body.hospitalAddress
    })
    NewMedical.save(function(e){
        if(e){
            console.log(e)
        }
        else{
            alert("Record saved sucessfully")
            res.redirect("/medical")
        }
    })
})

app.listen(port,function(){
    console.log("app is running in the browser");
})