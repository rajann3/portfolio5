const initial = [
  { description: 'August salary', category: 'Salary', amount: 85000, type: 'income' },
  { description: 'Freelance project', category: 'Freelance', amount: 18000, type: 'income' },
  { description: 'Fresh Basket', category: 'Food & dining', amount: 2430, type: 'expense' },
  { description: 'Rent payment', category: 'Home & utilities', amount: 22000, type: 'expense' },
  { description: 'Metro recharge', category: 'Transport', amount: 850, type: 'expense' },
  { description: 'Online shopping', category: 'Shopping', amount: 3275, type: 'expense' }
];
const budgets = { 'Food & dining': 8000, 'Home & utilities': 30000, Transport: 4000, Shopping: 8000 };
const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const $ = id => document.getElementById(id);
let data = JSON.parse(localStorage.getItem('ledgerly-transactions') || 'null') || initial;

function render() {
  const income = data.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = data.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  $('balance').textContent = money.format(income - expenses); $('income').textContent = money.format(income); $('expenses').textContent = money.format(expenses);
  $('expenseNote').textContent = `${income ? Math.round(expenses / income * 100) : 0}% of monthly income`;
  $('transactionContent').innerHTML = data.length ? `<table><thead><tr><th>Transaction</th><th>Category</th><th>Amount</th></tr></thead><tbody>${[...data].reverse().map(t => `<tr><td>${t.description}</td><td>${t.category}</td><td class="${t.type}">${t.type === 'income' ? '+' : '−'}${money.format(t.amount)}</td></tr>`).join('')}</tbody></table>` : '<p class="empty">No transactions yet. Add your first one above.</p>';
  const spent = {}; data.filter(t => t.type === 'expense').forEach(t => spent[t.category] = (spent[t.category] || 0) + t.amount);
  $('budgetList').innerHTML = Object.entries(budgets).map(([category, limit]) => { const used = spent[category] || 0; return `<div class="budget-row"><div><strong>${category}</strong><span>${money.format(used)} / ${money.format(limit)}</span></div><span class="bar"><i style="width:${Math.min(100, used / limit * 100)}%"></i></span></div>`; }).join('');
  const saved = Math.max(0, Math.round((income - expenses) * .55)); const percent = Math.min(100, Math.round(saved / 150000 * 100)); $('goalMoney').textContent = money.format(saved); $('goalBar').style.width = `${percent}%`; $('goalStatus').textContent = `${percent}% complete · ${money.format(Math.max(0, 150000 - saved))} to go`;
  localStorage.setItem('ledgerly-transactions', JSON.stringify(data));
}
function close() { $('modal').classList.remove('open'); }
$('addButton').onclick = () => $('modal').classList.add('open'); $('closeButton').onclick = close; $('cancelButton').onclick = close;
$('transactionForm').onsubmit = event => { event.preventDefault(); data.push({ description: $('description').value.trim(), category: $('category').value, amount: Number($('amount').value), type: $('type').value }); event.target.reset(); close(); render(); };
$('clearButton').onclick = () => { if (confirm('Clear all transactions?')) { data = []; render(); } }; render();
