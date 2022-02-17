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

const admissionSchema=new mongoose.Schema({
    admission_no:Number,
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

let count=0;
let uname;
let admissno = 0;

app.get("/",function(req,res){
    res.render("index");
})

app.get("/admission",function(req,res){
    let max = 0;
    Admission.find({},function(e,found){
        if(!e){
        found.forEach((val) =>{
            if(val.admission_no > max)
            {
                max = val.admission_no;
            }
        } )
    res.render("admission",{mes:"",admissNo:max});
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
    var max = 0;
    Admission.find({},function(e,found){
        found.forEach((val) =>{
            if(val.admission_no > max)
            {
                max = val.admission_no;
            }
        } )
        max++;
        const NewAdmission=new Admission({
            admission_no:max,
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
                res.render("admission",{mes:"Success",admissNo:max});
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
    res.render("signin",{mes:""});
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
                    res.render("signin",{mes:"password"});
                }
            }
            else{
                res.render("signin",{mes:"username"});
            }
        }
    })
})

app.get("/signup",function(req,res){
    res.render("signup",{mes:""});
})

app.post("/signup",function(req,res){
    const name=req.body.user;
    User.findOne({name:name},function(e,found){
        if(e){
            console.log(e);
        }
        else{
            if(found){
                res.render("signup",{mes:"taken"});
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

app.get("/logout",function(req,res){
    count=0;
    res.redirect("/signin");
})

app.get("/admissionDet",function(req,res)
{
    Admission.find({},function(e,found){
                if(!e)
                {
                    res.render("admissionDet",{found:found,admiss_no:0,sno:1});
                }
            })
})
app.get("/ambulanceDet",function(req,res)
{
    if(count == 0)
        res.redirect("/signin");
    else{    
    Ambulance.find({},function(e,found1){
                if(!e)
                {
                    res.render("ambulanceDet",{found:found1,sno:1});
                }
            })
        }
})

app.get("/admin",function(req,res){
    var current = new Date();
    var date = current.getDate();
    var month = current.getMonth()+1;
    var year = current.getFullYear();
    if(count == 0)
        res.redirect("/signin");
    else{
    Admission.find({},function(e,found){
        if(!e)
        {
            res.render("admin",{found:found,date:date,month:month,year:year,no:1});
        }
    })
}
})

app.post("/patient_det",function(req,res){
    var admiss_no = req.body.admiss_no;
    Admission.find({},function(e,found){
        if(!e)
        {
            res.render("admissionDet",{found:found,admiss_no:admiss_no,sno:1});
        }
    })
})

// app.get("/find",function(req,res){
//     Admission.find({},function(e,found){
//         if(!e)
//         {
//             res.render("admissionDet",{found:found});
//         }
//     })
//     // res.redirect("/admissionDet");
// })

// app.get("/medical",function(req,res){
//     res.render("medical");
// })

// app.post("/medical",function(req,res){
//     const NewMedical=new Medical({
//         username:uname,
//         doctor_name:req.body.doctorName,
//         address:req.body.hospitalAddress
//     })
//     NewMedical.save(function(e){
//         if(e){
//             console.log(e)
//         }
//         else{
//             alert("Record saved sucessfully")
//             res.redirect("/medical")
//         }
//     })
// })

app.post("/deleteamb",function(req,res){
    var id = req.body.id;
    Ambulance.deleteOne({_id:id},function(e,f){
        if(!e)
        {
            res.redirect("/ambulanceDet");
        }
    })
})
app.post("/deletepat",function(req,res){
    var id = req.body.id;
    Admission.deleteOne({admission_no:id},function(e,f){
        if(!e)
        {
            res.redirect("/admin");
        }
    })
})

app.get("/temp",function(req,res){
    res.render("temp");
})

app.listen(port,function(){
    console.log("app is running in the browser");
})