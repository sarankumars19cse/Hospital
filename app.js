const express=require("express")
const mongoose=require("mongoose")
let port = process.env.PORT || 8000

const app=express();
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.set("view engine","ejs")

mongoose.connect("mongodb://localhost:27017/hospitalDB",{ useNewUrlParser: true , useUnifiedTopology: true})

const userSchema=new mongoose.Schema({
    name:String,
    password:String,
    email:String
})

const User=new mongoose.model("user",userSchema)

// const adminSchema = new mongoose.Schema({
//     name:{type:String,default:"admin"},
//     password:{type:String,default:"admin"}
// })

// const admin = new mongoose.model("admin",adminSchema);

const admissionSchema=new mongoose.Schema({
    // admission_no:Number,
    admis_date:Number,
    admis_month:Number,
    admis_year:Number,
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
    patientName:String,
    from:String,
    to:String,
    time:String,
    attenders:Number,
    attenderName:String
})

const Ambulance=new mongoose.model("ambulance",ambulanceSchema)

const roomSchema = new mongoose.Schema({
    roomNo:Number,
    admissDate:String,
    name:String,
    age:Number,
    place:String,
    attenderName:String
})

const room = new mongoose.model("room",roomSchema)

let count=0;
let uname;
let admissno = 0;

app.get("/",function(req,res){
    res.render("index",{count:count});
})

app.get("/admission",function(req,res){
    let c = 1;
    Admission.find({},function(e,found){
        if(!e){
        found.forEach((val) =>{
            c++;
        } )
    res.render("admission",{mes:"",admissNo:c});
        }
    })
})

app.post("/admission",function(req,res){
    var admissionDate = new Date();
    var date = admissionDate.getDate()+2;
    var month = admissionDate.getMonth()+1;
    var year = admissionDate.getFullYear();

    function leap()
    {
        if(year % 4 == 0)
        {
            if(year % 100 ==0)
            {
                if(year % 400 ==0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return true;
            }    
        }
        else
        {
            return false;
        }
    }

    if(month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12)
    {
        if(date>31)
        {
            if(date == 32)
                date = 1;
            else
                date = 2;    
            month = month+1;
            if(month == 12)
            {
                date = 1;
                month = 1;
                year += 1;
            }
        }
    }
    else if(month == 4 || month == 6 || month == 9 || month == 11)
    {
        if(date == 31)
        {
            date = 1;
            month += 1;
        }
        else
        {
            date = 2;
            month += 1;
        }
    }
    else{
        if(leap())
        {
            if(date == 30)
            {
                date = 1;
                month += 1;
            }
            else if(date == 31)
            {
                date = 2;
                month += 1;
            }
        }
        else
        {
            if(date == 29)
            {
                date = 1;
                month += 1;
            }
            else if(date == 30)
            {
                date = 2;
                month += 1;
            }
        }   
    }
    admissno++;
    var c = 1;
    Admission.find({},function(e,found){
        found.forEach((val) =>{
                c=c+1;
        } )
        const NewAdmission=new Admission({
            // admission_no:max,
            admis_date:date,
            admis_month:month,
            admis_year:year,
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
                res.render("admission",{mes:"Success",admissNo:c+1});
            }
        })
    })
    // admissno = max;
})

app.get("/ambulance",function(req,res){
    res.render("ambulance",{mes:""});
})

app.post("/ambulance",function(req,res){
    const NewAmbulance=new Ambulance({
        username:uname,
        patientName:req.body.patientName,
        from:req.body.from,
        to:req.body.to,
        time:req.body.time,
        attenders:req.body.attenders,
        attenderName:req.body.attenderName
    })
    NewAmbulance.save(function(e){
        if(e){
            console.log(e)
        }
        else{
            res.render("ambulance",{mes:"Success"});
        }
    })
})

app.get("/signin",function(req,res){
    res.render("sign",{mes:""});
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
                    res.redirect("/admin")
                }
                else{
                    res.render("sign",{mes:"password"});
                }
            }
            else{
                res.render("sign",{mes:"username"});
            }
        }
    })
})

app.get("/signup",function(req,res){
    res.render("sign",{mes:""});
})

