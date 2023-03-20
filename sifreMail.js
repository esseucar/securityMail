var http=require('http');
var url=require('url');
var mysql=require('mysql');
var fs=require('fs');
var nodemailer=require('nodemailer');

var con=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database: 'nodedb'
});
con.connect(function(err){  //veri tabanı b
    if(err) throw err;
    console.log("Bağlandi");
});

var transporter = nodemailer.createTransport(
    {
        service: 'Hotmail',
        auth: {
            user: '******@hotmail.com',
            pass: '*******'
        }
    }
);


http.createServer(function(req,res){

      

    fs.readFile("form.html",function(err,data){
    if(err){
        res.writeHead(404,{'Content-Type':'text/html'});
        return res.end("404-bulunamadi.");
    }
    res.writeHead(200,{'Content-Type':'text/html'});
    res.write(data);
    return res.end();
   });

   var bilgi=url.parse(req.url,true).query;     
          //parse edilen urlyi json haline getirir = query
   if(bilgi.username && bilgi.password){

    var sql= "SELECT * FROM `user` WHERE username='"+bilgi.username+"'";     
            // var degerler=[bilgi.username,bilgi.password];                                                                             
            con.query(sql,function(err,result){
            if(err){throw err;} 
            else{
                if(result[0].password== bilgi.password){
                    console.log("bilgiler doğru");
                }
                else{
                    var mailOption ={
                        from:'esseucar@hotmail.com',
                        to:bilgi.username,
                        subject:'Node.js ile  kayit mail atıyorum!',
                        text:'username: '+bilgi.username+' ile giris yapilmaya calisiliyor password: '+bilgi.password+'olarak denendi'
                        };
                        
                    transporter.sendMail(mailOption, function (err, info){
                        if (err){ throw err;}
                        else{
                            console.log("hesaba girilmeye calışıyor mail is sent" + info);
                            
                            console.log("mail atildi");                                  
                        
                        }
                        
                
                    });
                }
            }
        });

   
    }
    

    
}).listen(8080);
