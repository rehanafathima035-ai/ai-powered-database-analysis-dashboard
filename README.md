# 🤖 AI-Powered Database Analysis Dashboard

An AI-powered database analysis platform that allows users to interact with database information using **natural-language queries**.

Instead of manually writing SQL queries, users can ask questions in plain English and receive meaningful database insights through an **interactive React dashboard** powered by a backend API and AI services.

---

## 🚀 Features

### 💬 Natural Language Database Queries

* Ask questions about database information using everyday language.
* Eliminates the need to manually write SQL for common analysis tasks.
* Provides an intuitive conversational interface for database exploration.

### 🤖 AI-Assisted Database Analysis

* Uses AI services to interpret natural-language queries.
* Processes user requests and generates database-related insights.
* Connects AI functionality with backend database operations.

### 📊 Interactive Dashboard

* Provides a visual interface for exploring database information.
* Displays analysis results through a user-friendly dashboard.
* Includes dedicated components for chat, dashboard views, and navigation.

### 🔌 Backend API

* Dedicated backend service for processing frontend requests.
* Connects the React frontend with AI and database services.
* Provides API endpoints for database analysis and conversational queries.

### ⚡ Modern React Frontend

* Built using React and Vite.
* Component-based architecture for maintainability.
* Responsive interface for interacting with the database analysis system.

### 🔐 Environment-Based Configuration

* API keys and sensitive configuration are managed through environment variables.
* Sensitive credentials are not hard-coded into the source code.
* Helps keep configuration separate from application logic.

### 🧪 AI Service Testing

* Includes tests for core AI-service functionality.
* Helps verify that the AI integration behaves as expected.

---

## 🏗️ Project Architecture

```text
AI-Powered Database Analysis Dashboard
│
├── AI Powered Database Analysis Dashboard Documentation.docx
│
└── v360/
    │
    ├── backend/
    │   ├── app/
    │   │   ├── api/
    │   │   │   ├── endpoints/
    │   │   │   │   └── chat.py
    │   │   │   └── router.py
    │   │   │
    │   │   └── services/
    │   │       ├── ai_service.py
    │   │       └── vanna_service.py
    │   │
    │   ├── main.py
    │   ├── requirements.txt
    │   └── run_backend.ps1
    │
    ├── frontend/
    │   ├── src/
    │   │   ├── components/
    │   │   │   ├── ChatPanel.jsx
    │   │   │   ├── Dashboard.jsx
    │   │   │   └── Sidebar.jsx
    │   │   │
    │   │   ├── App.jsx
    │   │   ├── App.css
    │   │   ├── index.css
    │   │   └── main.jsx
    │   │
    │   ├── package.json
    │   └── vite.config.js
    │
    ├── test_ai_service.py
    └── run_all.ps1
```

---

## 🧩 System Workflow

```text
User
  │
  │ Natural-Language Query
  ▼
React Frontend
  │
  │ API Request
  ▼
Backend API
  │
  ├──────────────► AI Service
  │                    │
  │                    ▼
  │              Query Interpretation
  │
  └──────────────► Database Services
                       │
                       ▼
                 Database Analysis
                       │
                       ▼
                  Backend Response
                       │
                       ▼
                Interactive Dashboard
```

---

## 🛠️ Tech Stack

### Frontend

* **React**
* **Vite**
* **JavaScript**
* **HTML/CSS**

### Backend

* **Python**
* **FastAPI**
* **REST API**

### AI & Database

* AI-powered query analysis
* Database connectivity
* AI service integration
* Vanna service integration

### Development & Testing

* **Git & GitHub**
* **PowerShell**
* **Python testing**

---

## 📁 Folder Structure

### `backend/`

Contains the backend API and services responsible for processing requests and communicating with AI/database components.

#### `app/api/`

Contains the API routing layer.

* `router.py` — Central API router.
* `endpoints/chat.py` — Handles chat/query-related API requests.

#### `app/services/`

