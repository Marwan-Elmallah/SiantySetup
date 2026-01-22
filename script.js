// Global variables
let parsedPrivileges = []; // Stores ONLY objects with linked: true
let allPrivileges = []; // Stores ALL objects from JSON (for reference)
let groupedPrivileges = {};
let customRoles = {}; // Stores all custom roles
let selectedRoleId = null;
let nextRoleId = 1;

// Template role configurations
const roleTemplates = {
    
};

// Set today's date as default for creation date
// document.addEventListener('DOMContentLoaded', function() {
//     const today = new Date().toISOString().split('T')[0];
//     document.getElementById('creation-date').value = today;
//     document.getElementById('setup-date').value = today;
    
//     // Set a default customer name for demo
//     document.getElementById('customer-name').value = "Global Tech Solutions Inc.";
    
//     // Initialize with at least one user row
//     addUserRow();
    
//     // Load sample JSON data for demonstration
//     loadSampleJSON();
    
//     // Create a couple of default roles for demo
//     createDemoRoles();
// });

function loadSampleJSON() {
    const sampleJSON = [
        {
            "id": 400,
            "active": true,
            "erole": "ROLE_BAY_VIEW",
            "parentId": null,
            "accessLimit": 0.000000,
            "linked": true
        },
        {
            "id": 401,
            "active": true,
            "erole": "ROLE_BAY_CREATE",
            "parentId": 400,
            "accessLimit": 0.000000,
            "linked": true
        },
        {
            "id": 402,
            "active": true,
            "erole": "ROLE_BAY_UPDATE",
            "parentId": 400,
            "accessLimit": 0.000000,
            "linked": true
        },
        {
            "id": 403,
            "active": true,
            "erole": "ROLE_BAY_ARCHIVE",
            "parentId": 400,
            "accessLimit": 0.000000,
            "linked": true
        },
        {
            "id": 404,
            "active": true,
            "erole": "ROLE_BAY_ACTIVE",
            "parentId": 400,
            "accessLimit": 0.000000,
            "linked": true
        },
        {
            "id": 700,
            "active": true,
            "erole": "ROLE_CHECKLIST_VIEW",
            "parentId": null,
            "accessLimit": 0.000000,
            "linked": true
        },
        {
            "id": 701,
            "active": true,
            "erole": "ROLE_CHECKLIST_CREATE",
            "parentId": 700,
            "accessLimit": 0.000000,
            "linked": true
        },
        {
            "id": 702,
            "active": true,
            "erole": "ROLE_CHECKLIST_UPDATE",
            "parentId": 700,
            "accessLimit": 0.000000,
            "linked": true
        },
        {
            "id": 100,
            "active": true,
            "erole": "ROLE_ACCOUNT_VIEW",
            "parentId": null,
            "accessLimit": 0,
            "linked": false
        },
        {
            "id": 101,
            "active": true,
            "erole": "ROLE_ACCOUNT_CREATE",
            "parentId": 100,
            "accessLimit": 0,
            "linked": false
        },
        {
            "id": 4300,
            "active": true,
            "erole": "ROLE_JOBCARD_VIEW",
            "parentId": null,
            "accessLimit": 0.000000,
            "linked": true
        },
        {
            "id": 4301,
            "active": true,
            "erole": "ROLE_JOBCARD_CREATE",
            "parentId": 4300,
            "accessLimit": 0.000000,
            "linked": true
        },
        {
            "id": 4302,
            "active": true,
            "erole": "ROLE_JOBCARD_UPDATE",
            "parentId": 4300,
            "accessLimit": 0.000000,
            "linked": true
        },
        {
            "id": 4303,
            "active": true,
            "erole": "ROLE_JOBCARD_ARCHIVE",
            "parentId": 4300,
            "accessLimit": 0.000000,
            "linked": true
        },
        {
            "id": 1300,
            "active": true,
            "erole": "ROLE_INVOICE_VIEW",
            "parentId": null,
            "accessLimit": 0,
            "linked": false
        },
        {
            "id": 1301,
            "active": true,
            "erole": "ROLE_INVOICE_CREATE",
            "parentId": 1300,
            "accessLimit": 0,
            "linked": false
        },
        {
            "id": 1400,
            "active": true,
            "erole": "ROLE_ITEM_VIEW",
            "parentId": null,
            "accessLimit": 0.000000,
            "linked": true
        },
        {
            "id": 1401,
            "active": true,
            "erole": "ROLE_ITEM_CREATE",
            "parentId": 1400,
            "accessLimit": 0.000000,
            "linked": true
        },
        {
            "id": 1402,
            "active": true,
            "erole": "ROLE_ITEM_UPDATE",
            "parentId": 1400,
            "accessLimit": 0.000000,
            "linked": true
        },
        {
            "id": 1403,
            "active": true,
            "erole": "ROLE_ITEM_ARCHIVE",
            "parentId": 1400,
            "accessLimit": 0.000000,
            "linked": true
        }
    ];
    
    document.getElementById('json-input').value = JSON.stringify(sampleJSON, null, 2);
}

function createDemoRoles() {
    // Create a couple of demo roles
    createNewRoleWithData('Service Manager', 'Manages service operations and technicians');
    createNewRoleWithData('Finance Controller', 'Controls financial operations and approvals');
}

function parseJSON() {
    const jsonInput = document.getElementById('json-input').value;
    const parseSummary = document.getElementById('parse-summary');
    const filterInfo = document.getElementById('filter-info');
    
    try {
        const data = JSON.parse(jsonInput);
        
        if (!Array.isArray(data)) {
            throw new Error("JSON data should be an array");
        }
        
        // Store ALL objects for reference
        allPrivileges = data;
        
        // Filter objects where linked is true - CRITICAL FIX
        // Handle both string "true" and boolean true
        parsedPrivileges = data.filter(item => {
            // Check if linked property exists and is truthy
            if (item.linked === undefined) {
                return false; // No linked property
            }
            
            // Handle boolean true, string "true", or number 1
            return item.linked === true || 
                   item.linked === "true" || 
                   item.linked === 1;
        });
        
        console.log("Total objects:", data.length);
        console.log("Linked objects found:", parsedPrivileges.length);
        console.log("Sample parsed privilege:", parsedPrivileges[0]);
        
        // Group privileges by category
        groupedPrivileges = {};
        
        parsedPrivileges.forEach(item => {
            const erole = item.erole;
            const categoryMatch = erole.match(/ROLE_([^_]+)_/);
            const category = categoryMatch ? categoryMatch[1] : "OTHER";
            
            if (!groupedPrivileges[category]) {
                groupedPrivileges[category] = [];
            }
            
            const displayName = formatPrivilegeName(erole);
            groupedPrivileges[category].push({
                id: item.id,
                erole: erole,
                displayName: displayName,
                parentId: item.parentId,
                accessLimit: item.accessLimit,
                linked: item.linked, // Keep track of linked status
                selected: false
            });
        });
        
        // Update parse summary
        document.getElementById('total-objects').textContent = data.length;
        document.getElementById('linked-count').textContent = parsedPrivileges.length;
        document.getElementById('total-privileges').textContent = parsedPrivileges.length;
        parseSummary.style.display = 'block';
        filterInfo.style.display = 'block';
        
        // Render available privileges
        renderAvailablePrivileges();
        
        // Show detailed parse results
        const linkedFalseCount = data.length - parsedPrivileges.length;
        alert(`JSON parsed successfully!\n\nTotal objects: ${data.length}\nLinked (true): ${parsedPrivileges.length}\nNot linked (false): ${linkedFalseCount}\n\nOnly linked objects are available for assignment.`);
        
    } catch (error) {
        alert(`Error parsing JSON: ${error.message}\n\nPlease ensure you pasted valid JSON format.`);
        console.error("JSON parsing error:", error);
    }
}

