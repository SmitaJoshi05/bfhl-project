# BFHL Full Stack Engineering Challenge

##  Overview

This project implements a full-stack solution for processing hierarchical node relationships via a REST API and visualizing the results through a responsive frontend.

The system accepts node relationships (e.g., `A->B`) and:

* Constructs hierarchical trees
* Detects cycles
* Filters invalid inputs
* Handles duplicate edges
* Provides structured analytical output

---

##  Live Demo

* **Frontend (Netlify):** https://venerable-conkies-02d482.netlify.app/
* **Backend API (Render):** https://bfhl-project-y68v.onrender.com 

---

##  Tech Stack

### Backend

* Node.js
* Express.js
* CORS Middleware

### Frontend

* HTML5
* CSS3
* Vanilla JavaScript

### Deployment

* Backend: Render
* Frontend: Netlify

---

##  API Specification

### Endpoint

```
POST /bfhl
```

### Request Body

```json
{
  "data": ["A->B", "A->C", "B->D"]
}
```

### Response Structure

```json
{
  "user_id": "name_ddmmyyyy",
  "email_id": "email@srmist.edu.in",
  "college_roll_number": "roll",
  "hierarchies": [...],
  "invalid_entries": [...],
  "duplicate_edges": [...],
  "summary": {...}
}
```

---

##  Core Features

### 1. Input Validation

* Accepts only valid node format: `X->Y`
* Rejects:

  * malformed strings
  * non-uppercase characters
  * self-loops (`A->A`)
  * incomplete edges

---

### 2. Duplicate Edge Handling

* First occurrence is considered valid
* Subsequent duplicates are recorded separately

---

### 3. Tree Construction

* Builds hierarchical structures from valid edges
* Supports multiple independent trees
* Identifies root nodes automatically

---

### 4. Cycle Detection

* Detects cyclic dependencies in node groups
* Returns:

  * empty tree `{}`
  * `has_cycle: true`

---

### 5. Multi-parent Resolution

* If a node has multiple parents:

  * only the first encountered parent is used
  * others are ignored (as per specification)

---

### 6. Depth Calculation

* Computes longest root-to-leaf path
* Used to determine:

  * largest tree

---

### 7. Summary Generation

Provides:

* total number of valid trees
* total number of cyclic groups
* root of the largest tree

---

##  Frontend Features

* Interactive input field for node data
* Clean card-based UI for:

  * hierarchies
  * errors
  * summary
* Recursive tree visualization
* Raw JSON output for debugging
* Loading indicator for backend cold start handling

---

##  Important Note (Render Cold Start)

The backend is hosted on Render (free tier).
If inactive, the server may sleep.

 First request may take **30–60 seconds** to respond.

---

##  Sample Test Cases

### Valid Tree

```
A->B, A->C, B->D
```

### Cycle Detection

```
X->Y, Y->Z, Z->X
```

### Duplicate Edges

```
A->B, A->B, A->B
```

### Invalid Inputs

```
hello, 1->2, A->
```



---

##  Project Structure

```
bfhl-project/
│── backend/
│   ├── server.js
│   ├── utils/
│   ├── package.json
│
│── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
```

---

##  Key Highlights

* Efficient graph construction and traversal
* Robust edge-case handling
* Clean separation of backend and frontend
* Deployed and production-accessible solution


