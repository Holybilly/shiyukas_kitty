// Replace with your Supabase URL and API key
// Initialize Supabase (use supabase directly from the CDN)
const supabase = window.supabase.createClient(
  'https://rxgxpkxuzausrkzyzhqd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4Z3hwa3h1emF1c3Jrenl6aHFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MjAwMzYsImV4cCI6MjA1Njk5NjAzNn0.rKdMxZfzxulyNWeoMvxlRbeCo8FFfZz18IZjTHzvHlY'
);

async function savePayment() {
  const name = document.getElementById('name').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const mpesaReference = document.getElementById('mpesaReference').value;

  if (name === '' || amount === '' || mpesaReference === '') {
    alert('Please fill all the required fields!');
    return;
  }

  // Insert payment into Supabase
  const { data, error } = await supabase
    .from('members')
    .insert([{ name, amount, mpesa_reference: mpesaReference, payment_date: new Date() }]);

  if (error) {
    alert('Error submitting payment: ' + error.message);
  } else {
    alert('Payment submitted successfully!');
    
    // reset form
  document.getElementById('name').value = ''
  document.getElementById('mpesaReference').value = ''
    
    fetchReports();
  }
}

// Fetch and display reports
async function fetchReports() {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('payment_date', { ascending: false });

  if (error) {
    console.error('Error fetching reports: ' + error.message);
    return;
  }

  const tbody = document.querySelector('#reportsTable tbody');
  tbody.innerHTML = '';

  data.forEach((member) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${member.name}</td>
      <td>${new Date(member.payment_date).toLocaleDateString()}</td>
      <td>Ksh ${member.amount}</td>
      <td>Ksh ${calculateArrears(member)}</td>
    `;
    tbody.appendChild(row);
  });
}

// Calculate arrears (assuming 150 Ksh is the expected weekly payment)
function calculateArrears(member) {
  const expectedAmount = 150;
  return Math.max(0, expectedAmount - member.amount);
}

// Fetch reports on page load
fetchReports();