function createNewRole() {
    const roleName = document.getElementById('new-role-name').value.trim();
    const roleDescription = document.getElementById('new-role-description').value.trim();
    
    if (!roleName) {
        alert("Please enter a role name");
        return;
    }
    
    // Check if role already exists
    const existingRole = Object.values(customRoles).find(role => role.name.toLowerCase() === roleName.toLowerCase());
    if (existingRole) {
        alert(`Role "${roleName}" already exists. Please use a different name.`);
        return;
    }
    
    createNewRoleWithData(roleName, roleDescription);
    clearRoleForm();
}

function createNewRoleWithData(roleName, roleDescription) {
    const roleId = `role_${nextRoleId++}`;
    
    customRoles[roleId] = {
        id: roleId,
        name: roleName,
        description: roleDescription || "No description provided",
        privileges: [],
        createdDate: new Date().toISOString().split('T')[0]
    };
    
    renderRoles();
    syncRolesToUserDropdown();
    
    // Auto-select the newly created role
    selectRole(roleId);
    
    return roleId;
}

function createTemplateRole(templateKey) {
    const template = roleTemplates[templateKey];
    if (!template) return;
    
    // Check if a role with this name already exists
    let roleName = template.name;
    let counter = 1;
    
    while (Object.values(customRoles).some(role => role.name === roleName)) {
        roleName = `${template.name} ${counter}`;
        counter++;
    }
    
    const roleId = createNewRoleWithData(roleName, template.description);
    
    // If we have parsed privileges (linked: true only), apply the template filter
    if (parsedPrivileges.length > 0 && template.filter) {
        // Reset privileges first
        customRoles[roleId].privileges = [];
        
        parsedPrivileges.forEach(privilege => {
            if (template.filter(privilege)) {
                customRoles[roleId].privileges.push({
                    id: privilege.id,
                    erole: privilege.erole,
                    displayName: formatPrivilegeName(privilege.erole),
                    parentId: privilege.parentId,
                    accessLimit: privilege.accessLimit,
                    linked: privilege.linked,
                    assignedDate: new Date().toISOString().split('T')[0]
                });
            }
        });
        
        renderRoles();
        renderAvailablePrivileges();
        alert(`Created "${roleName}" with ${customRoles[roleId].privileges.length} privileges based on the template.`);
    } else {
        alert(`Created "${roleName}" template role. Assign privileges after parsing JSON data.`);
    }
}

function clearRoleForm() {
    document.getElementById('new-role-name').value = '';
    document.getElementById('new-role-description').value = '';
}

