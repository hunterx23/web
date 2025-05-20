// ✅ استبدل الرابط برابطك الحقيقي من موقع crudcrud.com
const API_URL = 'https://crudcrud.com/api/230006c4456a4450bae336727f88aa1b/educationalAppointments';

const form = document.getElementById('appointmentForm');
const tbody = document.querySelector('#appointmentsList');

// Load appointments when page loads
window.onload = loadAppointments;

async function loadAppointments() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    renderAppointments(data);
  } catch (error) {
    alert('❌ Failed to load data');
  }
}

function renderAppointments(appointments) {
  tbody.innerHTML = '';
  appointments.forEach(appointment => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${appointment.name}</td>
      <td>${appointment.subject}</td>
      <td>${new Date(appointment.datetime).toLocaleString()}</td>
      <td class="actions">
        <button onclick='editAppointment("${appointment._id}")'>Edit</button>
        <button class="delete" onclick='deleteAppointment("${appointment._id}")'>Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function editAppointment(id) {
  const appointment = appointments.find(a => a._id === id);
  if (appointment) {
    document.getElementById('name').value = appointment.name;
    document.getElementById('subject').value = appointment.subject;
    document.getElementById('datetime').value = appointment.datetime;
    document.getElementById('appointmentId').value = id;
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const subject = document.getElementById('subject').value;
  const datetime = document.getElementById('datetime').value;
  const id = document.getElementById('appointmentId').value;

  if (!name || !subject || !datetime) {
    alert('⚠️ Please fill in all fields');
    return;
  }

  const appointment = {
    name,
    subject,
    datetime
  };

  try {
    if (id) {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointment)
      });
      alert('✅ Appointment updated successfully');
    } else {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointment)
      });
      alert('✅ Appointment added successfully');
    }
    
    form.reset();
    document.getElementById('appointmentId').value = '';
    loadAppointments();
  } catch (error) {
    alert('❌ Failed to save appointment');
  }
});

async function deleteAppointment(id) {
  if (!confirm("🗑️ Delete this appointment?")) return;
  
  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    alert('✅ Appointment deleted successfully');
    loadAppointments();
  } catch (error) {
    alert('❌ Failed to delete appointment');
  }
}
