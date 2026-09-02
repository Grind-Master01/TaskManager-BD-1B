require('dotenv').config();
const crypto = require("crypto");

const express = require('express');
const app = express();

app.use(express.json()); // Parse JSON bodies
const PORT = process.env.PORT ||3000;

let teamTask = [
  { id : crypto.randomBytes(8).toString('hex'), title: "Add Rate Limiting to Public Endpoints",                status: "in_progress",          category: "security",          description: "Integrate express-rate-limit middleware to cap requests at 100 per 15 minutes per IP to prevent brute-force attacks."},
  { id : crypto.randomBytes(8).toString('hex'), title: "Implement Refresh Token Endpoint",                     status: "pending",              category: "feature",           description: "Add POST /api/v1/auth/refresh to issue new short-lived JWT access tokens using secure HTTP-only refresh cookies." },
  { id : crypto.randomBytes(8).toString('hex'), title: "Fix Memory Leak in WebSocket Gateway",                 status: "in_progress",          category: "bug",               description: "Event listeners are not properly unregistered on client disconnect, causing heap usage to spike over time." },
  { id : crypto.randomBytes(8).toString('hex'), title: "Optimize MongoDB Query Performance for User Feeds",    status: "pending",              category: "performance",       description: "Add a compound index on { userId: 1, createdAt: -1 } to resolve slow response times on the main activity feed." },
  { id : crypto.randomBytes(8).toString('hex'), title: "Design Database Migration Script for Roles Schema",    status: "code_review",          category: "devops",            description: "Write a backward-compatible migration script to alter the users table and add the new granular permissions column."},
  { id : crypto.randomBytes(8).toString('hex'), title: "Sanitize Input on Search Query Handler",               status: "pending",              category: "security",          description: "Raw input string passed to search service allows potential NoSQL injection vulnerabilities; enforce strict validation schemas." },
  { id : crypto.randomBytes(8).toString('hex'), title: "Configure GitHub Actions CI/CD Pipeline",              status: "completed",            category: "devops",            description: "Automate running ESLint and Jest unit tests on every pull request targeting the main branch." },
];


//GET ALL TEAM TASKS
app.get('/teamTask', (req,res) => {
  res.status(200).json(teamTask);
});


//GET TEAM TASK BY IT'S ID
app.get('/teamTask/:id', (req, res) => {
  try {
    const idParam = req.params.id;    
  
  const newteamTask = teamTask.find((t => t.id.toString() === idParam));

  if (!newteamTask) {
     return res.status(404).json({error:"Team Task not found"});
     }
  return res.status(200).json(newteamTask);
  } catch (error) {
    next(error);
     res.status(500).json({ error: "Server error" });
  }
});


// POST New - Create with Validation
app.post('/teamTask', (req, res) => {
try {
  const { title, status, category, description  } = req.body;

  //Validate Input
  if (!title || !status || !category || !description ) {
    return res.status(400).json({ error: 'title, status,category, and description fields are required' });
  }
   //create new team  Task
    const newteamTask = {
       id: crypto.randomBytes(8).toString('hex'), title, status,category, description };
    teamTask.push(newteamTask);

    res.status(201).json(newteamTask);
   } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error!" });
  }     
});


//CREATE TEAM TASKS WITH PUT
app.put('/teamTask/:id', (req, res) => {
  try {
    const idParam = req.params.id;
    const { title, status, category, description   } = req.body;

    const newteamTask = teamTask.find(t => t.id.toString() === idParam);
    if (! newteamTask) {
      return res.status(404).json({ error: 'Team Task Inputs not done Corrctly' });
    }

    // 2. Input Validation (Ensure required fields exist in req.body)
    if (!title || !status || !category || !description  ) {
      return res.status(400).json({ 
        error: 'Inputs error!', 
        message: 'All fields (title, status, category, description  ) are required for PUT.' 
      });
    }
    // 3. Update all or Part  of Team Task
     newteamTask.title = title;
     newteamTask.status = status;
     newteamTask.category = category; 
     newteamTask.description = description;

 //Return Updated Task
    return res.status(200).json(newteamTask);
  } catch (err) {
    return res.status(500).json({ error: 'Inputs error!', details: 'Check Inputs' });
  }
});

// PATCH Update – Partial     // Find the team Task by ID
app.patch('/teamTask/:id', (req, res) => {
   const id = req.params.id;
  const newteamTask = teamTask.find(t => t.id.toString() === id); 
  if (!newteamTask) return res.status(404).json({ error: 'Team Task not Complete for PATCH' });

  const { status, category } = req.body;
  if (category)  {  newteamTask.category = category;}
  if (status)    {  newteamTask.status = status;}

 return res.status(200).json(newteamTask);
});


// DELETE A TEAM TASK BY IT'S  :ID
app.delete('/teamTask/:id', (req, res) => {
  try {
    const { id } = req.params;
    const index = teamTask.findIndex(t => t.id === id);

    if (index === -1) {
      return res.status(404).json({ error: `No Team Task found with id: ${id}` });
    }

    const [removed] = teamTask.splice(index, 1);
    res.status(200).json({ message: "Team Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error!" });
  }
});


//Error Handler
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'internal server error occurred.!' });
});

app.listen(PORT, () => {
  console.log(`Server on port: ${PORT}`)
});


