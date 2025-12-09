// Expenses Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Modal elements
    const addExpenseBtn = document.getElementById('addExpenseBtn');
    const expenseModal = document.getElementById('expenseModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const expenseForm = document.getElementById('expenseForm');
    
    // Category dropdown
    const categorySelect = document.getElementById('categorySelect');
    const categoryDropdown = document.getElementById('categoryDropdown');
    const categoryOptions = document.querySelectorAll('.category-option');
    
    // Form inputs
    const expenseAmount = document.getElementById('expenseAmount');
    const expenseDate = document.getElementById('expenseDate');
    const expenseDescription = document.getElementById('expenseDescription');
    
    // Expenses list
    const expensesList = document.getElementById('expensesList');
    const totalSpentAmount = document.getElementById('totalSpentAmount');
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    expenseDate.value = today;
    
    // Icon map for categories
    const categoryIconMap = {
        transportation: '../icons/bus-icon.png',
        food: '../icons/dining-icon.png',
        bills: '../icons/house-icon.png',
        shopping: '../icons/shop-icon.png',
        mobile: '../icons/device-icon.png',
        healthcare: '../icons/heart-icon.png',
        entertainment: '../icons/games-icon.png',
        other: '../icons/other-icon.png'
    };

    // Load expenses from localStorage
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    let selectedCategory = {
        value: 'transportation',
        icon: categoryIconMap.transportation,
        name: 'Transportation'
    };

    // Normalize stored expenses to new icon paths
    let iconsUpdated = false;
    expenses = expenses.map(exp => {
        const iconPath = categoryIconMap[exp.category?.value];
        if (iconPath && !(exp.category?.icon || '').includes('.png') && !(exp.category?.icon || '').includes('.svg')) {
            iconsUpdated = true;
            return {
                ...exp,
                category: {
                    ...exp.category,
                    icon: iconPath
                }
            };
        }
        return exp;
    });
    if (iconsUpdated) {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }
    
    // Open modal
    addExpenseBtn.addEventListener('click', () => {
        expenseModal.classList.add('active');
    });
    
    // Close modal
    modalCloseBtn.addEventListener('click', () => {
        expenseModal.classList.remove('active');
    });
    
    // Close modal on overlay click
    expenseModal.addEventListener('click', (e) => {
        if (e.target === expenseModal) {
            expenseModal.classList.remove('active');
        }
    });
    
    // Toggle category dropdown
    categorySelect.addEventListener('click', () => {
        categoryDropdown.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!categorySelect.contains(e.target) && !categoryDropdown.contains(e.target)) {
            categoryDropdown.classList.remove('active');
        }
    });
    
    // Select category
    categoryOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove selected class from all options
            categoryOptions.forEach(opt => {
                opt.classList.remove('selected');
                opt.querySelector('.cat-check').textContent = '';
            });
            
            // Add selected class to clicked option
            option.classList.add('selected');
            option.querySelector('.cat-check').textContent = '✓';
            
            // Update selected category
            selectedCategory = {
                value: option.dataset.value,
                icon: option.dataset.icon || categoryIconMap[option.dataset.value],
                name: option.querySelector('.cat-name').textContent
            };
            
            // Update display
            categorySelect.querySelector('.category-icon').innerHTML = `
                <img src="${selectedCategory.icon}" alt="${selectedCategory.name}">
            `;
            categorySelect.querySelector('.category-name').textContent = selectedCategory.name;
            
            // Close dropdown
            categoryDropdown.classList.remove('active');
        });
    });
    
    // Submit expense form
    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const amount = parseFloat(expenseAmount.value);
        const date = expenseDate.value;
        const description = expenseDescription.value.trim() || selectedCategory.name;
        
        if (!amount || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        
        // Create expense object
        const expense = {
            id: Date.now(),
            amount: amount,
            category: selectedCategory,
            date: date,
            description: description,
            timestamp: new Date().toISOString()
        };
        
        // Add to expenses array
        expenses.push(expense);
        
        // Save to localStorage
        localStorage.setItem('expenses', JSON.stringify(expenses));
        
        // Reset form
        expenseForm.reset();
        expenseDate.value = today;
        
        // Close modal
        expenseModal.classList.remove('active');
        
        // Refresh expenses list
        renderExpenses();
        updateTotalSpent();
    });
    
    // Render expenses grouped by date
    function renderExpenses() {
        if (expenses.length === 0) {
            expensesList.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; color: #9ca3af;">
                    <img src="../icons/list-icon.png" alt="No expenses" style="width: 80px; height: 80px; margin-bottom: 16px; opacity: 0.5;">
                    <p style="font-size: 18px; font-weight: 600; color: #6b7280; margin-bottom: 8px;">No expenses yet</p>
                    <p style="font-size: 14px;">Click "Add Expense" to start tracking your spending</p>
                </div>
            `;
            return;
        }
        
        // Group expenses by date
        const groupedExpenses = {};
        expenses.forEach(expense => {
            const dateKey = expense.date;
            if (!groupedExpenses[dateKey]) {
                groupedExpenses[dateKey] = [];
            }
            groupedExpenses[dateKey].push(expense);
        });
        
        // Sort dates (newest first)
        const sortedDates = Object.keys(groupedExpenses).sort((a, b) => new Date(b) - new Date(a));
        
        // Render grouped expenses
        expensesList.innerHTML = sortedDates.map(date => {
            const dateObj = new Date(date + 'T00:00:00');
            const formattedDate = dateObj.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
            });
            
            const expenseItems = groupedExpenses[date]
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map(expense => `
                    <div class="expense-item">
                        <div class="expense-item-icon">
                            ${(() => {
                                const icon = expense.category.icon;
                                const mapped = categoryIconMap[expense.category.value];
                                if (icon && (icon.includes('.png') || icon.includes('.svg'))) {
                                    return `<img src="${icon}" alt="${expense.category.name}">`;
                                }
                                if (mapped) {
                                    return `<img src="${mapped}" alt="${expense.category.name}">`;
                                }
                                return icon || '💰';
                            })()}
                        </div>
                        <div class="expense-item-details">
                            <div class="expense-item-category">${expense.category.name}</div>
                            <div class="expense-item-description">${expense.description}</div>
                        </div>
                        <span class="expense-item-amount">₱${expense.amount.toLocaleString()}</span>
                        <div class="expense-item-actions">
                            <button class="expense-action-btn btn-edit" onclick="editExpense(${expense.id})">
                                <img src="../icons/edit-icon.png" alt="Edit">
                            </button>
                            <button class="expense-action-btn btn-delete" onclick="deleteExpense(${expense.id})">
                                <img src="../icons/delete-icon.png" alt="Delete">
                            </button>
                        </div>
                    </div>
                `).join('');
            
            return `
                <div class="expense-date-group">
                    <div class="expense-date-header">${formattedDate}</div>
                    <div class="expense-items">
                        ${expenseItems}
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // Update total spent
    function updateTotalSpent() {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        totalSpentAmount.textContent = `₱${total.toLocaleString()}`;
    }
    
    // Delete expense
    window.deleteExpense = function(id) {
        if (confirm('Are you sure you want to delete this expense?')) {
            expenses = expenses.filter(expense => expense.id !== id);
            localStorage.setItem('expenses', JSON.stringify(expenses));
            renderExpenses();
            updateTotalSpent();
        }
    };
    
    // Edit expense (placeholder for future implementation)
    window.editExpense = function(id) {
        alert('Edit functionality will be implemented soon!');
    };
    
    // Logout confirmation
    window.confirmLogout = function() {
        const confirmed = confirm('Are you sure you want to logout? You will need to sign in again.');
        if (confirmed) {
            localStorage.clear();
            window.location.href = 'index.html';
        }
    };
    
    // AI Chat functionality (reused from dashboard)
    const chatBtn = document.getElementById('aiChatBtn');
    const chatPopup = document.getElementById('aiChatPopup');
    const chatCloseBtn = document.getElementById('chatCloseBtn');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatMessages = document.getElementById('chatMessages');

    if (chatBtn && chatPopup) {
        chatBtn.addEventListener('click', () => {
            chatPopup.classList.toggle('active');
        });

        chatCloseBtn.addEventListener('click', () => {
            chatPopup.classList.remove('active');
        });

        chatSendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    function sendMessage() {
        const message = chatInput.value.trim();
        if (message === '') return;

        addMessage(message, 'user');
        chatInput.value = '';

        setTimeout(() => {
            const aiResponse = 'I understand you\'re asking about expenses. This feature will be connected to our AI backend soon!';
            addMessage(aiResponse, 'ai');
        }, 800);
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        if (sender === 'ai') {
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <img src="../icons/chatbot2-icon.png" alt="AI">
                </div>
                <div class="message-content">
                    <p>${text}</p>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-avatar user-avatar">
                    <img src="../icons/user-icon.png" alt="User">
                </div>
                <div class="message-content">
                    <p>${text}</p>
                </div>
            `;
        }

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    window.sendQuickAction = function(action) {
        addMessage(action, 'user');
        setTimeout(() => {
            addMessage('This feature will analyze your expenses once connected to the backend!', 'ai');
        }, 800);
    };
    
    // Initial render
    renderExpenses();
    updateTotalSpent();
});