Contains service-layer logic.

* `ai_service.py` — Handles AI-related functionality.
* `vanna_service.py` — Handles the Vanna-related database/AI service integration.

#### `main.py`

Main entry point for the backend application.

#### `requirements.txt`

Contains the Python dependencies required to run the backend.

#### `run_backend.ps1`

PowerShell script for starting the backend service.

---

### `frontend/`

Contains the React-based user interface.

#### `src/components/`

Reusable application components:

* `ChatPanel.jsx` — Natural-language query interface.
* `Dashboard.jsx` — Displays database analysis information.
* `Sidebar.jsx` — Provides application navigation.

#### `App.jsx`

Main React application component.

#### `App.css`

Application-level styling.

#### `index.css`

Global CSS styles.

#### `main.jsx`

React application entry point.

#### `package.json`

Contains frontend dependencies and project scripts.

#### `vite.config.js`

Vite configuration file.

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <your-repository-folder>
```

---

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd v360/backend
```

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

---

### 3. Configure Environment Variables

Create a `.env` file in the appropriate backend location and add the required configuration values.

Example:

```env
API_KEY=your_api_key
DATABASE_URL=your_database_configuration
```

> **Important:** Never commit API keys, passwords, or other sensitive credentials to GitHub.

Add sensitive files such as `.env` to `.gitignore`.

---

### 4. Start the Backend

From the backend directory, run the provided PowerShell script:

```powershell
.\run_backend.ps1
```

Alternatively, start the FastAPI application using the project's configured entry point.

---

### 5. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd v360/frontend
```

Install the Node.js dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The terminal will display the local development URL for the frontend.

---

## 🧪 Running Tests

The project includes AI-service testing through:

```text
test_ai_service.py
```

Run the test file using Python:

```bash
python test_ai_service.py
```

---

## 💡 Example Use Cases

The platform can be used for questions such as:

```text
"How many customers are in the database?"

"Show me the total sales."

"Which products have the highest sales?"

"What is the average order value?"

"Give me a summary of the available database information."
```

The user interacts with the system through natural language rather than manually constructing SQL queries for common analysis tasks.

---

## 🔄 Application Flow

1. The user enters a natural-language question through the React interface.
2. The frontend sends the request to the backend API.
3. The backend processes the request.
4. AI services assist in interpreting the user's query.
5. Database-related processing is performed through the configured services.
6. The backend returns the resulting information.
7. The frontend presents the result through the interactive dashboard.

---

## 🔐 Security Considerations

This project uses environment-based configuration for sensitive information.

Recommended practices:

* Do not commit `.env` files.
* Do not hard-code API keys.
* Do not expose database credentials in frontend code.
* Use environment variables for sensitive configuration.
* Keep development credentials separate from production credentials.

Example `.gitignore` entries:

```gitignore
.env
venv/
__pycache__/
node_modules/
*.pyc
```

---

## 📌 Project Highlights

* Natural-language interaction with database information
* AI-assisted database analysis
* React-based interactive dashboard
* FastAPI backend architecture
* Separation of frontend, API, and service layers
* Environment-based configuration
* AI-service testing
* Component-based frontend structure

---

## 🎯 Project Objective

The primary objective of this project is to make **database analysis more accessible through natural-language interaction**.

Instead of requiring users to understand SQL syntax and database structures, the platform provides a conversational interface that allows users to ask questions in everyday language and explore database information through an interactive dashboard.

---

## 🔮 Future Scope

Potential extensions for the platform include:

* Advanced data visualization
* Automatic chart generation from queries
* More sophisticated natural-language-to-SQL capabilities
* Query history and saved analyses
* Role-based access control
* Support for additional database systems
* Improved AI-driven analytical summaries
* Exporting analysis results

---

## 👩‍💻 Author

**Rihana Fathima M**

Information Technology Undergraduate
Rajalakshmi Engineering College, Chennai

---

## ⭐ Project

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.
