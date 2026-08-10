const express=require("express"),crypto=require("crypto");
const app=express();app.use(express.json());app.use(express.static("public"));
const port=process.env.PORT||3000;
app.get("/api/health",async(_,r)=>{
 const configured=!!process.env.OPENAI_API_KEY;
 if(!configured)return r.json({ok:true,aiStatus:"offline",reason:"OPENAI_API_KEY is not configured"});
 try{
   const resp=await fetch("https://api.openai.com/v1/models",{headers:{Authorization:"Bearer "+process.env.OPENAI_API_KEY}});
   r.json({ok:true,aiStatus:resp.ok?"connected":"error",httpStatus:resp.status});
 }catch(e){r.json({ok:true,aiStatus:"error",reason:"network request failed"})}
});
app.post("/api/ai-test",async(_,r)=>{
 if(!process.env.OPENAI_API_KEY)return r.status(503).json({ok:false,error:"AI key not configured"});
 try{
  const resp=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+process.env.OPENAI_API_KEY},body:JSON.stringify({model:process.env.OPENAI_MODEL||"gpt-5-mini",input:"Reply with exactly: StudyMind AI OK"})});
  const text=await resp.text();r.status(resp.ok?200:502).json({ok:resp.ok,status:resp.status,response:resp.ok?"AI request succeeded":"AI request failed"});
 }catch(e){r.status(502).json({ok:false,error:"network request failed"})}
});
app.get("/api/config",(_,r)=>r.json({version:"1.3.0",curriculum:"الثالث الثانوي 2027",track:"علمي رياضة",apiKeyExposed:false}));
app.listen(port,()=>console.log("StudyMind V1.3 listening on "+port));
