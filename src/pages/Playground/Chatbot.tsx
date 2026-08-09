import {useEffect,useRef,useState} from "react";
import {useNavigate} from "react-router-dom";
import {Shield,Menu,Play,User,Bot,Copy,Check,Send} from "lucide-react";
import "./Chatbot.css";
const API_BASE_URL=import.meta.env.VITE_API_BASE_URL;
type Message={
role:"user"|"assistant";
content:string;
query?:string;
result?:any;
};

function flattenObject(
value:any,
prefix="",
result:any={}
){
if(value===null||value===undefined){
result[prefix]=value;
return result;
}

if(typeof value!=="object"||Array.isArray(value)){
result[prefix]=value;
return result;
}

Object.entries(value).forEach(([key,nestedValue])=>{
const nextKey=prefix?`${prefix}.${key}`:key;
flattenObject(nestedValue,nextKey,result);
});

return result;
}

export default function Chatbot(){

const [sidebarOpen,setSidebarOpen]=useState(true);
const [message,setMessage]=useState("");
const [messages,setMessages]=useState<Message[]>([]);
const [loading,setLoading]=useState(false);
const [copiedIndex,setCopiedIndex]=useState<number|null>(null);

const messagesEndRef=useRef<HTMLDivElement|null>(null);
const navigate=useNavigate();

useEffect(()=>{
messagesEndRef.current?.scrollIntoView({
behavior:"smooth"
});
},[messages]);

const handleSend=async()=>{

const text=message.trim();

if(!text)return;


setMessages(prev=>[
...prev,
{
role:"user",
content:text
}
]);

setMessage("");
setLoading(true);


try{

const response=await fetch(
`${API_BASE_URL}/generate-query`,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
user_prompt:text
})
}
);


const data=await response.json();


setMessages(prev=>[
...prev,
{
role:"assistant",
content:data.message||"Query generated successfully.",
query:JSON.stringify(data.query,null,2)
}
]);


}catch{

setMessages(prev=>[
...prev,
{
role:"assistant",
content:"Failed to generate query."
}
]);

}

finally{
setLoading(false);
}

};

const handleRunQuery=async(index:number)=>{

const current=messages[index];

if(!current.query)return;


try{

const response=await fetch(
`${API_BASE_URL}/indexer-proxy`,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:current.query
}
);

const data=await response.json();


setMessages(prev=>
prev.map((msg,i)=>
i===index
?
{
...msg,
result:data
}
:
msg
)
);


}catch(error){

console.log(error);

}

};



const handleCopy=async(
query:string,
index:number
)=>{

await navigator.clipboard.writeText(query);

setCopiedIndex(index);

setTimeout(()=>{
setCopiedIndex(null);
},1500);

};

const handleKeyDown=(e:React.KeyboardEvent)=>{

if(e.key==="Enter"&&!e.shiftKey){

e.preventDefault();

handleSend();

}

};
return(
<div className="siem-chatbot">

<div className={sidebarOpen?"siem-sidebar":"siem-sidebar closed"}>

<div className="sidebar-brand">
<div className="sidebar-logo">
<Shield size={20}/>
</div>
<div className="sidebar-title">
SIEM Assistant
</div>
</div>


<div
className="sidebar-item"
onClick={()=>navigate("/playground")}
>
<Play size={16}/>
Playground
</div>


<div className="sidebar-item active">
<Bot size={16}/>
Chat
</div>
</div>
<div className="siem-main">


<div className="siem-header">

<button
className="menu-button"
onClick={()=>setSidebarOpen(!sidebarOpen)}
>
<Menu size={20}/>
</button>

<div className="header-title">
SIEM Assistant
</div>

</div>

<div className="chat-area">

{
messages.length===0

?

<div className="welcome">

<div className="welcome-logo">
</div>

<h1 className="welcome-title">
How can I help with your SIEM?
</h1>

<p className="welcome-text">
Generate and execute Wazuh OpenSearch queries using natural language.
</p>

</div>

:

<div className="messages">


{
messages.map((item,index)=>(

<div
className="message-row"
key={index}
>

<div className={
item.role==="user"
?
"avatar user-avatar"
:
"avatar assistant-avatar"
}>

{
item.role==="user"
?
<User size={18}/>
:
<Bot size={18}/>
}

</div>



<div className="message-content">


<div className="message-name">

{
item.role==="user"
?
"You"
:
"SIEM Assistant"
}

</div>

<div className="message-text">
{item.content}
</div>

{
item.query&&

<div className="query-card">


<div className="query-header">

Generated Query


<button
className="copy-button"
onClick={()=>handleCopy(item.query!,index)}
>

{
copiedIndex===index
?
<Check size={14}/>
:
<Copy size={14}/>
}


{
copiedIndex===index
?
"Copied"
:
"Copy"
}


</button>


</div>

<pre className="query-code">
{item.query}
</pre>



<button
className="query-button run-button"
onClick={()=>handleRunQuery(index)}
>

Run Query

</button>


</div>

}

{
item.result?.hits?.hits &&


<div className="table-container">


<h3 className="table-title">

Search Results {
item.result.hits.hits.length
} records

</h3>

<table className="result-table">


<thead>

<tr>


{

(()=>{

const rows=item.result.hits.hits.map(
(hit:any)=>({
id:hit._id,
...flattenObject(hit._source||{})
})
);

const columns:string[]=[];


rows.forEach((row:any)=>{

Object.keys(row).forEach(key=>{

if(!columns.includes(key)){
columns.push(key);
}

});

});


return columns.map(col=>(

<th key={col}>
{col}
</th>

));


})()

}



</tr>

</thead>
<tbody>

{

(()=>{


const rows=item.result.hits.hits.map(
(hit:any)=>({
id:hit._id,
...flattenObject(hit._source||{})
})
);


const columns:string[]=[];


rows.forEach((row:any)=>{

Object.keys(row).forEach(key=>{

if(!columns.includes(key)){
columns.push(key);
}

});

});
return rows.map((row:any,rowIndex:number)=>(


<tr key={row.id||rowIndex}>


{

columns.map(column=>(

<td key={column}>

{
JSON.stringify(
row[column],
null,
2
) || "-"
}

</td>

))

}


</tr>


));


})()


}


</tbody>


</table>


</div>

}



</div>


</div>


))

}


<div ref={messagesEndRef}/>


</div>

}


</div>




<div className="input-area">


<div className="input-box">


<textarea

className="message-input"

value={message}

onChange={(e)=>setMessage(e.target.value)}

onKeyDown={handleKeyDown}

placeholder="Ask your SIEM query..."

/>



<button

className="send-button"

onClick={handleSend}

disabled={loading}

>

<Send size={18}/>

</button>
</div>
</div>



</div>


</div>

);

}