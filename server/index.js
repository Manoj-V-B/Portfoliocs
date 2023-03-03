const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const mycon = require('mysql');
const fileupload = require('express-fileupload');
const { request, response } = require('express');

const app = express();
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(fileupload());
app.use(express.static('public'));

const c = mycon.createConnection({
    host : "localhost",
    port : "3306",
    user : "root",
    password : "Manoj@30_14_05",
    database : "crud_app"
});

c.connect(function(error){
    if(error){console.log(error);}
    else{console.log('Database Connected');}
})

app.get('/checkstatus',(request,response)=>{

    let sql = 'select * from regstatus';

    c.query(sql,(error,result)=>{
        if(error){
            let s = {"status":"error"};
            response.send(s);
        }
        else{
            let status = result[0].regstate;
            let s = {"status":status};
            response.send(s);
        }
    })
})

app.post('/Registration',(request,response)=>{
    let {username,password,name,fathername,Dob,email,phone} = request.body;

    let sql = 'insert into signup(username,password,name,fathername,Dob,email,phone,status) values (?,?,?,?,?,?,?,?)';

    let sql1 = 'update regstatus set regstate=?';

    c.query(sql1,[1],(error1,result1)=>{})
    c.query(sql,[username,password,name,fathername,Dob,email,phone,0],(error,result)=>{
        if(error){
            let s = {"status":"error"};
            response.send(s);
        }
        else{
            let s = {"status":"Registered"};
            response.send(s);
        }
    })
})

app.post('/Signin',(request,response)=>{
    let {username,password} = request.body;
    let sql = 'select * from signup where username=?';

    c.query(sql,[username],(error,result)=>{
        if(error){
            let s = {"status":"error"};
            response.send(s);
        }
        else if(result.length > 0){

            let id = result[0].id;
            let username1 = result[0].username;
            let password1 = result[0].password;
            if(username1 == username && password1 == password){
                let s = {"status":"Success","userid":id};
                response.send(s);
                // console.log(s);
            }
            else{
                let s = {"status":"Invalid"};
                response.send(s);
            }
        }
        else{
            let s ={"status":"final_error"};
                    // console.log(s);
            response.send(s);
        }
    })
})

app.get('/View_par_user/:id',(request,response)=>{
    let {id} = request.params;
    let sql = 'select * from signup where id=?';

    c.query(sql,[id],(error,result)=>{
        if(error){
            let s = {"status":"error"};
            response.send(s);
        }
        else{
            let name = result[0].name;
            let s = {"status":name};
            response.send(s);
        }
    })
})

app.get('/Get_userdetails/:id',(request,response)=>{
    let {id} = request.params;
    let sql = 'select * from signup where id=?';

    c.query(sql,[id],(error,result)=>{
        if(error){
            let s = {"status":"error"};
            response.send(s);
        }
        else{
            response.send(result);
        }
    })   
})
app.post('/Add_profilephoto',(request,response)=>{
    let userid = request.body.userid;
    let alt_text = request.body.alt_text;
    let imagefile = request.files.image;
    let filename = imagefile.name;
    let path = '../client/public/upload/'+imagefile.name;

    let url = 'http://localhost:3000/upload';

    let sql = 'insert into profilephoto(userid,url,filename,alt_text,status)values(?,?,?,?,?)';

    c.query(sql,[userid,url,filename,alt_text,0],(error,result)=>{});

    imagefile.mv(path, function(error) {
        if (error){
          let s = {"status":"error"};
          response.send(s);
        }
        else{
            let s = {"status":"uploaded"};
            response.send(s);
        }
      });

})

app.get('/View_profilephoto/:userid',(request,response)=>{
    let {userid} = request.params;
    let sql = 'select * from profilephoto where userid=?';
    c.query(sql,[userid],(error,result)=>{
        if(error){
            response.send(error);
        }
        else{
            response.send(result);
        }
    })
})

app.post('/Add_Education',(request,response)=>{
    let userid = request.body.userid;
    let {pg_degree,pg_institution,pg_location,pg_percentage,pg_grade,pg_passedout,ug_degree,ug_institution,ug_location,ug_percentage,ug_grade,ug_passedout,hsc_subject,hsc_school,hsc_location,hsc_percentage,hsc_grade,hsc_passedout,sslc_subjet,sslc_school,sslc_location,sslc_percentage,sslc_grade,sslc_passedout}=request.body;

    let sql = 'insert into EducationDetails(userid,pg_degree,pg_institution,pg_location,pg_percentage,pg_grade,pg_passedout,ug_degree,ug_institution,ug_location,ug_percentage,ug_grade,ug_passedout,hsc_subject,hsc_school,hsc_location,hsc_percentage,hsc_grade,hsc_passedout,sslc_subjet,sslc_school,sslc_location,sslc_percentage,sslc_grade,sslc_passedout)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

    c.query(sql,[userid,pg_degree,pg_institution,pg_location,pg_percentage,pg_grade,pg_passedout,ug_degree,ug_institution,ug_location,ug_percentage,ug_grade,ug_passedout,hsc_subject,hsc_school,hsc_location,hsc_percentage,hsc_grade,hsc_passedout,sslc_subjet,sslc_school,sslc_location,sslc_percentage,sslc_grade,sslc_passedout],(error,result)=>{
        if(error){
            let s = {'status':'error'};
            response.send(s);
        }
        else{
            let s={'status':'Registered'};
            response.send(s);
        }
    })
})

