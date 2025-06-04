// public/js/inventory.js

// Hook para o <select> da classificação
//let classificationList = document.getElementById("classificationList")
let classificationList = document.getElementById("classification_id")


classificationList.addEventListener("change", function () {
  let classification_id = classificationList.value

  // Validar se a seleção é válida
  if (classification_id) {
    fetch(`/inv/getInventory/${classification_id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        return response.json()
      })
      .then(data => {
        buildInventoryTable(data)
      })
      .catch(error => {
        console.error("Error fetching inventory data:", error)
      })
  }
})

function buildInventoryTable(data) {
  let table = document.getElementById("inventoryDisplay")
  table.innerHTML = ""

  if (data.length === 0) {
    table.innerHTML = "<tr><td colspan='5'>No inventory found for this classification.</td></tr>"
    return
  }

  // Cabeçalho da tabela
  let tableHeader = `
    <thead>
      <tr>
        <th>Vehicle</th>
        <th>Price</th>
        <th>Year</th>
        <th>Modify</th>
        <th>Delete</th>
      </tr>
    </thead>
    <tbody>
  `
  let tableRows = ""

  data.forEach(vehicle => {
    tableRows += `
      <tr>
        <td>${vehicle.inv_make} ${vehicle.inv_model}</td>
        <td>$${vehicle.inv_price.toLocaleString()}</td>
        <td>${vehicle.inv_year}</td>
        <td><a href="/inv/edit/${vehicle.inv_id}" title="Edit ${vehicle.inv_make} ${vehicle.inv_model}">Modify</a></td>
        <td><a href="/inv/delete/${vehicle.inv_id}" title="Delete ${vehicle.inv_make} ${vehicle.inv_model}">Delete</a></td>
      </tr>
    `
  })

  table.innerHTML = tableHeader + tableRows + "</tbody>"
}