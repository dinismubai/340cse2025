const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

// Formulário de compra
router.get("/purchase/:inv_id", cartController.showPurchaseForm);

// Adicionar ao carrinho
router.post("/add", cartController.addToCart);

// Resumo da compra
router.get("/summary/:account_id", cartController.showPurchaseSummary);

module.exports = router;//
