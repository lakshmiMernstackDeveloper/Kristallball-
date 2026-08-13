🛡️ Kristallball Military Asset Management System

Kristallball is an enterprise-grade tracking platform designed for real-time visibility of critical military hardware across global sectors. It ensures transactional integrity, role-based security, and a forensic audit trail.

🔗 Live System Links

Command Interface (Frontend): View Live Site

Command API (Backend): View API Status

📉 Data Relationship Diagram (ERD)

This diagram illustrates how assets, bases, and personnel are interconnected.
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
🗄️ Database Architecture (PostgreSQL)
<h3>1. Table: bases</h3>
<p>Stores physical deployment locations.</p>
<table width="100%">
<tr bgcolor="#f1f5f9">
<th align="left">Column Name</th>
<th align="left">Data Type</th>
<th align="left">Constraint / Connection</th>
</tr>
<tr>
<td><b>id</b></td>
<td>SERIAL</td>
<td>PRIMARY KEY</td>
</tr>
<tr>
<td><b>name</b></td>
<td>VARCHAR(100)</td>
<td>NOT NULL (e.g., Arctic Watch Outpost)</td>
</tr>
<tr>
<td><b>location</b></td>
<td>VARCHAR(150)</td>
<td>NOT NULL (e.g., Norway)</td>
</tr>
</table>
<h3>2. Table: users</h3>
<p>Authorized personnel and security clearances (RBAC).</p>
<table width="100%">
<tr bgcolor="#f1f5f9">
<th align="left">Column Name</th>
<th align="left">Data Type</th>
<th align="left">Constraint / Connection</th>
</tr>
<tr>
<td><b>id</b></td>
<td>SERIAL</td>
<td>PRIMARY KEY</td>
</tr>
<tr>
<td><b>username</b></td>
<td>VARCHAR(50)</td>
<td>UNIQUE, NOT NULL</td>
</tr>
<tr>
<td><b>password_hash</b></td>
<td>VARCHAR(255)</td>
<td>NOT NULL (Bcrypt Hashed)</td>
</tr>
<tr>
<td><b>role</b></td>
<td>VARCHAR(30)</td>
<td>CHECK: ADMIN, BASE_COMMANDER, LOGISTICS_OFFICER</td>
</tr>
<tr>
<td><b>base_id</b></td>
<td>INT</td>
<td>FOREIGN KEY -> <b>bases(id)</b></td>
</tr>
</table>
<h3>3. Table: equipment_types</h3>
<p>Master catalog of trackable assets.</p>
<table width="100%">
<tr bgcolor="#f1f5f9">
<th align="left">Column Name</th>
<th align="left">Data Type</th>
<th align="left">Constraint / Connection</th>
</tr>
<tr>
<td><b>id</b></td>
<td>SERIAL</td>
<td>PRIMARY KEY</td>
</tr>
<tr>
<td><b>name</b></td>
<td>VARCHAR(100)</td>
<td>e.g., M1 Abrams Tank, JLTV Humvee</td>
</tr>
<tr>
<td><b>category</b></td>
<td>VARCHAR(50)</td>
<td>WEAPON, VEHICLE, AMMUNITION</td>
</tr>
</table>
<h3>4. Table: purchases</h3>
<p>New acquisitions entering the military ecosystem.</p>
<table width="100%">
<tr bgcolor="#f1f5f9">
<th align="left">Column Name</th>
<th align="left">Data Type</th>
<th align="left">Constraint / Connection</th>
</tr>
<tr>
<td><b>id</b></td>
<td>SERIAL</td>
<td>PRIMARY KEY</td>
</tr>
<tr>
<td><b>base_id</b></td>
<td>INT</td>
<td>FOREIGN KEY -> <b>bases(id)</b></td>
</tr>
<tr>
<td><b>equipment_type_id</b></td>
<td>INT</td>
<td>FOREIGN KEY -> <b>equipment_types(id)</b></td>
</tr>
<tr>
<td><b>quantity</b></td>
<td>INT</td>
<td>NOT NULL (Must be > 0)</td>
</tr>
<tr>
<td><b>created_at</b></td>
<td>TIMESTAMP</td>
<td>DEFAULT CURRENT_TIMESTAMP</td>
</tr>
</table>
<h3>5. Table: transfers</h3>
<p>Inter-base movements (Atomic Transactions).</p>
<table width="100%">
<tr bgcolor="#f1f5f9">
<th align="left">Column Name</th>
<th align="left">Data Type</th>
<th align="left">Constraint / Connection</th>
</tr>
<tr>
<td><b>id</b></td>
<td>SERIAL</td>
<td>PRIMARY KEY</td>
</tr>
<tr>
<td><b>source_base_id</b></td>
<td>INT</td>
<td>FOREIGN KEY -> <b>bases(id)</b> (Decrease)</td>
</tr>
<tr>
<td><b>destination_base_id</b></td>
<td>INT</td>
<td>FOREIGN KEY -> <b>bases(id)</b> (Increase)</td>
</tr>
<tr>
<td><b>equipment_type_id</b></td>
<td>INT</td>
<td>FOREIGN KEY -> <b>equipment_types(id)</b></td>
</tr>
<tr>
<td><b>quantity</b></td>
<td>INT</td>
<td>Atomic shift between locations</td>
</tr>
<tr>
<td><b>initiated_by</b></td>
<td>INT</td>
<td>FOREIGN KEY -> <b>users(id)</b></td>
</tr>
</table>
<h3>6. Table: expenditures</h3>
<p>Logs assets consumed or lost in the field.</p>
<table width="100%">
<tr bgcolor="#f1f5f9">
<th align="left">Column Name</th>
<th align="left">Data Type</th>
<th align="left">Constraint / Connection</th>
</tr>
<tr>
<td><b>id</b></td>
<td>SERIAL</td>
<td>PRIMARY KEY</td>
</tr>
<tr>
<td><b>base_id</b></td>
<td>INT</td>
<td>FOREIGN KEY -> <b>bases(id)</b></td>
</tr>
<tr>
<td><b>equipment_type_id</b></td>
<td>INT</td>
<td>FOREIGN KEY -> <b>equipment_types(id)</b></td>
</tr>
<tr>
<td><b>quantity</b></td>
<td>INT</td>
<td>Removed from Closing Balance</td>
</tr>
<tr>
<td><b>details</b></td>
<td>TEXT</td>
<td>Combat reason or Mission report</td>
</tr>
</table>
📈 Inventory Logic
The backend applies the following mathematical formula for real-time reporting:
Net Movement = Purchases + Transfers In - Transfers Out
Closing Balance = Opening Balance + Net Movement - Expended