function renderRoles() {
    const container = document.getElementById('roles-container');
    
    if (Object.keys(customRoles).length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i>👥</i>
                <p>No custom roles created yet.</p>
                <p>Use the form above to create your first role.</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    Object.values(customRoles).forEach(role => {
        const isSelected = selectedRoleId === role.id;
        const isExpanded = isSelected;
        
        html += `
            <div class="role-card ${isSelected ? 'selected-role' : ''}" id="role-${role.id}">
                <div class="role-header" onclick="toggleRole('${role.id}')">
                    <div class="role-info">
                        <div class="role-name">${role.name}</div>
                        <div class="role-description">${role.description}</div>
                    </div>
                    <div class="role-count">${role.privileges.length}</div>
                </div>
                <div class="role-privileges" id="privileges-${role.id}" style="display: ${isExpanded ? 'block' : 'none'}">
                    ${role.privileges.length === 0 ? 
                        '<p><em>No privileges assigned yet.</em></p>' : 
                        role.privileges.map(p => `
                            <div class="privilege-item">
                                <div class="privilege-name">${p.displayName} ${p.linked !== undefined ? `<small style="color: #4caf50;">(linked)</small>` : ''}</div>
                                <div class="privilege-actions">
                                    <button class="btn btn-danger" onclick="removePrivilege('${role.id}', '${p.erole}')" style="padding: 3px 8px; font-size: 12px;">Remove</button>
                                </div>
                            </div>
                        `).join('')
                    }
                    <div style="margin-top: 10px; display: flex; justify-content: space-between;">
                        <button class="btn btn-success" onclick="selectRole('${role.id}')" style="padding: 5px 10px; font-size: 12px;">
                            ${isSelected ? '✓ Selected' : 'Select to Assign'}
                        </button>
                        <div>
                            <button class="btn" onclick="editRole('${role.id}')" style="padding: 5px 10px; font-size: 12px;">Edit</button>
                            <button class="btn btn-danger" onclick="deleteRole('${role.id}')" style="padding: 5px 10px; font-size: 12px;">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function renderAvailablePrivileges() {
    const container = document.getElementById('available-privileges');
    
    if (Object.keys(groupedPrivileges).length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i>🔒</i>
                <p>No linked privileges parsed yet.</p>
                <p>Paste JSON data and click "Parse JSON" to extract privileges with "linked: true".</p>
            </div>
        `;
        return;
    }
    
    if (!selectedRoleId) {
        container.innerHTML = `
            <div class="empty-state">
                <i>👈</i>
                <p>Select a role from the left panel to assign privileges.</p>
                <p>Click on a role to expand it, then click "Select to Assign".</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    // Sort categories alphabetically
    const sortedCategories = Object.keys(groupedPrivileges).sort();
    
    sortedCategories.forEach(category => {
        html += `<div class="privilege-category">`;
        html += `<div class="category-header">${category} (${groupedPrivileges[category].length}) <small style="color: #4caf50;">- linked only</small></div>`;
        
        // Sort privileges by display name
        groupedPrivileges[category].sort((a, b) => a.displayName.localeCompare(b.displayName));
        
        groupedPrivileges[category].forEach(privilege => {
            const isAssigned = isPrivilegeAssignedToRole(selectedRoleId, privilege.erole);
            
            html += `
                <div>
                    <input type="checkbox" 
                           id="priv-${privilege.id}" 
                           class="privilege-checkbox" 
                           data-erole="${privilege.erole}"
                           ${isAssigned ? 'disabled' : ''}>
                    <label for="priv-${privilege.id}" class="privilege-label">
                        ${privilege.displayName}
                        ${isAssigned ? `<small style="color: #666; margin-left: 10px;">(Already assigned)</small>` : ''}
                    </label>
                </div>
            `;
        });
        
        html += `</div>`;
    });
    
    container.innerHTML = html;
}

function toggleRole(roleId) {
    const privilegeDiv = document.getElementById(`privileges-${roleId}`);
    const isExpanded = privilegeDiv.style.display === 'block';
    
    // Close all other role privilege sections
    document.querySelectorAll('.role-privileges').forEach(div => {
        div.style.display = 'none';
    });
    
    // Toggle current role
    privilegeDiv.style.display = isExpanded ? 'none' : 'block';
    
    // If we're expanding, select the role
    if (!isExpanded) {
        selectRole(roleId);
    }
}

function selectRole(roleId) {
    selectedRoleId = roleId;
    const role = customRoles[roleId];
    
    if (!role) return;
    
    // Update UI to show selected role
    document.querySelectorAll('.role-card').forEach(card => {
        card.classList.remove('selected-role');
    });
    
    const roleCard = document.getElementById(`role-${roleId}`);
    if (roleCard) {
        roleCard.classList.add('selected-role');
    }
    
    // Show selected role info
    const roleInfoDiv = document.getElementById('selected-role-info');
    roleInfoDiv.style.display = 'block';
    document.getElementById('current-role-name').textContent = role.name;
    document.getElementById('current-role-description').textContent = role.description;
    
    // Show the privileges for the selected role
    document.querySelectorAll('.role-privileges').forEach(div => {
        div.style.display = 'none';
    });
    
    const privilegeDiv = document.getElementById(`privileges-${roleId}`);
    if (privilegeDiv) {
        privilegeDiv.style.display = 'block';
    }
    
    // Update available privileges display
    renderAvailablePrivileges();
}

function assignSelectedPrivileges() {
    if (!selectedRoleId) {
        alert("Please select a role first by clicking on it.");
        return;
    }
    
    const checkboxes = document.querySelectorAll('.privilege-checkbox:not(:disabled)');
    let assignedCount = 0;
    
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const erole = checkbox.getAttribute('data-erole');
            const privilege = findPrivilegeByErole(erole);
            
            if (privilege && !isPrivilegeAssignedToRole(selectedRoleId, erole)) {
                customRoles[selectedRoleId].privileges.push({
                    ...privilege,
                    assignedDate: new Date().toISOString().split('T')[0]
                });
                assignedCount++;
            }
            
            checkbox.checked = false;
        }
    });
    
    if (assignedCount > 0) {
        renderRoles();
        renderAvailablePrivileges();
        alert(`Assigned ${assignedCount} privileges to ${customRoles[selectedRoleId].name}.`);
    } else {
        alert("No privileges selected or all selected privileges are already assigned.");
    }
}

function assignAllPrivilegesToRole() {
    if (!selectedRoleId) {
        alert("Please select a role first.");
        return;
    }
    
    if (!parsedPrivileges.length) {
        alert("Please parse JSON data first.");
        return;
    }
    
    if (confirm(`Assign ALL ${parsedPrivileges.length} linked privileges to ${customRoles[selectedRoleId].name}?`)) {
        customRoles[selectedRoleId].privileges = [];
        
        parsedPrivileges.forEach(privilege => {
            customRoles[selectedRoleId].privileges.push({
                id: privilege.id,
                erole: privilege.erole,
                displayName: formatPrivilegeName(privilege.erole),
                parentId: privilege.parentId,
                accessLimit: privilege.accessLimit,
                linked: privilege.linked,
                assignedDate: new Date().toISOString().split('T')[0]
            });
        });
        
        renderRoles();
        renderAvailablePrivileges();
        alert(`Assigned all ${parsedPrivileges.length} linked privileges to ${customRoles[selectedRoleId].name}.`);
    }
}

function assignViewOnlyPrivileges() {
    if (!selectedRoleId) {
        alert("Please select a role first.");
        return;
    }
    
    if (!parsedPrivileges.length) {
        alert("Please parse JSON data first.");
        return;
    }
    
    customRoles[selectedRoleId].privileges = customRoles[selectedRoleId].privileges.filter(p => 
        !p.erole.includes("_VIEW") && !p.erole.endsWith("_VIEW")
    );
    
    parsedPrivileges.forEach(privilege => {
        if (privilege.erole.includes("_VIEW") || privilege.erole.endsWith("_VIEW")) {
            if (!isPrivilegeAssignedToRole(selectedRoleId, privilege.erole)) {
                customRoles[selectedRoleId].privileges.push({
                    id: privilege.id,
                    erole: privilege.erole,
                    displayName: formatPrivilegeName(privilege.erole),
                    parentId: privilege.parentId,
                    accessLimit: privilege.accessLimit,
                    linked: privilege.linked,
                    assignedDate: new Date().toISOString().split('T')[0]
                });
            }
        }
    });
    
    renderRoles();
    renderAvailablePrivileges();
    alert(`Assigned view-only privileges to ${customRoles[selectedRoleId].name}.`);
}

function assignCreateUpdatePrivileges() {
    if (!selectedRoleId) {
        alert("Please select a role first.");
        return;
    }
    
    if (!parsedPrivileges.length) {
        alert("Please parse JSON data first.");
        return;
    }
    
    customRoles[selectedRoleId].privileges = customRoles[selectedRoleId].privileges.filter(p => 
        !p.erole.includes("_CREATE") && !p.erole.includes("_UPDATE")
    );
    
    parsedPrivileges.forEach(privilege => {
        if (privilege.erole.includes("_CREATE") || privilege.erole.includes("_UPDATE")) {
            if (!isPrivilegeAssignedToRole(selectedRoleId, privilege.erole)) {
                customRoles[selectedRoleId].privileges.push({
                    id: privilege.id,
                    erole: privilege.erole,
                    displayName: formatPrivilegeName(privilege.erole),
                    parentId: privilege.parentId,
                    accessLimit: privilege.accessLimit,
                    linked: privilege.linked,
                    assignedDate: new Date().toISOString().split('T')[0]
                });
            }
        }
    });
    
    renderRoles();
    renderAvailablePrivileges();
    alert(`Assigned create/update privileges to ${customRoles[selectedRoleId].name}.`);
}

function assignNoDeletePrivileges() {
    if (!selectedRoleId) {
        alert("Please select a role first.");
        return;
    }
    
    if (!parsedPrivileges.length) {
        alert("Please parse JSON data first.");
        return;
    }
    
    customRoles[selectedRoleId].privileges = [];
    
    parsedPrivileges.forEach(privilege => {
        const erole = privilege.erole;
        const excludedActions = ["DELETE", "ARCHIVE", "UNASSIGN"];
        const isExcluded = excludedActions.some(action => erole.includes(`_${action}`));
        
        if (!isExcluded) {
            customRoles[selectedRoleId].privileges.push({
                id: privilege.id,
                erole: erole,
                displayName: formatPrivilegeName(erole),
                parentId: privilege.parentId,
                accessLimit: privilege.accessLimit,
                linked: privilege.linked,
                assignedDate: new Date().toISOString().split('T')[0]
            });
        }
    });
    
    renderRoles();
    renderAvailablePrivileges();
    alert(`Assigned privileges (excluding delete/archive) to ${customRoles[selectedRoleId].name}.`);
}

function clearRolePrivileges() {
    if (!selectedRoleId) {
        alert("Please select a role first.");
        return;
    }
    
    if (confirm(`Clear all privileges from ${customRoles[selectedRoleId].name}?`)) {
        customRoles[selectedRoleId].privileges = [];
        renderRoles();
        renderAvailablePrivileges();
        alert(`Cleared all privileges from ${customRoles[selectedRoleId].name}.`);
    }
}

function removePrivilege(roleId, erole) {
    const roleName = customRoles[roleId].name;
    if (confirm(`Remove this privilege from ${roleName}?`)) {
        customRoles[roleId].privileges = customRoles[roleId].privileges.filter(p => p.erole !== erole);
        renderRoles();
        renderAvailablePrivileges();
    }
}

function editRole(roleId) {
    const role = customRoles[roleId];
    const newName = prompt("Edit Role Name:", role.name);
    if (newName && newName.trim() !== role.name) {
        // Check if name already exists
        const existingRole = Object.values(customRoles).find(r => 
            r.name.toLowerCase() === newName.trim().toLowerCase() && r.id !== roleId
        );
        if (existingRole) {
            alert(`Role "${newName}" already exists.`);
            return;
        }
        role.name = newName.trim();
    }
    
    const newDescription = prompt("Edit Role Description:", role.description);
    if (newDescription !== null) {
        role.description = newDescription.trim();
    }
    
    renderRoles();
    syncRolesToUserDropdown();
    
    // Update selected role info if this is the selected role
    if (selectedRoleId === roleId) {
        document.getElementById('current-role-name').textContent = role.name;
        document.getElementById('current-role-description').textContent = role.description;
    }
}

function deleteRole(roleId) {
    const roleName = customRoles[roleId].name;
    
    if (!confirm(`Delete role "${roleName}" and all its privilege assignments?`)) {
        return;
    }
    
    // Check if this role is assigned to any users
    let usersWithRole = 0;
    document.querySelectorAll('#users-table-body tr').forEach(row => {
        const select = row.querySelector('select');
        if (select && select.value === roleName) {
            usersWithRole++;
        }
    });
    
    if (usersWithRole > 0) {
        if (!confirm(`This role is assigned to ${usersWithRole} user(s). Deleting it will remove the role assignment from those users. Continue?`)) {
            return;
        }
        
        // Remove role assignment from users
        document.querySelectorAll('#users-table-body tr').forEach(row => {
            const select = row.querySelector('select');
            if (select && select.value === roleName) {
                select.value = '';
            }
        });
    }
    
    delete customRoles[roleId];
    
    // If we deleted the selected role, clear selection
    if (selectedRoleId === roleId) {
        selectedRoleId = null;
        document.getElementById('selected-role-info').style.display = 'none';
    }
    
    renderRoles();
    renderAvailablePrivileges();
    syncRolesToUserDropdown();
    alert(`Deleted role "${roleName}".`);
}

function selectAllPrivileges() {
    document.querySelectorAll('.privilege-checkbox:not(:disabled)').forEach(checkbox => {
        checkbox.checked = true;
    });
}

function deselectAllPrivileges() {
    document.querySelectorAll('.privilege-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
}

function isPrivilegeAssignedToRole(roleId, erole) {
    return customRoles[roleId].privileges.some(p => p.erole === erole);
}

function findPrivilegeByErole(erole) {
    for (const category in groupedPrivileges) {
        const privilege = groupedPrivileges[category].find(p => p.erole === erole);
        if (privilege) return privilege;
    }
    return null;
}

function formatPrivilegeName(erole) {
    return erole
        .replace('ROLE_', '')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
}

function addUserRow() {
    const tableBody = document.getElementById('users-table-body');
    const rowId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const row = document.createElement('tr');
    row.id = rowId;
    row.innerHTML = `
        <td><input type="text" placeholder="Full Name" style="width: 100%; border: 1px solid #ccc; padding: 5px;"></td>
        <td><input type="email" placeholder="Email" style="width: 100%; border: 1px solid #ccc; padding: 5px;"></td>
        <td>
            <select style="width: 100%; border: 1px solid #ccc; padding: 5px;" onchange="updateUserRole('${rowId}', this.value)">
                <option value="">-- Select Role --</option>
                ${Object.values(customRoles).map(role => 
                    `<option value="${role.name}">${role.name}</option>`
                ).join('')}
            </select>
        </td>
        <td><input type="text" placeholder="Department" style="width: 100%; border: 1px solid #ccc; padding: 5px;"></td>
        <td>
            <button class="btn btn-danger" onclick="deleteUserRow('${rowId}')" style="padding: 5px 10px; font-size: 12px;">Delete</button>
        </td>
    `;
    
    tableBody.appendChild(row);
}

function deleteUserRow(rowId) {
    const row = document.getElementById(rowId);
    if (row && confirm("Delete this user?")) {
        row.remove();
    }
}

function updateUserRole(rowId, roleName) {
    // You can add additional logic here if needed
    console.log(`User ${rowId} assigned to role: ${roleName}`);
}

function syncRolesToUserDropdown() {
    const roleOptions = Object.values(customRoles).map(role => 
        `<option value="${role.name}">${role.name}</option>`
    ).join('');
    
    document.querySelectorAll('#users-table-body select').forEach(select => {
        const currentValue = select.value;
        select.innerHTML = `<option value="">-- Select Role --</option>${roleOptions}`;
        
        // Try to restore the previous selection if it still exists
        if (currentValue && roleOptions.includes(`value="${currentValue}"`)) {
            select.value = currentValue;
        }
    });
}

function printDocument() {
    window.print();
}

function exportToWord() {
    alert("In a real implementation, this would generate a .docx file with all custom roles and assigned privileges. For now, please use the Print function and select 'Save as PDF'.");
}

function saveAsDraft() {
    const formData = {
        customerName: document.getElementById('customer-name').value,
        contactPerson: document.getElementById('primary-contact').value,
        creationDate: document.getElementById('creation-date').value,
        status: document.getElementById('status').value,
        customRoles: customRoles,
        parsedPrivileges: parsedPrivileges,
        allPrivileges: allPrivileges,
        lastUpdated: new Date().toISOString()
    };
    
    // Save user data
    const users = [];
    document.querySelectorAll('#users-table-body tr').forEach(row => {
        const inputs = row.querySelectorAll('input, select');
        if (inputs.length >= 5) {
            users.push({
                name: inputs[0].value,
                username: inputs[1].value,
                email: inputs[2].value,
                role: inputs[3].value,
                department: inputs[4].value
            });
        }
    });
    
    formData.users = users;
    localStorage.setItem('setupDraft', JSON.stringify(formData));
    
    // Count total assigned privileges
    const totalAssigned = Object.values(customRoles).reduce((sum, role) => sum + role.privileges.length, 0);
    alert(`Draft saved locally. Includes ${Object.keys(customRoles).length} custom roles with ${totalAssigned} assigned privileges (linked only).`);
}

function saveAsHTML() {
    // Gather all data from new form fields
    const workshopName = document.getElementById('workshop-name').value || 'Workshop Name';
    const location = document.getElementById('location').value || 'Not specified';
    const customerAddress = document.getElementById('customer-address').value || 'Not specified';
    const customerPlan = document.getElementById('customer-plan').value || 'Not specified';
    const workshopType = document.getElementById('workshop-type').value || 'Not specified';
    const contactName = document.getElementById('contact-name').value || 'Not specified';
    const contactPhone = document.getElementById('contact-phone').value || 'Not specified';
    const contactEmail = document.getElementById('contact-email').value || 'Not specified';
    const numberOfUsers = document.getElementById('number-of-users').value || '0';
    const serviceStartDate = document.getElementById('service-start-date').value || 'Not specified';
    
    // For backward compatibility
    const customerName = workshopName; // Use workshopName as customerName
    const primaryContact = contactName; // Use contactName as primaryContact
    
    // Other existing fields
    const creationDate = document.getElementById('creation-date')?.value || new Date().toISOString().split('T')[0];
    const documentId = document.getElementById('doc-id')?.value || 'SETUP-001';
    const version = document.getElementById('version')?.value || '1.0';
    const engineerName = document.getElementById('engineer-name')?.value || 'Not specified';
    const engineerTitle = document.getElementById('engineer-title')?.value || 'Support Engineer';
    const setupDate = document.getElementById('setup-date')?.value || new Date().toISOString().split('T')[0];
    const approverName = document.getElementById('approver-name')?.value || 'Pending';
    const approverTitle = document.getElementById('approver-title')?.value || 'Customer Representative';
    const approvalDate = document.getElementById('approval-date')?.value || 'Pending';
    const workflowDescription = document.getElementById('workflow-description')?.value || 'Standard workflow will be provided.';
    const specialNotes = document.getElementById('special-notes')?.value || 'No special notes.';
    
    // Gather user data
    const users = [];
        document.querySelectorAll('#users-table-body tr').forEach(row => {
            const inputs = row.querySelectorAll('input, select');
            if (inputs.length >= 4) { // Changed from 5 to 4
                const name = inputs[0].value || 'Not specified';
                const email = inputs[1].value || 'Not specified';
                const role = inputs[2].value || 'Not assigned';
                const department = inputs[3].value || 'Not specified';
                
                if (name !== 'Not specified') {
                    users.push({ 
                        name, 
                        email, 
                        role, 
                        department 
                    });
                }
                console.log(users);
                
            }
        });
    
    // Generate the HTML content
    const htmlContent = generateCustomerHTML({
        // New fields
        workshopName,
        location,
        customerPlan,
        workshopType,
        contactName,
        contactPhone,
        contactEmail,
        numberOfUsers,
        
        // Legacy fields (for backward compatibility)
        customerName,
        customerAddress,
        primaryContact,
        
        // Other required fields
        serviceStartDate,
        creationDate,
        documentId,
        version,
        engineerName,
        engineerTitle,
        setupDate,
        approverName,
        approverTitle,
        approvalDate,
        workflowDescription,
        specialNotes,
        users,
        customRoles,
        parsedPrivileges
    });
    
    // Create and trigger download
    downloadHTML(htmlContent, `${documentId}_${workshopName.replace(/\s+/g, '_')}_Setup.html`);
}

function generateCustomerHTML(data) {
    const now = new Date();
    const generatedDate = now.toISOString().split('T')[0];
    const generatedTime = now.toLocaleTimeString();
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>System Setup Documentation - ${data.customerName}</title>
    <style>
        * {
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
}

body {
    padding: 30px;
    background-color: #f5f5f5;
    color: #333;
    line-height: 1.6;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
    min-height: 100vh;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    background-color: white;
    padding: 50px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    position: relative;
    overflow: hidden;
}

.container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(90deg, #2c5aa0 0%, #4a7bc8 50%, #2c5aa0 100%);
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 3px solid #2c5aa0;
    padding-bottom: 25px;
    margin-bottom: 40px;
    gap: 30px;
    position: relative;
}

.header::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 100px;
    height: 3px;
    background: linear-gradient(90deg, #2c5aa0, #4a7bc8);
}

.header-center {
    text-align: center;
    flex-grow: 1;
    padding: 0 20px;
}

.logo-container {
    flex-shrink: 0;
    min-width: 180px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.logo {
    max-height: 80px;
    max-width: 180px;
    width: auto;
    height: auto;
    object-fit: contain;
    transition: transform 0.3s ease;
}

.logo:hover {
    transform: scale(1.02);
}

.left-logo, .right-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(44, 90, 160, 0.1);
}

h1 {
    color: #2c5aa0;
    margin-bottom: 12px;
    font-size: 32px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    background: linear-gradient(90deg, #2c5aa0, #4a7bc8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.subtitle {
    color: #666;
    font-size: 17px;
    margin-bottom: 6px;
    font-weight: 500;
}

.document-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 25px;
    background: linear-gradient(135deg, #f0f7ff 0%, #e8f0fe 100%);
    padding: 25px;
    margin-bottom: 40px;
    border-left: 6px solid #2c5aa0;
    border-radius: 10px;
    box-shadow: 0 6px 20px rgba(44, 90, 160, 0.08);
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.info-label {
    font-weight: 700;
    color: #2c5aa0;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.info-label::before {
    content: "•";
    color: #4a7bc8;
    font-size: 20px;
}

.info-value {
    font-size: 16px;
    color: #222;
    padding: 10px 15px;
    background-color: white;
    border-radius: 8px;
    border: 2px solid #e8f0fe;
    font-weight: 500;
    transition: all 0.3s ease;
}

.info-value:hover {
    border-color: #2c5aa0;
    box-shadow: 0 4px 12px rgba(44, 90, 160, 0.1);
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 25px;
    background: linear-gradient(135deg, #f8fafd 0%, #f0f7ff 100%);
    padding: 30px;
    border-radius: 12px;
    margin-bottom: 30px;
    box-shadow: 0 6px 20px rgba(44, 90, 160, 0.08);
}

.info-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.info-value.plan-badge {
    display: inline-block;
    padding: 8px 20px;
    border-radius: 25px;
    font-weight: 700;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-width: 2px;
    transition: all 0.3s ease;
}

.plan-lite {
    background: linear-gradient(135deg, #e3f2fd, #bbdefb);
    color: #1565c0;
    border: 2px solid #90caf9;
}

.plan-standard {
    background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
    color: #2e7d32;
    border: 2px solid #a5d6a7;
}

.plan-reguler {
    background: linear-gradient(135deg, #fff3e0, #ffe0b2);
    color: #ef6c00;
    border: 2px solid #ffcc80;
}

.plan-pro {
    background: linear-gradient(135deg, #f3e5f5, #e1bee7);
    color: #7b1fa2;
    border: 2px solid #ce93d8;
}

.plan-enterprise {
    background: linear-gradient(135deg, #e8eaf6, #c5cae9);
    color: #303f9f;
    border: 2px solid #9fa8da;
}

.plan-custom {
    background: linear-gradient(135deg, #fff8e1, #ffecb3);
    color: #ff8f00;
    border: 2px solid #ffd54f;
}

.section {
    margin-bottom: 40px;
    padding-bottom: 30px;
    border-bottom: 2px solid #e8f0fe;
    position: relative;
}

.section:last-child {
    border-bottom: none;
}

.section-title {
    background: linear-gradient(90deg, #2c5aa0, #4a7bc8);
    color: white;
    padding: 15px 25px;
    margin-bottom: 25px;
    border-radius: 10px;
    font-size: 20px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 6px 20px rgba(44, 90, 160, 0.15);
}

.section-title::before {
    content: '▶';
    margin-right: 12px;
    font-size: 14px;
    opacity: 0.8;
}

table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin-bottom: 30px;
    font-size: 15px;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 6px 20px rgba(44, 90, 160, 0.08);
}

th {
    background: linear-gradient(135deg, #2c5aa0, #4a7bc8);
    color: white;
    text-align: left;
    padding: 18px 20px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: 14px;
    border: none;
    position: relative;
}

th:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0;
    top: 20%;
    height: 60%;
    width: 1px;
    background: rgba(255, 255, 255, 0.3);
}

td {
    padding: 16px 20px;
    border: none;
    border-bottom: 1px solid #e8f0fe;
    transition: background-color 0.3s ease;
}

tr {
    transition: background-color 0.3s ease;
}

tr:nth-child(even) {
    background-color: #f8fafd;
}

tr:hover {
    background-color: #e8f0fe;
}

tr:last-child td {
    border-bottom: none;
}

.role-section {
    margin-bottom: 35px;
    background: linear-gradient(135deg, #f8fafd 0%, #f0f7ff 100%);
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 6px 20px rgba(44, 90, 160, 0.08);
}

.role-header {
    background: white;
    padding: 20px;
    border-left: 6px solid #2c5aa0;
    margin-bottom: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(44, 90, 160, 0.1);
}

.role-name {
    font-weight: 700;
    color: #2c5aa0;
    font-size: 20px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 15px;
}

.role-description {
    font-size: 15px;
    color: #666;
    margin-bottom: 10px;
    line-height: 1.6;
}

.privilege-count {
    background: linear-gradient(135deg, #2c5aa0, #4a7bc8);
    color: white;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 700;
    display: inline-block;
    box-shadow: 0 4px 8px rgba(44, 90, 160, 0.2);
}

.privileges-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.privilege-category {
    background: white;
    padding: 20px;
    border-radius: 10px;
    border: 2px solid #e8f0fe;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(44, 90, 160, 0.08);
}

.privilege-category:hover {
    transform: translateY(-5px);
    border-color: #2c5aa0;
    box-shadow: 0 8px 25px rgba(44, 90, 160, 0.15);
}

.category-title {
    font-weight: 700;
    color: #2c5aa0;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 2px solid #e8f0fe;
    font-size: 17px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.category-title::before {
    content: '✓';
    background: #2c5aa0;
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
}

.privilege-list {
    list-style-type: none;
    padding-left: 0;
}

.privilege-item {
    padding: 10px 0;
    border-bottom: 1px dashed #e0e0e0;
    font-size: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.privilege-item::before {
    content: '→';
    color: #4a7bc8;
    font-size: 14px;
}

.privilege-item:last-child {
    border-bottom: none;
}

.signature-section {
    display: flex;
    justify-content: space-between;
    margin-top: 50px;
    flex-wrap: wrap;
    gap: 30px;
}

.signature-box {
    flex: 1;
    min-width: 300px;
    padding: 30px;
    border: 2px solid #e8f0fe;
    border-radius: 12px;
    background: linear-gradient(135deg, #f8fafd 0%, #f0f7ff 100%);
    box-shadow: 0 6px 20px rgba(44, 90, 160, 0.08);
    transition: all 0.3s ease;
}

.signature-box:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(44, 90, 160, 0.15);
}

.signature-title {
    font-weight: 700;
    color: #2c5aa0;
    margin-bottom: 20px;
    font-size: 18px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid #2c5aa0;
    padding-bottom: 10px;
}

.signature-line {
    border-top: 2px solid #333;
    margin-top: 80px;
    padding-top: 15px;
    text-align: center;
    font-style: italic;
    color: #666;
    font-weight: 500;
}

.footer {
    margin-top: 60px;
    text-align: center;
    font-size: 13px;
    color: #666;
    border-top: 2px solid #e8f0fe;
    padding-top: 25px;
    line-height: 1.8;
}

.empty-message {
    text-align: center;
    padding: 40px 20px;
    color: #666;
    font-style: italic;
    background: linear-gradient(135deg, #f8fafd 0%, #f0f7ff 100%);
    border-radius: 10px;
    border: 2px dashed #e8f0fe;
    font-size: 16px;
}

.workflow-box {
    background: linear-gradient(135deg, #f8fafd 0%, #f0f7ff 100%);
    padding: 25px;
    border-radius: 10px;
    border-left: 6px solid #4caf50;
    margin-top: 20px;
    white-space: pre-line;
    font-size: 15px;
    line-height: 1.8;
    box-shadow: 0 6px 20px rgba(44, 90, 160, 0.08);
}

.notes-box {
    background: linear-gradient(135deg, #fff8e1, #ffecb3);
    padding: 20px;
    border-radius: 10px;
    border-left: 6px solid #ffc107;
    margin-top: 20px;
    font-size: 15px;
    line-height: 1.8;
    box-shadow: 0 6px 20px rgba(255, 193, 7, 0.1);
}

.summary-box {
    background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
    padding: 20px;
    border-radius: 10px;
    margin: 30px 0;
    border-left: 6px solid #4caf50;
    font-size: 16px;
    font-weight: 500;
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.1);
}

.user-count-badge {
    background: linear-gradient(135deg, #2c5aa0, #4a7bc8);
    color: white;
    padding: 6px 16px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 14px;
    display: inline-block;
    box-shadow: 0 4px 8px rgba(44, 90, 160, 0.2);
}

/* Enhanced print styles */
@media print {
    body {
        background-color: white;
        padding: 0;
        font-size: 12pt;
    }
    
    .container {
        box-shadow: none;
        padding: 20px;
        max-width: 100%;
        margin: 0;
        border-radius: 0;
    }
    
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        page-break-after: avoid;
    }
    
    .logo {
        max-height: 60px;
        max-width: 150px;
    }
    
    .privileges-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .section {
        page-break-inside: avoid;
    }
    
    .signature-section {
        page-break-inside: avoid;
    }
    
    .footer {
        display: block;
        position: fixed;
        bottom: 0;
        width: 100%;
        background: white;
        border-top: 1px solid #ddd;
    }
}

/* Enhanced responsive styles */
@media (max-width: 1024px) {
    .container {
        padding: 30px;
    }
    
    .header {
        gap: 20px;
    }
    
    .logo-container {
        min-width: 150px;
    }
    
    .logo {
        max-height: 60px;
        max-width: 150px;
    }
    
    h1 {
        font-size: 28px;
    }
    
    .info-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    body {
        padding: 15px;
    }
    
    .container {
        padding: 20px;
    }
    
    .header {
        flex-direction: column;
        text-align: center;
        gap: 15px;
        padding-bottom: 20px;
    }
    
    .logo-container {
        width: 100%;
        min-width: auto;
    }
    
    .left-logo, .right-logo {
        width: 100%;
        max-width: 200px;
        margin: 0 auto;
    }
    
    .logo {
        max-height: 50px;
        max-width: 100%;
    }
    
    .header-center {
        order: 1;
        width: 100%;
    }
    
    h1 {
        font-size: 24px;
    }
    
    .document-info {
        grid-template-columns: 1fr;
        gap: 15px;
        padding: 20px;
    }
    
    .info-grid {
        grid-template-columns: 1fr;
        padding: 20px;
    }
    
    .section {
        margin-bottom: 30px;
        padding-bottom: 20px;
    }
    
    .section-title {
        padding: 12px 20px;
        font-size: 18px;
    }
    
    .privileges-grid {
        grid-template-columns: 1fr;
    }
    
    .signature-section {
        flex-direction: column;
        gap: 20px;
    }
    
    .signature-box {
        min-width: 100%;
    }
    
    table {
        font-size: 13px;
    }
    
    th, td {
        padding: 12px 15px;
    }
}

@media (min-width: 769px) and (max-width: 1024px) {
    .logo-container {
        min-width: 140px;
    }
    
    .logo {
        max-height: 55px;
        max-width: 140px;
    }
    
    .info-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* Smooth animations */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.section {
    animation: fadeIn 0.6s ease-out;
}

.section:nth-child(odd) {
    animation-delay: 0.1s;
}

.section:nth-child(even) {
    animation-delay: 0.2s;
}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <!-- Left side logo -->
            <div class="logo-container left-logo">
                <img src="https://bayanatss.com/wp-content/uploads/2024/12/bayanat-logo-alpha-1.png" alt="Bayanat Smart Systems" class="logo">
            </div>
            
            <!-- Center content -->
            <div class="header-center">
                <h1>SYSTEM SETUP DOCUMENTATION</h1>
                <div class="subtitle">Access Control and User Configuration</div>
                <div class="subtitle">Prepared for: ${data.customerName || data.workshopName || 'Customer'}</div>
            </div>
            
            <!-- Right side logo -->
            <div class="logo-container right-logo">
                <img src="https://sianty.com/wp-content/uploads/2024/02/sainty-logo-one.png" alt="Sianty" class="logo">
            </div>
        </div>
        
        <div class="document-info">
            <div class="info-item">
                <div class="info-label">Document ID:</div>
                <div class="info-value">${data.documentId || 'N/A'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Version:</div>
                <div class="info-value">${data.version || '1.0'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Creation Date:</div>
                <div class="info-value">${data.creationDate || generatedDate}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Service Start Date:</div>
                <div class="info-value">${data.serviceStartDate || 'Not specified'}</div>
            </div>
        </div>
        
        <div class="section">
            <div class="section-title">1. CUSTOMER INFORMATION</div>
            
            <div class="info-grid">
                <div class="info-group">
                    <div class="info-label">Workshop Name:</div>
                    <div class="info-value">${data.workshopName || data.customerName || 'Not specified'}</div>
                </div>
                
                <div class="info-group">
                    <div class="info-label">Location:</div>
                    <div class="info-value">${data.location || 'Not specified'}</div>
                </div>
                
                <div class="info-group">
                    <div class="info-label">Customer Plan:</div>
                    <div class="info-value plan-badge ${getPlanClass(data.customerPlan)}">
                        ${data.customerPlan || 'Not specified'}
                    </div>
                </div>
                
                <div class="info-group">
                    <div class="info-label">Workshop Type:</div>
                    <div class="info-value">${data.workshopType || 'Not specified'}</div>
                </div>
                
                <div class="info-group">
                    <div class="info-label">Contact Name:</div>
                    <div class="info-value">${data.contactName || data.primaryContact || 'Not specified'}</div>
                </div>
                
                <div class="info-group">
                    <div class="info-label">Contact Phone:</div>
                    <div class="info-value">${data.contactPhone || 'Not specified'}</div>
                </div>
                
                <div class="info-group">
                    <div class="info-label">Contact Email:</div>
                    <div class="info-value">${data.contactEmail || 'Not specified'}</div>
                </div>
                
                <div class="info-group">
                    <div class="info-label">Number of Users:</div>
                    <div class="info-value">
                        ${data.users ? data.users.length : data.numberOfUsers || '0'}
                    </div>
                </div>
            </div>
            
            ${data.customerAddress ? `
                <div style="margin-top: 15px;">
                    <div class="info-label">Full Address:</div>
                    <div class="info-value">${data.customerAddress}</div>
                </div>
            ` : ''}
        </div>
        
        <div class="section">
            <div class="section-title">2. USER ACCOUNTS ${getUserCountBadge(data)}</div>
            ${data.users && data.users.length > 0 ? `
                <table>
                    // In the generateCustomerHTML() function, in the users table section:
                    <thead>
                        <tr>
                            <th>Full Name</th>
                            <th>Email Address</th>
                            <th>Assigned Role</th>
                            <th>Department</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.users.map(user => `
                            <tr>
                                <td>${user.name}</td>
                                <td>${user.email}</td>
                                <td>${user.role}</td>
                                <td>${user.department}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            ` : `
                <div class="empty-message">
                    No users have been configured yet.
                </div>
            `}
        </div>
        
        <div class="section">
            <div class="section-title">3. ROLE CONFIGURATION AND PRIVILEGES</div>
            
            ${data.customRoles && Object.keys(data.customRoles).length > 0 ? `
                <div class="summary-box">
                    <strong>Summary:</strong> ${Object.keys(data.customRoles).length} custom roles configured with a total of ${Object.values(data.customRoles).reduce((sum, role) => sum + role.privileges.length, 0)} assigned privileges.
                </div>
                
                ${Object.values(data.customRoles).map(role => `
                    <div class="role-section">
                        <div class="role-header">
                            <div class="role-name">${role.name} <span class="privilege-count">${role.privileges.length} privileges</span></div>
                            <div class="role-description">${role.description}</div>
                        </div>
                        
                        ${role.privileges.length > 0 ? `
                            <div class="privileges-grid">
                                ${getGroupedPrivilegesHTML(role.privileges)}
                            </div>
                        ` : `
                            <div class="empty-message">
                                No privileges assigned to this role.
                            </div>
                        `}
                    </div>
                `).join('')}
            ` : `
                <div class="empty-message">
                    No custom roles have been created yet.
                </div>
            `}
        </div>
        
        <div class="section">
            <div class="section-title">4. SYSTEM WORKFLOW</div>
            <div class="workflow-box">
                ${data.workflowDescription || 'No workflow description provided.'}
            </div>
            
            ${data.specialNotes && data.specialNotes !== 'No special notes.' ? `
                <div style="margin-top: 20px;">
                    <div class="info-label">Special Instructions:</div>
                    <div class="notes-box">
                        ${data.specialNotes}
                    </div>
                </div>
            ` : ''}
        </div>
        
        <div class="section">
            <div class="section-title">5. APPROVAL AND SIGNATURES</div>
            
            <div class="signature-section">
                <div class="signature-box">
                    <div class="signature-title">TECH SUPPORT INC.</div>
                    <div style="margin-bottom: 10px;">
                        <div class="info-label">Engineer Name:</div>
                        <div class="info-value">${data.engineerName || 'Not specified'}</div>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <div class="info-label">Title:</div>
                        <div class="info-value">${data.engineerTitle || 'Not specified'}</div>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <div class="info-label">Date of Setup:</div>
                        <div class="info-value">${data.setupDate || 'Not specified'}</div>
                    </div>
                    <div class="signature-line">
                        Signature
                    </div>
                </div>
                
                <div class="signature-box">
                    <div class="signature-title">CUSTOMER APPROVAL</div>
                    <div style="margin-bottom: 10px;">
                        <div class="info-label">Approver Name:</div>
                        <div class="info-value">${data.approverName || 'Not specified'}</div>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <div class="info-label">Title:</div>
                        <div class="info-value">${data.approverTitle || 'Not specified'}</div>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <div class="info-label">Date of Approval:</div>
                        <div class="info-value">${data.approvalDate || 'Not specified'}</div>
                    </div>
                    <div class="signature-line">
                        Signature
                    </div>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>Document generated on ${generatedDate} at ${generatedTime}</p>
            <p>This document contains confidential information for ${data.customerName || data.workshopName || 'Customer'} only.</p>
            <p>For questions or modifications, please contact Tech Support Inc.</p>
        </div>
    </div>
    
    <script>
        // Auto-print on load if needed
        // window.onload = function() {
        //     setTimeout(function() {
        //         window.print();
        //     }, 1000);
        // }
    </script>
</body>
</html>`;
}

// Helper function for plan CSS classes
function getPlanClass(plan) {
    if (!plan) return '';
    const planLower = plan.toLowerCase();
    if (planLower.includes('lite')) return 'plan-lite';
    if (planLower.includes('standard')) return 'plan-standard';
    if (planLower.includes('reguler')) return 'plan-reguler';
    if (planLower.includes('pro')) return 'plan-pro';
    if (planLower.includes('enterprise')) return 'plan-enterprise';
    if (planLower.includes('custom')) return 'plan-custom';
    return '';
}

// Helper function for user count text
// Helper function for user count text
function getUserCountText(data) {
    // Check if we have actual users array
    if (data.users && data.users.length > 0) {
        const count = data.users.length;
        return count === 1 ? '1 user' : `${count} users`;
    }
    
    // Fall back to the number from form field
    if (!data.numberOfUsers) return 'No users';
    const count = parseInt(data.numberOfUsers);
    if (isNaN(count)) return 'Invalid count';
    return count === 1 ? '1 user' : `${count} users`;
}

// Helper function for user count badge in section title
// Helper function for user count badge in section title
function getUserCountBadge(data) {
    const userCount = data.users ? data.users.length : 0;
    if (userCount > 0) {
        return `<span class="user-count-badge">${userCount} ${userCount === 1 ? 'user' : 'users'}</span>`;
    }
    
    // Try to get from numberOfUsers field
    if (data.numberOfUsers) {
        const count = parseInt(data.numberOfUsers);
        if (!isNaN(count) && count > 0) {
            return `<span class="user-count-badge">${count} ${count === 1 ? 'user' : 'users'}</span>`;
        }
    }
    
    return '';
}

// Helper function for grouped privileges (assuming this exists in your code)
function getGroupedPrivilegesHTML(privileges) {
    // Group privileges by category
    const grouped = {};
    privileges.forEach(priv => {
        const category = priv.category || 'General';
        if (!grouped[category]) {
            grouped[category] = [];
        }
        grouped[category].push(priv);
    });
    
    // Generate HTML for each category
    return Object.entries(grouped).map(([category, items]) => `
        <div class="privilege-category">
            <div class="category-title">${category}</div>
            <ul class="privilege-list">
                ${items.map(item => `<li class="privilege-item">${item.name || item}</li>`).join('')}
            </ul>
        </div>
    `).join('');
}

// Helper function for grouped privileges (assuming this exists in your code)
function getGroupedPrivilegesHTML(privileges) {
    // Group privileges by category
    const grouped = {};
    privileges.forEach(priv => {
        const category = priv.category || 'General';
        if (!grouped[category]) {
            grouped[category] = [];
        }
        grouped[category].push(priv);
    });
    
    // Generate HTML for each category
    return Object.entries(grouped).map(([category, items]) => `
        <div class="privilege-category">
            <div class="category-title">${category}</div>
            <ul class="privilege-list">
                ${items.map(item => `<li class="privilege-item">${item.name || item}</li>`).join('')}
            </ul>
        </div>
    `).join('');
}

function getGroupedPrivilegesHTML(privileges) {
    // Group privileges by category
    const grouped = {};
    privileges.forEach(privilege => {
        const categoryMatch = privilege.erole.match(/ROLE_([^_]+)_/);
        const category = categoryMatch ? categoryMatch[1] : "OTHER";
        
        if (!grouped[category]) {
            grouped[category] = [];
        }
        
        grouped[category].push(privilege.displayName);
    });
    
    // Generate HTML for each category
    let html = '';
    Object.keys(grouped).sort().forEach(category => {
        html += `
            <div class="privilege-category">
                <div class="category-title">${category} (${grouped[category].length})</div>
                <ul class="privilege-list">
                    ${grouped[category].sort().map(privilege => `
                        <li class="privilege-item">${privilege}</li>
                    `).join('')}
                </ul>
            </div>
        `;
    });
    
    return html;
}

function downloadHTML(content, filename) {
    // Create a Blob with the HTML content
    const blob = new Blob([content], { type: 'text/html' });
    
    // Create a download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    
    // Append to the document, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert(`HTML document "${filename}" has been generated and downloaded. You can open it in any browser to view or print.`);
}

function clearForm() {
    if (confirm('Are you sure you want to clear all form data? This will delete all custom roles, users, and privileges.')) {
        // Clear all input fields
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (input.id === 'doc-id' || input.id === 'version') {
                return;
            }
            
            if (input.type === 'date') {
                if (input.id === 'creation-date' || input.id === 'setup-date') {
                    const today = new Date().toISOString().split('T')[0];
                    input.value = today;
                } else {
                    input.value = '';
                }
            } else if (input.type === 'select-one') {
                if (input.id === 'status') {
                    input.value = 'Draft';
                }
            } else {
                input.value = '';
            }
        });
        
        // Reset workflow description
        document.getElementById('workflow-description').value = `1. User login with provided credentials
2. Access dashboard with assigned modules
3. Perform daily tasks according to role permissions
4. Submit requests/approvals as needed
5. Generate reports based on access level
6. Logout after completing tasks`;
        
        // Reset privileges and roles
        parsedPrivileges = [];
        allPrivileges = [];
        groupedPrivileges = {};
        customRoles = {};
        selectedRoleId = null;
        nextRoleId = 1;
        
        // Clear users table
        document.getElementById('users-table-body').innerHTML = '';
        
        // Reset UI
        document.getElementById('parse-summary').style.display = 'none';
        document.getElementById('filter-info').style.display = 'none';
        document.getElementById('selected-role-info').style.display = 'none';
        document.getElementById('available-privileges').innerHTML = `
            <div class="empty-state">
                <i>🔒</i>
                <p>Privileges will appear here after parsing JSON data.</p>
                <p>Select a role to start assigning privileges.</p>
            </div>
        `;
        
        // Reinitialize
        renderRoles();
        loadSampleJSON();
        createDemoRoles();
        addUserRow();
    }
}

function collectFormData() {
    // Collect all form data
    const formData = {
        // New fields from your form
        workshopName: document.getElementById('workshop-name').value,
        location: document.getElementById('location').value,
        customerAddress: document.getElementById('customer-address').value,
        customerPlan: document.getElementById('customer-plan').value,
        workshopType: document.getElementById('workshop-type').value,
        contactName: document.getElementById('contact-name').value,
        contactPhone: document.getElementById('contact-phone').value,
        contactEmail: document.getElementById('contact-email').value,
        numberOfUsers: document.getElementById('number-of-users').value,
        serviceStartDate: document.getElementById('service-start-date').value,
        
        // For backward compatibility - map to old field names
        customerName: document.getElementById('workshop-name').value, // Use workshopName as customerName
        primaryContact: document.getElementById('contact-name').value, // Use contactName as primaryContact
        
        // Other existing fields (make sure you collect these too)
        documentId: generateDocumentId(), // Or get from form
        version: "1.0",
        creationDate: new Date().toISOString().split('T')[0],
        
        // Other sections data
        users: collectUsersData(),
        customRoles: collectRolesData(),
        workflowDescription: document.getElementById('workflow-description')?.value || '',
        specialNotes: document.getElementById('special-notes')?.value || '',
        engineerName: document.getElementById('engineer-name')?.value || '',
        engineerTitle: document.getElementById('engineer-title')?.value || '',
        setupDate: document.getElementById('setup-date')?.value || '',
        approverName: document.getElementById('approver-name')?.value || '',
        approverTitle: document.getElementById('approver-title')?.value || '',
        approvalDate: document.getElementById('approval-date')?.value || ''
    };
    
    return formData;
}

// Usage example
function generateDocument() {
    const formData = collectFormData();
    
    // Validate required fields
    if (!formData.workshopName) {
        alert('Please enter Workshop Name');
        return;
    }
    
    if (!formData.contactName) {
        alert('Please enter Contact Name');
        return;
    }
    
    if (!formData.contactEmail) {
        alert('Please enter Contact Email');
        return;
    }
    
    if (!formData.serviceStartDate) {
        alert('Please select Service Start Date');
        return;
    }
    
    // Generate the HTML document
    const htmlContent = generateCustomerHTML(formData);
    
    // Display or save the document
    displayGeneratedDocument(htmlContent);
}