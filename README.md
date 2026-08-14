🛡️ Kristallball Military Asset Management System
Kristallball is an enterprise-grade tracking platform designed for real-time visibility of critical military hardware across global sectors. It ensures transactional integrity, role-based security (RBAC), and a forensic audit trail for full operational accountability.
<h2>🛰️ Tactical Command Modules (Live Access)</h2>
<p>The system is organized into secure operational zones accessible via the following command interfaces:</p>
<table width="100%">
<thead>
<tr bgcolor="#f1f5f9">
<th align="left" width="20%">Module Name</th>
<th align="left" width="55%">Operational Purpose (Short Description)</th>
<th align="left" width="25%">Direct Command Link</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>Secure Gateway</b></td>
<td>Encrypted entry point for JWT-based personnel authentication.</td>
<td><a href="https://kristallball-frontend-v0hy.onrender.com/login">/login</a></td>
</tr>
<tr>
<td><b>Command HUD</b></td>
<td>Intelligence dashboard displaying real-time inventory math and readiness.</td>
<td><a href="https://kristallball-frontend-v0hy.onrender.com/dashboard">/dashboard</a></td>
</tr>
<tr>
<td><b>Asset Registry</b></td>
<td>Logging interface for personnel assignments and equipment expenditures.</td>
<td><a href="https://kristallball-frontend-v0hy.onrender.com/assignments">/assignments</a></td>
</tr>
<tr>
<td><b>Logistics Input</b></td>
<td>Procurement portal for registering new incoming industrial stock shipments.</td>
<td><a href="https://kristallball-frontend-v0hy.onrender.com/purchases">/purchases</a></td>
</tr>
<tr>
<td><b>Sector Transfer</b></td>
<td>Tactical module for executing atomic asset movement between global bases.</td>
<td><a href="https://kristallball-frontend-v0hy.onrender.com/transfers">/transfers</a></td>
</tr>
</tbody>
</table>
<br>
📉 Data Relationship Diagram (ERD)
This diagram illustrates the relational connections between assets, bases, and personnel managed within the PostgreSQL engine.
code
Mermaid
erDiagram
    BASES ||--o{ USERS : "houses"
    BASES ||--o{ PURCHASES : "receives"
    BASES ||--o{ TRANSFERS : "source/destination"
    BASES ||--o{ EXPENDITURES : "logs usage"
    
    EQUIPMENT_TYPES ||--o{ PURCHASES : "categorizes"
    EQUIPMENT_TYPES ||--o{ TRANSFERS : "identifies"
    EQUIPMENT_TYPES ||--o{ EXPENDITURES : "identifies"
    
    USERS ||--o{ TRANSFERS : "authorizes"
    USERS ||--o{ AUDIT_LOGS : "logs activity"
<br>
<h2>🗄️ Database Architecture (Table Definitions)</h2>
<p>The system utilizes a relational PostgreSQL database ensuring <b>ACID compliance</b> for all global logistics transactions.</p>
<h3>1. Table: bases</h3>
<table width="100%">
<tr bgcolor="#f8fafc">
<th align="left" width="30%">Column Name</th>
<th align="left" width="20%">Data Type</th>
<th align="left" width="50%">Description</th>
</tr>
<tr>
<td><code>id</code></td>
<td>SERIAL</td>
<td>Primary Key: Unique Deployment Identifier</td>
</tr>
<tr>
<td><code>name</code></td>
<td>VARCHAR(100)</td>
<td>Installation Title (e.g. Fort Liberty)</td>
</tr>
<tr>
<td><code>location</code></td>
<td>VARCHAR(150)</td>
<td>Physical Sector / Country coordinates</td>
</tr>
</table>
<h3>2. Table: users</h3>
<table width="100%">
<tr bgcolor="#f8fafc">
<th align="left" width="30%">Column Name</th>
<th align="left" width="20%">Data Type</th>
<th align="left" width="50%">Description</th>
</tr>
<tr>
<td><code>id</code></td>
<td>SERIAL</td>
<td>Primary Key: Personnel Unique ID</td>
</tr>
<tr>
<td><code>username</code></td>
<td>VARCHAR(50)</td>
<td>Credential Name (Unique constraint)</td>
</tr>
<tr>
<td><code>role</code></td>
<td>VARCHAR(30)</td>
<td>Clearance: ADMIN, COMMANDER, LOGISTICS</td>
</tr>
<tr>
<td><code>base_id</code></td>
<td>INT (FK)</td>
<td>Sector Assignment (Links to <b>bases.id</b>)</td>
</tr>
</table>
<h3>3. Table: purchases</h3>
<table width="100%">
<tr bgcolor="#f8fafc">
<th align="left" width="30%">Column Name</th>
<th align="left" width="20%">Data Type</th>
<th align="left" width="50%">Description</th>
</tr>
<tr>
<td><code>id</code></td>
<td>SERIAL</td>
<td>Primary Key: Acquisition ID</td>
</tr>
<tr>
<td><code>base_id</code></td>
<td>INT (FK)</td>
<td>Receiving installation ID</td>
</tr>
<tr>
<td><code>equipment_type_id</code></td>
<td>INT (FK)</td>
<td>Category ID from equipment master</td>
</tr>
<tr>
<td><code>quantity</code></td>
<td>INT</td>
<td>Inbound unit volume</td>
</tr>
</table>
<h3>4. Table: transfers</h3>
<table width="100%">
<tr bgcolor="#f8fafc">
<th align="left" width="30%">Column Name</th>
<th align="left" width="20%">Data Type</th>
<th align="left" width="50%">Description</th>
</tr>
<tr>
<td><code>id</code></td>
<td>SERIAL</td>
<td>Primary Key: Transfer Record ID</td>
</tr>
<tr>
<td><code>source_base_id</code></td>
<td>INT (FK)</td>
<td>Dispatching Installation</td>
</tr>
<tr>
<td><code>destination_base_id</code></td>
<td>INT (FK)</td>
<td>Arrival Installation</td>
</tr>
<tr>
<td><code>quantity</code></td>
<td>INT</td>
<td>Net movement units (Atomic Transaction)</td>
</tr>
</table>
<br>
📉 Inventory Logic & Math Model
<p>The backend utilizes real-time SQL aggregation to compute readiness levels dynamically without data duplication.</p>
<table width="100%">
<tr bgcolor="#f1f5f9">
<th align="left" width="25%">Formula Component</th>
<th align="left" width="75%">Mathematical Logic</th>
</tr>
<tr>
<td><b>Net Movement</b></td>
<td><code>Purchases + Transfers_In - Transfers_Out</code></td>
</tr>
<tr>
<td><b>Closing Balance</b></td>
<td><code>Opening_Balance + Net_Movement - Expended</code></td>
</tr>
</table>
<br>
🔐 Security & RBAC
<ul>
<li><b>Global Admin:</b> Full oversight of all bases and forensic audit log access.</li>
<li><b>Logistics Officer:</b> Authorization to manage cross-border transfers and new procurement logs.</li>
<li><b>Base Commander:</b> Access restricted to their assigned <code>base_id</code> via middleware isolation.</li>
</ul>
