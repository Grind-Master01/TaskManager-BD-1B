require('dotenv').config();
const crypto = require("crypto");

const express = require('express');
const app = express();

app.use(express.json()); // Parse JSON bodies
const PORT = process.env.PORT ||3000;

let team = [
  { id : crypto.randomBytes(8).toString('hex'), title: "Add Rate Limiting to Public Endpoints",                status: "in_progress",          category: "security",          description: "Integrate express-rate-limit middleware to cap requests at 100 per 15 minutes per IP to prevent brute-force attacks."},
  { id : crypto.randomBytes(8).toString('hex'), title: "Implement Refresh Token Endpoint",                     status: "pending",              category: "feature",           description: "Add POST /api/v1/auth/refresh to issue new short-lived JWT access tokens using secure HTTP-only refresh cookies." },
  { id : crypto.randomBytes(8).toString('hex'), title: "Fix Memory Leak in WebSocket Gateway",                 status: "in_progress",          category: "bug",               description:"Event listeners are not properly unregistered on client disconnect, causing heap usage to spike over time." },
  { id : crypto.randomBytes(8).toString('hex'), title: "Optimize MongoDB Query Performance for User Feeds",    status: "pending",              category: "performance",       description:  "Add a compound index on { userId: 1, createdAt: -1 } to resolve slow response times on the main activity feed." },
  { id : crypto.randomBytes(8).toString('hex'), title: "Design Database Migration Script for Roles Schema",    status: "code_review",          category: "devops",            description:  "Write a backward-compatible migration script to alter the users table and add the new granular permissions column."},
  { id : crypto.randomBytes(8).toString('hex'), title: "Sanitize Input on Search Query Handler",               status: "pending",              category: "security",          description:"Raw input string passed to search service allows potential NoSQL injection vulnerabilities; enforce strict validation schemas." },
  { id : crypto.randomBytes(8).toString('hex'), title: "Configure GitHub Actions CI/CD Pipeline",              status: "completed",            category: "devops",            description: "Automate running ESLint and Jest unit tests on every pull request targeting the main branch." },
];


//GET ALL NOTES 
app.get('/team', (req,res) => {
  res.status(200).json(team);
});


// POST New - Create with Validation
app.post('/team', (req, res) => {
try {
  const { title, status, category, description  } = req.body;

  //Validate Input
  if (!title || !status || !category || !description ) {
    return res.status(400).json({ error: 'title, status,category, and description fields are required' });
  }
   //create new Task
    const newTask = {
       id: crypto.randomBytes(8).toString('hex'), title, status,category, description };
    team.push(newTask);

    res.status(201).json(newTask);
   } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error!" });
  }     
});

// PUT - Full update/replace of a team task by id
app.put('/team/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, status, category, description } = req.body;

    // Full replace requires every field, same as POST
    if (!title || !status || !category || !description) {
      return res.status(400).json({ error: 'title, status, category, and description fields are required' });
    }

    const index = team.findIndex(t => t.id === id);

    if (index === -1) {
      return res.status(404).json({ error: `No task found with id: ${id}` });
    }

    // Keep the original id, replace everything else
    const updatedTask = { id, title, status, category, description };
    team[index] = updatedTask;

    res.status(200).json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error!" });
  }
});

// DELETE a team task by id
app.delete('/team/:id', (req, res) => {
  try {
    const { id } = req.params;
    const index = team.findIndex(t => t.id === id);

    if (index === -1) {
      return res.status(404).json({ error: `No task found with id: ${id}` });
    }

    const [removed] = team.splice(index, 1);
    res.status(200).json({ message: "Task deleted successfully", task: removed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error!" });
  }
});

//Error Handler
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Inputs error!' });
});

app.listen(PORT, () => {
  console.log(`Server on port: ${PORT}`)
});


