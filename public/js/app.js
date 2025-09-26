// public/js/app.js

document.addEventListener('DOMContentLoaded', function() {
    let allContacts = []; 

    const taskForm = document.getElementById('taskForm');
    const editForm = document.getElementById('editForm');
    const tasksList = document.getElementById('tasksList');
    const modal = document.getElementById('editModal');
    const closeModal = document.querySelector('.close');
    
    const searchInput = document.getElementById('searchInput');
    const sortNameAscBtn = document.getElementById('sortNameAsc');
    const sortNameDescBtn = document.getElementById('sortNameDesc');

    loadTasks();

    taskForm.addEventListener('submit', handleAddTask);
    editForm.addEventListener('submit', handleEditTask);
    closeModal.addEventListener('click', () => modal.style.display = 'none');

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    if (searchInput) {
        searchInput.addEventListener('input', searchContacts);
    }
    
    if (sortNameAscBtn) {
        sortNameAscBtn.addEventListener('click', () => sortContacts('asc'));
    }
    if (sortNameDescBtn) {
        sortNameDescBtn.addEventListener('click', () => sortContacts('desc'));
    }

    function searchContacts() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            displayTasks(allContacts); 
            return;
        }

        const filteredContacts = allContacts.filter(contact => {
            const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
            const phoneNumber = contact.phoneNumber.toLowerCase();
            const email = (contact.email || '').toLowerCase();

            return fullName.includes(searchTerm) || 
                   phoneNumber.includes(searchTerm) || 
                   email.includes(searchTerm);
        });

        displayTasks(filteredContacts);
    }

    function sortContacts(direction) {
        let contactsToDisplay = [...allContacts]; 
        
        if (searchInput.value.trim() !== '') {
            contactsToDisplay = contactsToDisplay.filter(contact => {
                const searchTerm = searchInput.value.toLowerCase().trim();
                const textToSearch = `${contact.firstName} ${contact.lastName} ${contact.phoneNumber} ${contact.email || ''}`.toLowerCase();
                return textToSearch.includes(searchTerm);
            });
        }
        
        contactsToDisplay.sort((a, b) => {
            const nameA = a.firstName.toLowerCase();
            const nameB = b.firstName.toLowerCase();
            
            if (nameA < nameB) {
                return direction === 'asc' ? -1 : 1;
            }
            if (nameA > nameB) {
                return direction === 'asc' ? 1 : -1;
            }

            const lastNameA = (a.lastName || '').toLowerCase();
            const lastNameB = (b.lastName || '').toLowerCase();

             if (lastNameA < lastNameB) {
                return direction === 'asc' ? -1 : 1;
            }
            if (lastNameA > lastNameB) {
                return direction === 'asc' ? 1 : -1;
            }
            
            return 0; 
        });
        
        displayTasks(contactsToDisplay);
    }

    function loadTasks() {
        const url = 'http://localhost:3000/api/contactos';
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                allContacts = data.contactos || [];
                displayTasks(allContacts); 
            })
            .catch(error => {
                console.error('Error al obtener contactos:', error);
                tasksList.innerHTML = '<p class="no-contacts">Error al cargar los contactos, servidor apagado, por favor contacte con el creador para solicitar que se encienda.</p>';
            });
    }

    function displayTasks(contacts) {
        tasksList.innerHTML = '';

        if (contacts.length === 0) {
            tasksList.innerHTML = '<p class="no-contacts">No hay contactos para mostrar.</p>';
            return;
        }

        contacts.forEach(contact => {
            const contactElement = createContactElement(contact);
            tasksList.appendChild(contactElement);
        });
    }

    function createContactElement(contact) {
        const contactItem = document.createElement('div');
        contactItem.className = 'contact-item';

        const contactInfo = document.createElement('div');
        contactInfo.className = 'contact-info';

        const nameTitle = document.createElement('div');
        nameTitle.className = 'contact-name-title';
        nameTitle.textContent = `${contact.firstName} ${contact.lastName}`;

        const number = document.createElement('div');
        number.className = 'contact-number';
        number.textContent = `Teléfono: ${contact.phoneNumber}`;

        const email = document.createElement('div');
        email.className = 'contact-email';
        email.textContent = `Email: ${contact.email || 'No proporcionado'}`; 
        
        const dates = document.createElement('div');
        dates.className = 'contact-dates';
        dates.textContent = `Creado: ${formatDate(contact.dateCreate)} | Actualizado: ${formatDate(contact.dateUpdate)}`;

        contactInfo.appendChild(nameTitle);
        contactInfo.appendChild(number);
        contactInfo.appendChild(email);

        const actions = document.createElement('div');
        actions.className = 'contact-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'btn-edit';
        editBtn.textContent = 'Editar';
        editBtn.addEventListener('click', () => openEditModal(contact));

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-delete';
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.addEventListener('click', () => deleteContact(contact._id)); 

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        contactItem.appendChild(contactInfo);
        contactItem.appendChild(actions);

        return contactItem;
    }

    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    function handleAddTask(e) {
        e.preventDefault();

        const firstNameValue = document.getElementById('firstName').value.trim();
        const lastNameValue = document.getElementById('lastName').value.trim();
        const numberValue = document.getElementById('phoneNumber').value.trim();
        const emailValue = document.getElementById('email').value.trim();       

        const newContact = {
            firstName: firstNameValue, 
            name: firstNameValue,      
            lastName: lastNameValue,
            phoneNumber: numberValue,
            email: emailValue,
        };

        fetch('http://localhost:3000/api/contactos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newContact)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.error || 'Error desconocido') });
            }
            return response.json();
        })
        .then(data => {
            loadTasks(); 
            taskForm.reset();
            alert(data.message);
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`Error al agregar contacto: ${error.message}`);
        });
    }
    
    function openEditModal(contact) {
        document.getElementById('editId').value = contact._id; 
        document.getElementById('editFirstName').value = contact.firstName;
        document.getElementById('editLastName').value = contact.lastName || '';
        document.getElementById('editNumber').value = contact.phoneNumber || '';
        document.getElementById('editEmail').value = contact.email || '';

        modal.style.display = 'block';
    }

    function handleEditTask(e) {
        e.preventDefault();

        const id = document.getElementById('editId').value;
        
        const firstNameValue = document.getElementById('editFirstName').value.trim();
        const lastNameValue = document.getElementById('editLastName').value.trim();
        const numberValue = document.getElementById('editNumber').value.trim();
        const emailValue = document.getElementById('editEmail').value.trim();

        const updatedContact = {
            firstName: firstNameValue, 
            name: firstNameValue,      
            lastName: lastNameValue,
            phoneNumber: numberValue,
            email: emailValue
        };

        fetch(`http://localhost:3000/api/contactos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedContact)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.error || 'Error desconocido') });
            }
            return response.json();
        })
        .then(data => {
            alert('Contacto actualizado exitosamente');
            modal.style.display = 'none';
            loadTasks();
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`Error al actualizar el contacto: ${error.message}`);
        });
    }

    function deleteContact(id) {
        if (!confirm('¿Estás seguro de que quieres eliminar este contacto?')) {
            return;
        }

        fetch(`http://localhost:3000/api/contactos/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.error || 'Error desconocido') });
            }
            return response.json();
        })
        .then(data => {
            alert('Contacto eliminado exitosamente');
            loadTasks();
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`Error al eliminar el contacto: ${error.message}`);
        });
    }
});
