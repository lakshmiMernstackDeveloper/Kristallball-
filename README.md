🛡️ Kristallball Military Asset Management System
Kristallball is an enterprise-grade tracking platform designed for real-time visibility of critical military hardware across global sectors. It ensures transactional integrity, role-based security (RBAC), and a forensic audit trail for full operational accountability.
<h2>🛰️ Tactical Command Modules (Live Access)</h2>
<p>The system is organized into secure operational zones accessible via the following command interfaces:</p>
<table width="100%">
<thead>
<tr bgcolor="#f1f5f9">
<th align="left" width="25%">Module Name</th>
<th align="left" width="45%">Operational Description</th>
<th align="left" width="30%">Direct Link</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>Secure Authentication</b></td>
<td>Gateway for encrypted session initialization via JWT clearance.</td>
<td><a href="https://kristallball-frontend-v0hy.onrender.com/login">Authorize Access</a></td>
</tr>
<tr>
<td><b>Strategic Dashboard</b></td>
<td>Real-time HUD for global readiness and inventory analytics.</td>
<td><a href="https://kristallball-frontend-v0hy.onrender.com/dashboard">Launch Console</a></td>
</tr>
<tr>
<td><b>Field Deployment</b></td>
<td>Interface for recording consumption and equipment expenditure.</td>
<td><a href="https://kristallball-frontend-v0hy.onrender.com/assignments">Open Registry</a></td>
</tr>
<tr>
<td><b>Asset Acquisition</b></td>
<td>Acquisition log for registering new inbound stock arrivals.</td>
<td><a href="https://kristallball-frontend-v0hy.onrender.com/purchases">Inbound Logistics</a></td>
</tr>
<tr>
<td><b>Logistics Hub</b></td>
<td>Auditable module for atomic asset movement between bases.</td>
<td><a href="https://kristallball-frontend-v0hy.onrender.com/transfers">Execute Transfer</a></td>
</tr>
</tbody>
</table>
<br>
📉 Data Relationship Diagram (ERD)
This diagram illustrates how assets, bases, and personnel are interconnected within the PostgreSQL engine.
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
<h2>🗄️ Database Architecture (Table Definitions)</h2>
<p>The system utilizes a relational PostgreSQL database to ensure <b>ACID compliance</b> across all global logistics transactions.</p>
<h3>1. Table: bases</h3>
<p>Storage for physical military installations.</p>
<table width="100%">
<tr bgcolor="#f1f5f9">
<th align="left">Column Name</th>
<th align="left">Data Type</th>
<th align="left">Description</th>
</tr>
<tr>
<td><b>id</b></td>
<td>SERIAL</td>
<td>Unique Identifier (Primary Key)</td>
</tr>
<tr>
<td><b>name</b></td>
<td>VARCHAR(100)</td>
<td>Installation Name (e.g., Ramstein Air Base)</td>
</tr>
<tr>
<td><b>location</b></td>
<td>VARCHAR(150)</td>
<td>Geographic Sector or Country</td>
</tr>
</table>
<h3>2. Table: users</h3>
<p>Authorized personnel with role-based security clearances.</p>
<table width="100%">
<tr bgcolor="#f1f5f9">
<th align="left">Column Name</th>
<th align="left">Data Type</th>
<th align="left">Description</th>
</tr>
<tr>
<td><b>id</b></td>
<td>SERIAL</td>
<td>Personnel Unique ID</td>
</tr>
<tr>
<td><b>username</b></td>
<td>VARCHAR(50)</td>
<td>Secure account identifier</td>
</tr>
<tr>
<td><b>role</b></td>
<td>VARCHAR(30)</td>
<td>ADMIN, BASE_COMMANDER, LOGISTICS_OFFICER</td>
</tr>
<tr>
<td><b>base_id</b></td>
<td>INT (FK)</td>
<td>Linked station (References <b>bases.id</b>)</td>
</tr>
</table>
<h3>3. Table: purchases</h3>
<p>Log of new inventory arrivals from the industrial supply chain.</p>
<table width="100%">
<tr bgcolor="#f1f5f9">
<th align="left">Column Name</th>
<th align="left">Data Type</th>
<th align="left">Description</th>
</tr>
<tr>
<td><b>id</b></td>
<td>SERIAL</td>
<td>Acquisition Serial Number</td>
</tr>
<tr>
<td><b>base_id</b></td>
<td>INT (FK)</td>
<td>Destination Base (Receiving Hub)</td>
</tr>
<tr>
<td><b>equipment_type_id</b></td>
<td>INT (FK)</td>
<td>References <b>equipment_types.id</b></td>
</tr>
<tr>
<td><b>quantity</b></td>
<td>INT</td>
<td>Number of units acquired</td>
</tr>
</table>
<h3>4. Table: transfers</h3>
<p>Transactional records for atomic stock movement across global bases.</p>
<table width="100%">
<tr bgcolor="#f1f5f9">
<th align="left">Column Name</th>
<th align="left">Data Type</th>
<th align="left">Description</th>
</tr>
<tr>
<td><b>id</b></td>
<td>SERIAL</td>
<td>Log Record Key</td>
</tr>
<tr>
<td><b>source_base_id</b></td>
<td>INT (FK)</td>
<td>Dispatch location</td>
</tr>
<tr>
<td><b>destination_base_id</b></td>
<td>INT (FK)</td>
<td>Receiving location</td>
</tr>
<tr>
<td><b>quantity</b></td>
<td>INT</td>
<td>Movement volume (Atomic Shift)</td>
</tr>
</table>
📈 Inventory Logic & Math Model
The system utilizes a complex SQL aggregation engine to ensure that readiness data is accurate to the second without data redundancy.
A. Net Movement Calculation
Net Movement = Purchases + Transfers In - Transfers Out
B. Closing Balance Calculation
Closing Balance = Opening Balance + Net Movement - Expended
