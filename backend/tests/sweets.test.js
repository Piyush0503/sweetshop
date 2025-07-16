require("dotenv").config({ path: "./.env" }); // Load env vars
const db = require("../db");
const sweetModel = require("../models/sweetModel");

let sweetId;

beforeAll(async () => {
  await db.query("DELETE FROM sweets"); // clean before test
});

afterAll(async () => {
  await db.query("DELETE FROM sweets"); // clean after test
  await db.end();
});

describe("Sweet Model Functions", () => {
  test("addSweet - should insert a sweet into DB", async () => {
    const sweet = await sweetModel.addSweet({
      name: "Unit Sweet",
      category: "Unit",
      price: 20,
      quantity: 10,
    });
    sweetId = sweet.id;

    expect(sweet.name).toBe("Unit Sweet");
    expect(sweet.quantity).toBe(10);
  });

  test("getAllSweets - should return array of sweets", async () => {
    const sweets = await sweetModel.getAllSweets();
    expect(Array.isArray(sweets)).toBe(true);
    expect(sweets.length).toBeGreaterThan(0);
  });

  test("updateSweet - should update a sweet", async () => {
    const updated = await sweetModel.updateSweet(sweetId, {
      name: "Updated Unit Sweet",
      category: "Updated Unit",
      price: 25,
      quantity: 15,
    });

    expect(updated.name).toBe("Updated Unit Sweet");
    expect(Number(updated.price)).toBe(25); // <-- Fix here
  });

  test("purchaseSweet - should reduce quantity", async () => {
    const result = await sweetModel.purchaseSweet(sweetId, 5);
    expect(result.quantity).toBe(10); // 15 - 5
  });

  test("restockSweet - should increase quantity", async () => {
    const result = await sweetModel.restockSweet(sweetId, 20);
    expect(result.quantity).toBe(30); // 10 + 20
  });

  test("searchSweets - should return filtered results", async () => {
    const result = await sweetModel.searchSweets({
      name: "updated",
      minPrice: 10,
    });
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].name.toLowerCase()).toContain("updated");
  });

  test("deleteSweet - should remove a sweet", async () => {
    await sweetModel.deleteSweet(sweetId);
    const result = await db.query("SELECT * FROM sweets WHERE id = $1", [
      sweetId,
    ]);
    expect(result.rowCount).toBe(0);
  });
});
