const cartModel = require("../models/cart-model");
const inventoryModel = require("../models/inventory-model"); // usado para obter dados do veículo
const utilities = require("../utilities") // já deve estar importado

// Mostra o formulário de compra
// Mostra o formulário de compra
async function showPurchaseForm(req, res) {
  try {
    const inv_id = req.params.inv_id;
    const account = req.session.account;
    const nav = await utilities.getNav();

    const vehicle = await inventoryModel.getInventoryById_toPurchase(inv_id);

    if (!vehicle) {
      req.flash("notice", "Veículo não encontrado.");
      return res.redirect("/inv"); // ou qualquer página adequada
    }

    res.render("cart/purchase-form", {
      title: "Comprar Veículo",
      nav,
      account,
      vehicle
    });
  } catch (error) {
    console.error("Erro ao exibir o formulário de compra:", error);
    req.flash("notice", "Erro ao carregar o formulário de compra.");
    res.redirect("/inv");
  }
}


// Processa o envio do formulário e adiciona ao carrinho
async function addToCart(req, res) {
  const { inv_id, classification_id, cart_quantity } = req.body;
  const account_id = req.session.account.account_id;

  try {
    // Buscar veículo
    const vehicle = await inventoryModel.getInventoryById(inv_id);
    if (!vehicle) {
      req.flash("notice", "Veículo não encontrado.");
      return res.redirect("/inv");
    }

    // Adicionar ao carrinho com dados do veículo
    await cartModel.addToCart(
      account_id,
      classification_id,
      inv_id,
      cart_quantity,
      vehicle.inv_make,
      vehicle.inv_model
    );

    res.redirect(`/cart/summary/${account_id}`);
  } catch (error) {
    console.error("Erro ao adicionar ao carrinho:", error);
    req.flash("notice", "Erro ao adicionar ao carrinho.");
    res.redirect("/inv");
  }
}


// Mostra o resumo da compra
async function showPurchaseSummary(req, res) {
  try {
    const account_id = req.session.account.account_id;
    const cartItems = await cartModel.getCartSummary(account_id);

    // Calcula o total
    const total = cartItems.reduce((sum, item) => sum + item.inv_price * item.cart_quantity, 0);

    const nav = await utilities.getNav(); // garante que o nav está definido

    res.render("cart/purchase-summary", {
      title: "Resumo da Compra",  // adiciona o título aqui
      nav,                       // adiciona o nav para o layout
      cartItems,
      total
    });
  } catch (error) {
    console.error("Erro ao exibir resumo da compra:", error);
    req.flash("notice", "Erro ao carregar o resumo da compra.");
    res.redirect("/inv");
  }
}


module.exports = {
  showPurchaseForm,
  addToCart,
  showPurchaseSummary
};
