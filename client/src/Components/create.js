import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
import { handleRequest } from './errorHandle';
import queryString from "querystring";

export default function Create() {
 const [data, setData] = useState({
   title: "",
   description: "",
   username: "",
   user_id: "",
   lastUpdated: ""
 });
  const navigate = useNavigate();
  const { user, getAccessTokenSilently } = useAuth0();
  const location = useLocation();
 function updateForm(value) {
  value.username = user.nickname;
  value.user_id = user.sub;
  value.lastUpdated = Date().toLocaleString();
   return setData((prev) => {
     return { ...prev, ...value };
   });
 }
 
 async function onSubmit(e) {
   e.preventDefault();
   const newPerson = { ...data };
   try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newPerson),
      });
      
     const ret = await handleRequest(response);
     if (!ret) {
       navigate("*");
       return;
     }
     
     // Reset the data
     setData({ 
      title: "", 
      description: "", 
      username: "", 
      user_id: "",
      lastUpdated: ""
      });
     navigate("/");
   } catch (error) {
     console.error(error);
     throw new Error("An error occurred while fetching the results:", error);
   }
}
 return (
   <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "100vh" }}>
     <h3>New Post</h3>
     <form onSubmit={onSubmit}>
       <div className="form-group">
         <label htmlFor="title">Title</label>
         <input
           type="text"
           className="form-control"
           id="title"
           value={data.title}
           onChange={(e) => updateForm({ title: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="description">Description</label>
         <textarea
           type="text"
           className="form-control"
           id="description"
           value={data.description}
           onChange={(e) => updateForm({ description: e.target.value})}
         />
       </div>
       <div className="form-group">
         <label htmlFor="username">Username</label>
         <input
           type="text"
           className="form-control"
           id="username"
           defaultValue={user.nickname}
           disabled={true}
         />
       </div>
       <div className="form-group pt-3">
         <input
           type="submit"
           value="Create Post"
           className="btn btn-primary"
         />
       </div>
     </form>
   </div>
 );
}