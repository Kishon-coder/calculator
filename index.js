let data = JSON.parse(localStorage.getItem("entries")) || [];

    function updateSummary() {
      const income = data.filter(d => d.type === "income").reduce((acc, val) => acc + val.amount, 0);
      const expense = data.filter(d => d.type === "expense").reduce((acc, val) => acc + val.amount, 0);
      document.getElementById("totalIncome").innerText = income;
      document.getElementById("totalExpense").innerText = expense;
      document.getElementById("netBalance").innerText = income - expense;
    }

    function saveData() {
      localStorage.setItem("entries", JSON.stringify(data));
    }

    function resetInputs() {
      document.getElementById("description").value = "";
      document.getElementById("amount").value = "";
      document.getElementById("type").value = "income";
    }

    function renderEntries(filter = "all") {
      const container = document.getElementById("entries");
      container.innerHTML = "";
      data
        .filter(d => filter === "all" || d.type === filter)
        .forEach((entry, index) => {
          const div = document.createElement("div");
          div.className = `entry ${entry.type}`;
          div.innerHTML = `
            <span>${entry.description} - ₹${entry.amount}</span>
            <div>
              <button onclick="editEntry(${index})">Edit</button>
              <button onclick="deleteEntry(${index})">Delete</button>
            </div>
          `;
          container.appendChild(div);
        });
    }

    function addEntry() {
      const desc = document.getElementById("description").value;
      const amt = parseFloat(document.getElementById("amount").value);
      const type = document.getElementById("type").value;

      if (!desc || isNaN(amt)) return alert("Please fill all fields correctly");

      data.push({ description: desc, amount: amt, type });
      saveData();
      resetInputs();
      updateSummary();
      renderEntries(document.querySelector('input[name="filter"]:checked').value);
    }

    function deleteEntry(index) {
      if (confirm("Are you sure?")) {
        data.splice(index, 1);
        saveData();
        updateSummary();
        renderEntries(document.querySelector('input[name="filter"]:checked').value);
      }
    }

    function editEntry(index) {
      const entry = data[index];
      const newDesc = prompt("Edit Description:", entry.description);
      const newAmt = prompt("Edit Amount:", entry.amount);
      if (newDesc && !isNaN(parseFloat(newAmt))) {
        data[index] = { ...entry, description: newDesc, amount: parseFloat(newAmt) };
        saveData();
        updateSummary();
        renderEntries(document.querySelector('input[name="filter"]:checked').value);
      }
    }

    function filterEntries() {
      const filter = document.querySelector('input[name="filter"]:checked').value;
      renderEntries(filter);
    }

    // Initial Load
    updateSummary();
    renderEntries();