app.get('/view_education/:userid',(request,response)=>{
    let {userid}=request.params;
    let sql = 'select * from EducationDetails where userid=?';

    c.query(sql,[userid],(error,result)=>{
        if(error){
            response.send(error);
        }
        else{
            response.send(result);
        }
    })
})

app.post('/Add_Softskills/:userid',(request,response)=>{
    let userid =request.body.userid;
    
   
    let {soft_skill,skill_percentage,soft_skill1,skill_percentage1,soft_skill2,skill_percentage2,soft_skill3,skill_percentage3,soft_skill4,skill_percentage4,soft_skill5,skill_percentage5,soft_skill6,skill_percentage6,soft_skill7,skill_percentage7,soft_skill8,skill_percentage8,soft_skill9,skill_percentage9,soft_skill10,skill_percentage10}=request.body;
   let sql= 'update profilephoto set soft_skill=?,skill_percentage=?,soft_skill1=?,skill_percentage1=?,soft_skill2=?,skill_percentage2=?,soft_skill3=?,skill_percentage3=?,soft_skill4=?,skill_percentage4=?,soft_skill5=?,skill_percentage5=?,soft_skill6=?,skill_percentage6=?,soft_skill7=?,skill_percentage7=?,soft_skill8=?,skill_percentage8=?,soft_skill9=?,skill_percentage9=?,soft_skill10=?,skill_percentage10=? where userid=?';

   c.query(sql,[soft_skill,skill_percentage,soft_skill1,skill_percentage1,soft_skill2,skill_percentage2,soft_skill3,skill_percentage3,soft_skill4,skill_percentage4,soft_skill5,skill_percentage5,soft_skill6,skill_percentage6,soft_skill7,skill_percentage7,soft_skill8,skill_percentage8,soft_skill9,skill_percentage9,soft_skill10,skill_percentage10,userid],(error,result)=>{
    if(error){
        let s={"status":"error"};
        response.send(s);
    }
    else{
        let s={"status":"uploaded"};
        response.send(s);
    }
   })
})

app.post('/Add_Experinces/:userid',(request,response)=>{

    let userid = request.body.userid;
    let {experience_fieldname,experience_yearinfield}=request.body;
   
    let sql ='update profilephoto set experience_fieldname=?,experience_yearinfield=? where userid=?';

    c.query(sql,[experience_fieldname,experience_yearinfield,userid],(error,result)=>{
        if(error){
            let s={"status":"error"};
            response.send(s);
        }
        else{
            let s={"status":"uploaded"};
            response.send(s);
        }
    })
})

app.post('/Add_cerificates',(request,response)=>{
    let userid = request.body.userid;
    let certificate_text=request.body.certificate_text;
     let imagefile=request.files.image;
    let filename =imagefile.name;
    let path= '../client/public/upload/'+imagefile.name;

    let url = 'http://localhost:3000/upload';
    
     let sql ='insert into certificates(userid,certificate_text,filename,url) values(?,?,?,?)';

     c.query(sql,[userid,certificate_text,filename,url],(error,result)=>{
       
     });

     imagefile.mv(path, function(error) {
         if (error){
           let s = {"status":"error"};
           response.send(s);
         }
         else{
             let s = {"status":"uploaded"};
             response.send(s);
         }
       });

})
 
app.get('/view_certifi/:userid',(request,response)=>{
    let userid = request.params;

    let sql = 'select * from certificates where userid=?';

    c.query(sql,[userid],(error,result)=>{
        if(error){
            response.send(error);
        }
        else{
            response.send(result);
        }
    })
})
 
app.post('/Add_social',(request,response)=>{
    let userid =request.body.userid;
    let {linkedin,github}=request.body;

    let sql = 'insert into social(userid,linkedin,github) values(?,?,?)';

    c.query(sql,[userid,linkedin,github],(error,result)=>{
        if(error){
            let s={"status":"error"}
            response.send(s);
        }
        else{
            let s={"status":"uploaded"}
            response.send(s);
        }
    })
})

app.get('/view_social/:userid',(request,response)=>{
    let userid = request.params;

    let sql = 'select * from social where userid=?';

    c.query(sql,[userid],(error,result)=>{
        if(error){
            response.send(error);
            
        }
        else{
            response.send(result);

        }
    })
})

app.listen(3000, ()=>{console.log('Port number running in 3000')});