# 🛡️ Kristallball Military System

## 🗄️ Database Table Structure

<table>
  <thead>
    <tr>
      <th align="left">Column Name</th>
      <th align="left">Type</th>
      <th align="left">Constraint</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>id</code></td>
      <td>SERIAL</td>
      <td>PRIMARY KEY</td>
    </tr>
    <tr>
      <td><code>name</code></td>
      <td>VARCHAR(100)</td>
      <td>NOT NULL</td>
    </tr>
    <tr>
      <td><code>base_id</code></td>
      <td>INT</td>
      <td>FOREIGN KEY</td>
    </tr>
  </tbody>
</table>

... continue with other text ...