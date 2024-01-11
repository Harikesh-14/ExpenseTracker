import { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [totalExpense, setTotalExpense] = useState(0);
    const [expenseName, setExpenseName] = useState('Expense');
    const [amount, setAmount] = useState(0);
    const [expenseList, setExpenseList] = useState([]);
    const [showExpenseField, setShowExpenseField] = useState(false);
    const [showExpenseTable, setShowExpenseTable] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);

    const totalExpenseHandler = (e) => {
        const newTotalExpense = e.target.value;
        setTotalExpense(newTotalExpense);
        localStorage.setItem('totalExpense', newTotalExpense);
    };

    const expenseNameHandler = (e) => {
        setExpenseName(e.target.value);
    };

    const amountHandler = (e) => {
        setAmount(e.target.value);
    };

    const showExpenseInputField = () => {
        if (totalExpense !== 0) {
            setShowExpenseField(true);
            localStorage.setItem('totalExpense', totalExpense);
        } else {
            setShowExpenseField(false);
        }
    };

    // fetching the list from local storage
    useEffect(() => {
        try {
            const storedExpenseList = JSON.parse(localStorage.getItem('expenseList')) || [];
            const storedTotalExpense = localStorage.getItem('totalExpense') || 0;

            setExpenseList(storedExpenseList);
            setTotalExpense(Number.parseInt(storedTotalExpense, 10));
            setShowExpenseTable(true); // Show the table when data is available
            setShowExpenseField(true);
        } catch (error) {
            console.error('Error parsing JSON from local storage:', error);
        }
    }, [setExpenseList, setTotalExpense]);

    const addExpenses = () => {
        const newList = {
            nameOfExpense: expenseName,
            amount: Number.parseInt(amount),
        };

        if (amount !== 0 || expenseName !== '') {
            setExpenseList((prevList) => {
                const updatedList = [...prevList, newList];
                localStorage.setItem('expenseList', JSON.stringify(updatedList));
                return updatedList;
            });
        }

        setExpenseName('');
        setAmount('');
        setShowExpenseTable(true);
    };

    const deleteExpense = (index) => {
        setExpenseList((prevList) => {
            const updatedList = prevList.filter((_, i) => i !== index);
            localStorage.setItem('expenseList', JSON.stringify(updatedList));
            return updatedList;
        });
    };

    useEffect(() => {
        const newTotalAmount = expenseList.reduce((acc, expenseObj) => acc + expenseObj.amount, 0);
        setTotalAmount(newTotalAmount);
    }, [expenseList]);

    const clearTable = () => {
        try {
            localStorage.removeItem('expenseList')
            setExpenseList([])
        } catch (err) {
            console.log("Error clearing the list from the table ", err)
        }
    }

    return (
        <>
            <div className='websiteIntro'>
                <h1>Expense Tracker</h1>
                <p>Embark on a journey towards financial clarity with our Expense Tracker! Seamlessly manage your monthly spending, track your expenses, and gain insights into your financial habits. Our user-friendly interface makes it easy to input, monitor, and analyze your expenditures. Stay in control of your budget, visualize your financial progress, and make informed decisions about your money. Start your path to financial freedom today with our intuitive Expense Tracker – because every penny counts on your road to financial well-being.</p>
            </div>

            {/* total amount which we get in this month */}
            <div className="totalExpense">
                <input
                    type="number"
                    value={totalExpense}
                    placeholder="Enter your this month's expense"
                    onChange={totalExpenseHandler}
                />
                <button type="button" onClick={showExpenseInputField}>
                    Enter
                </button>
            </div>

            {/* input fields */}
            {showExpenseField && (
                <div className="expensesField">
                    <p>Enter your expenses here</p>

                    <div className="expensesInputField">
                        <input
                            type="text"
                            placeholder="Expense"
                            value={expenseName}
                            onChange={expenseNameHandler}
                        />
                        <input
                            type="number"
                            placeholder="Amount"
                            value={amount}
                            onChange={amountHandler}
                        />
                        <button
                            type="button"
                            onClick={addExpenses}
                            disabled={totalAmount >= totalExpense}
                        >
                            Add
                        </button>
                    </div>
                </div>
            )}

            {/* lists of the expenses */}
            {showExpenseTable && (
                <div className="expensesList">
                    <div className="amountTracker">
                        <div className="amountLeft">
                            <h2>Amount Left</h2>
                            <p>Rs. {totalExpense - totalAmount}</p>
                        </div>

                        <div className="totalAmount">
                            <h2>Total Amount</h2>
                            <p>Rs. {totalAmount}</p>
                        </div>

                        <div className="clearBtn">
                            <button type='button' onClick={clearTable}>Clear</button>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Expense Name</th>
                                <th>Amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenseList.map((expense, key) => (
                                <tr key={key}>
                                    <td>{expense.nameOfExpense}</td>
                                    <td>₹ {expense.amount}</td>
                                    <td>
                                        <button
                                            type="button"
                                            onClick={() => deleteExpense(key)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}

export default App;