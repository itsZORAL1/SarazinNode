# Project Chronos: Temporal Archive and Containment System

Project Chronos is a high-security administrative and forensics framework designed for the specialized task of monitoring temporal instabilities and managing the physical sequestration of artifacts discovered outside their native era vectors. The system is predicated on the **Law of Temporal Continuity**, treating history as a series of rigid **Era Vectors**.

When objects are displaced across time, they create **Temporal Anomalies** that threaten the stability of the Prime Timeline. This application operationalizes a professional **Capture-and-Contain cycle**: anomalies are detected via spatial-temporal coordinates, field agents are deployed to stabilize the rip, and recovered items are manually ingested into a high-security grid.

The system features **Vertical Filtering** (Clearance levels 1-5) and **Horizontal RBAC** (Scope-based permissions), ensuring that only authorized personnel can access high-threat items or perform timeline-altering operations.

---

## 🌌 1. System Concept and Forensic Logic

The core philosophy of Project Chronos is centered on the prevention of causal paradoxes. The application functions as a digital "Evidence Locker" for history itself.

### The Capture-and-Contain Loop
* **Detection (The Rip):** Temporal disturbances identified by location and signature. A signature includes the danger level (1-5) and the probability of timeline collapse.
* **Stabilization (The Mission):** Field agents assigned to anomalies. The mission state machine handles deployment, investigation, and finalization.
* **Manual Ingestion (Registry):** Because temporal objects are highly volatile, ingestion is not automated. A human operator must manually finalize a mission by entering the artifact's details, serial number, and assigned vault.
* **Containment (The Grid):** Items assigned to specialized Vaults (e.g., Lead-Lined Quantum Shielding) based on danger level. Low-clearance agents are strictly prohibited from viewing the contents of high-security vaults.

---

## 📂 2. Technical Architecture Details

The project follows a modular **Service-Oriented Architecture (SOA)** to decouple business logic from API routing and security enforcement.

### Directory Structure
* **controllers/**: Handles the request-response lifecycle (e.g., `auth.js`, `mission.js`, `artifact.js`).
* **middlewares/**: Security enforcement layers (e.g., `auth.js`, `perm.js`, `biometric.js`).
* **models/**: PostgreSQL database schemas using Sequelize ORM (14 distinct models including `User`, `Artifact`, `Session`, `AuditLog`).
* **routes/**: Centralized endpoint definitions for the Agency API.
* **services/**: The scientific logic layer (e.g., `missionService.js`, `paradoxService.js`).
* **migrations/**: Historical database schema evolution scripts.
* **seeders/**: Mandatory initialization scripts for Agency protocols.

### Core Controllers and Services
* **auth.js**: Manages identity verification and stateful session persistence.
* **missionService.js**: Orchestrates transition logic; closing anomalies while generating Artifact records upon mission finalization.
* **artifactService.js**: Implements Dual-Vector Searching, allowing indexing by item name or origin era.
* **containmentService.js**: Evaluates vault stability, load capacity, and threat-level compatibility.
* **paradoxService.js**: Calculates real-time collapse probability based on active disturbances.

### Security Middlewares
* **CheckAuth**: Validates JWT integrity and performs a Stateful Session Check against the database.
* **CheckPermission**: The RBAC gatekeeper verifying both the user's Scope and Clearance Level.
* **BiometricCheck**: A high-security override simulation requiring a simulated retina hash in the request header.

---

## ⚛️ 3. Frontend Implementation (React & Axios)

The frontend is a specialized **"HUD" (Heads-Up Display)** for Agency Personnel.

### Interface HUD Elements
* **Dashboard.js**: Real-time overview of agency metrics, including the Timeline Stability Index and active threat counts.
* **Missions.js**: Command center for logging rips and report-to-recovery workflows.
* **Archive.js**: Searchable registry of all secured artifacts with encrypted data decryption simulations.
* **Vaults.js**: Visual representation of the Containment Grid, managing unit integrity and load capacity.
* **AdminPanel.js**: Restricted interface for personnel enlistment and immutable audit log review.

### Hostname Resolver and Port Management
Designed specifically for GitHub Codespaces and cloud development environments where standard localhost routing is restricted.

* **package.json Proxy**: The `proxy` field in `insa-react/package.json` is set to a development URL. This can be manually updated by the tester to match their specific environment if required for static routing.
* **Dynamic Hostname Resolver (api.js)**: To ensure cross-environment compatibility, the system includes a Hostname Resolver in `src/api.js`. It automatically detects the active browser URL and swaps the frontend port (3001) for the backend port (3000). This bridges requests regardless of the unique GitHub workspace URL provided to the auditor.

---

## 🚀 4. Deployment & Initialization Protocol


### 0. Environment Configuration (.env)
Before initialization, ensure a `.env` file exists in the root directory with the following mandatory parameters for the auditor:

```text
PORT=3000
JWT_SECRET=secret
DB_NAME=db_name
DB_USER=user
DB_PASS=password
DB_HOST=127.0.0.1
```

### 1. Persistent Database Layer (Docker)
Launch the sequestered PostgreSQL instance. Use environment variables to keep actual credentials secure.

```bash
docker run -d \
  --name agency-db \
  -e POSTGRES_PASSWORD=${DATABASE_PASSWORD} \
  -e POSTGRES_DB=${DATABASE_NAME} \
  -v chronos_data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:latest
```

### 2. Dependency & Schema Initialization

```bash
# Synchronize all project dependencies
npm install

# Deploy 14 layers of database schema migrations
npx sequelize-cli db:migrate
```

### 3. Establishing Administrative Access (O5-Council)
Initial Administrative (O5-Council) credentials and the RBAC hierarchy must be established via the Seeding protocol. This account is required to register new agents via the UI Admin Panel.

```bash
# Inject RBAC Scopes, Departments, and the Master Admin account
npx sequelize-cli db:seed:all
```

### 4. Operational Protocols & Testing

#### 1. Launching Services

* **Backend API** : ```node server.js``` (Default Port 3000)
* **Frontend UI** : ```cd insa-react && npm start``` (Default Port 3001)

#### 2. Accessing the Database CLI
To manually inspect the Registry or Personnel tables:

```bash docker exec -it agency-db psql -U postgres -d ${DATABASE_NAME} ```

#### 3. Security Boundary Tests (Auditor Reference)

| Test Objective         | Request Method           | Expected Security Result                             |
| :--------------------- | :----------------------- | :--------------------------------------------------- |
| **BOLA Protection**    | `GET /api/artifacts/:id` | 403 Forbidden if artifact level > agent clearance    |
| **BFLA Protection**    | `DELETE /api/users/:id`  | 403 Access Denied for non-Admin accounts             |
| **Session Revocation** | `POST /api/logout`       | Token invalidated immediately via DB purge           |
| **Port Swapping**      | Load Port 3001           | `api.js` automatically bridges requests to Port 3000 |


### 5. Current Development Status

Project Chronos is undergoing continuous expansion. While the core Capture-and-Contain loop is operational, the architecture is designed to accommodate additional modular services. I am aware that further services could be integrated to enhance system utility.




 




