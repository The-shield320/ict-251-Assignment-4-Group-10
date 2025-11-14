// Record Management System
class RecordManager {
    constructor() {
        this.records = JSON.parse(localStorage.getItem('volunteerRecords')) || [];
        this.currentEditId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderRecords();
    }

    bindEvents() {
        // Form submission
        document.getElementById('recordForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveRecord();
        });

        // Cancel button
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.cancelEdit();
        });
    }

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Save record (create or update)
    saveRecord() {
        const formData = new FormData(document.getElementById('recordForm'));
        const record = {
            id: this.currentEditId || this.generateId(),
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            program: formData.get('program'),
            joinDate: formData.get('joinDate'),
            status: formData.get('status'),
            notes: formData.get('notes')
        };

        if (this.currentEditId) {
            // Update existing record
            const index = this.records.findIndex(r => r.id === this.currentEditId);
            if (index !== -1) {
                this.records[index] = record;
                this.showMessage('Record updated successfully!', 'success');
            }
        } else {
            // Add new record
            this.records.push(record);
            this.showMessage('Record added successfully!', 'success');
        }

        this.saveToStorage();
        this.renderRecords();
        this.resetForm();
    }

    // Edit record
    editRecord(id) {
        const record = this.records.find(r => r.id === id);
        if (record) {
            // Populate form
            document.getElementById('recordId').value = record.id;
            document.getElementById('name').value = record.name;
            document.getElementById('email').value = record.email;
            document.getElementById('phone').value = record.phone;
            document.getElementById('program').value = record.program;
            document.getElementById('joinDate').value = record.joinDate;
            document.getElementById('status').value = record.status;
            document.getElementById('notes').value = record.notes || '';

            // Update UI for edit mode
            this.currentEditId = id;
            document.getElementById('form-title').textContent = 'Edit Volunteer';
            document.getElementById('submitBtn').textContent = 'Update Volunteer';
            document.getElementById('cancelBtn').classList.remove('hidden');

            // Scroll to form
            document.getElementById('records').scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Delete record
    deleteRecord(id) {
        if (confirm('Are you sure you want to delete this record?')) {
            this.records = this.records.filter(r => r.id !== id);
            this.saveToStorage();
            this.renderRecords();
            this.showMessage('Record deleted successfully!', 'success');
            
            // If deleting the record being edited, reset form
            if (this.currentEditId === id) {
                this.cancelEdit();
            }
        }
    }

    // Cancel edit mode
    cancelEdit() {
        this.currentEditId = null;
        this.resetForm();
    }

    // Reset form to initial state
    resetForm() {
        document.getElementById('recordForm').reset();
        document.getElementById('recordId').value = '';
        document.getElementById('form-title').textContent = 'Add New Volunteer';
        document.getElementById('submitBtn').textContent = 'Add Volunteer';
        document.getElementById('cancelBtn').classList.add('hidden');
        this.currentEditId = null;
    }

    // Render records table
    renderRecords() {
        const tbody = document.getElementById('recordsBody');
        tbody.innerHTML = '';

        if (this.records.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; color: #666;">
                        No records found. Add your first volunteer above.
                    </td>
                </tr>
            `;
            return;
        }

        this.records.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${this.escapeHtml(record.name)}</td>
                <td>${this.escapeHtml(record.email)}</td>
                <td>${this.escapeHtml(record.phone)}</td>
                <td>${this.escapeHtml(record.program)}</td>
                <td>${this.formatDate(record.joinDate)}</td>
                <td><span class="status-badge status-${record.status.toLowerCase()}">${record.status}</span></td>
                <td class="actions">
                    <button class="edit" onclick="recordManager.editRecord('${record.id}')">Edit</button>
                    <button class="delete" onclick="recordManager.deleteRecord('${record.id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Save to localStorage
    saveToStorage() {
        localStorage.setItem('volunteerRecords', JSON.stringify(this.records));
    }

    // Show message
    showMessage(message, type) {
        const messageEl = document.getElementById('message');
        messageEl.textContent = message;
        messageEl.className = message ${type};
        messageEl.classList.remove('hidden');

        // Auto-hide after 3 seconds
        setTimeout(() => {
            messageEl.classList.add('hidden');
        }, 3000);
    }

    // Utility function to escape HTML
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Format date for display
    formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
}

// Initialize the record manager when the page loads
let recordManager;

document.addEventListener('DOMContentLoaded', () => {
    recordManager = new RecordManager();
    
    // Set today's date as default for join date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('joinDate').value = today;
});