app.post("/signup",function(req,res){
    const name=req.body.user;
    User.findOne({name:name},function(e,found){
        if(e){
            console.log(e);
        }
        else{
            if(found){
                res.render("sign",{mes:"taken"});
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

app.get("/adminsign",function(req,res){
    res.render("adminsign",{mes:""});
})

app.post("/adminsign",function(req,res){
    var name = req.body.useradmin;
    var pass = req.body.passadmin;
    if(name == "admin")
    {
        if(pass == "admin")
        {
            res.redirect("/signin");
        }
        else{
            res.render("adminsign",{mes:"password"})
        }
    }
    else{
        res.render("adminsign",{mes:"username"});
    }
})

app.get("/logout",function(req,res){
    count=0;
    res.redirect("/signin");
})

app.get("/admissionDet",function(req,res)
{
    var NoOfEntries=0;
    if(count == 0)
        res.redirect("/signin");
    else{  
    Admission.find({},function(e,f){
        f.forEach((val) => {
            NoOfEntries++;
        })
        Admission.find({},function(e,found){
            if(!e)
            {
                res.render("admissionDet",{found:found,admiss_no:0,sno:1,count:count,NoOfEntries:NoOfEntries});
            }
        })
    }) 
}
})
app.get("/ambulanceDet",function(req,res)
{
    var NoOfEntries = 0;
    if(count == 0)
        res.redirect("/signin");
    else{  
        Ambulance.find({},function(e,f){
            f.forEach((val) => {
                NoOfEntries++;
            })
            Ambulance.find({},function(e,found1){
                        if(!e)
                        {
                            res.render("ambulanceDet",{found:found1,sno:1,NoOfEntries:NoOfEntries});
                        }
                    })
        })  
        }
})

app.get("/admin",function(req,res){
    var NoOfEntries = 0;
    var current = new Date();
    var date = current.getDate();
    var month = current.getMonth()+1;
    var year = current.getFullYear();
    Admission.find({},function(e,f){
        f.forEach((val) => {
            NoOfEntries++;
        })
        if(count == 0)
            res.redirect("/signin");
        else
        {
            Admission.find({},function(e,found){
                if(!e)
                {
                    res.render("admin",{found:found,date:date,month:month,year:year,no:1,NoOfEntries:NoOfEntries});
                }
        })
    }
    }) 
})

app.post("/patient_det",function(req,res){
    var NoOfEntries=0;
    var admiss_no = req.body.admiss_no;
    Admission.find({},function(e,f){
        f.forEach((val) => {
            NoOfEntries++;
        })
        Admission.find({},function(e,found){
            if(!e)
            {
                res.render("admissionDet",{found:found,admiss_no:admiss_no,sno:1,count:count,NoOfEntries:NoOfEntries});
            }
        })
    }) 
})
app.post("/room_det",function(req,res){
    var NoOfEntries=0;
    var room_no = req.body.admiss_no;
    room.find({},function(e,f){
        f.forEach((val) => {
            NoOfEntries++;
        })
        room.find({},function(e,found){
            if(!e)
            {
                res.render("roomDetails",{found:found,sno:1,count:count,NoOfEntries:NoOfEntries,admiss_no:room_no});  
            }
        })
    }) 
})

app.post("/deleteamb",function(req,res){
    var id = req.body.id;
    var NoOfEntries = 0;
    Ambulance.find({},function(e,f){
        f.forEach((val) => {
            NoOfEntries++;
        })
        Ambulance.deleteOne({_id:id},function(e,f){
            if(!e)
            {
                Ambulance.find({},function(e,found1){
                    if(!e)
                    {
                        res.render("ambulanceDet",{found:found1,sno:1,NoOfEntries:NoOfEntries-1});
                    }
                })
            }
        })
    }) 
})
app.post("/deletepat",function(req,res){
    var NoOfEntries = 0;
    var current = new Date();
    var date = current.getDate();
    var month = current.getMonth()+1;
    var year = current.getFullYear();
    var id = req.body.id;
    Admission.find({},function(e,f){
        f.forEach((val) => {
            NoOfEntries++;
        })
        Admission.deleteOne({admission_no:id},function(e,f){
            if(!e)
            {
                Admission.find({},function(e,found){
                    if(!e)
                    {
                        res.render("admin",{found:found,date:date,month:month,year:year,no:1,NoOfEntries:NoOfEntries-1});
                    }
                })
            }
        })
    }) 
})

app.get("/roomDetails",function(req,res){
    var NoOfEntries = 0;
    room.find({},function(e,f){
        f.forEach((val) => {
            NoOfEntries++;
        })
        room.find({},function(e,found){
            if(!e)
                res.render("roomDetails",{found:found,sno:1,count:count,NoOfEntries:NoOfEntries-1,admiss_no:0});  
        })
    }) 
})

app.get("/roomEntry",function(req,res){
    var arr=[];
    if(count==1)
    {
        room.find({},function(e,found){
            if(!e)
            {
                var i=0;
                found.forEach((val) => {
                    arr[i++] = val.roomNo;
                })
                res.render("roomEntry",{mes:"",found:arr});
            }
        })
    }
    else
        res.redirect("/signin");    
})

app.post("/roomEntry",function(req,res){
    var arr=[];
    const roomNo=req.body.roomNo;
    var c=0;
    room.find({},function(e,found){
        if(!e)
            found.forEach(function(val){
                c++;
    })
    if(c<=10){
    room.findOne({roomNo:roomNo},function(e,found){
        if(e)
        {
            console.log("Error occured during find room no.");
        }
        if(found)
        {
            room.find({},function(e,found1){
                if(!e)
                {
                    var i=0;
                    found1.forEach((val) => {
                        arr[i++] = val.roomNo;
                    })
                    res.render("roomEntry",{mes:"found",found:arr});
                }
            })
        }
        else{
            const Room = new room({
                roomNo:roomNo,
                admissDate:req.body.admissDate,
                name:req.body.patientName,
                age:req.body.age,
                place:req.body.place,
                attenderName:req.body.attenderName
            })
            Room.save(function(e){
                if(!e)
                {
                    room.find({},function(e,found1){
                        if(!e)
                        {
                            var i=0;
                            found1.forEach((val) => {
                                arr[i++] = val.roomNo;
                            })
                            res.render("roomEntry",{mes:"sucess",found:arr});
                        }
                    })
                }
            })
        }
    })
}
else{
    room.find({},function(e,found1){
        if(!e)
            {
                var i=0;
                found1.forEach((val) => {
                    arr[i++] = val.roomNo;
                })
                res.render("roomEntry",{mes:"filled",found:arr});
            }
    })
}
})
})

app.post("/deleteRoom",function(req,res){
    var roomno = req.body.id;
    room.deleteOne({roomNo:roomno},function(e,f){
        if(!e)
            res.redirect("/adminRoom");
    })
})

app.get("/adminRoom",function(req,res){
    var NoOfEntries = 0;
    room.find({},function(e,f){
        f.forEach((val) => {
            NoOfEntries++;
        })
        if(count == 0)
            res.redirect("/signin");
        else{
        room.find({},function(e,found){
            if(!e)
            {
                res.render("adminRoom",{found:found,no:1,NoOfEntries:NoOfEntries});
            }
        })
    }
    }) 
})

app.listen(port,function(){
    console.log("app is running in the browser");
})