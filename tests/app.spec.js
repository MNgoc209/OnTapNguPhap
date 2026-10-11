// tests/app.spec.js
const { test, expect } = require("@playwright/test");
const path = require("path");

test("Kiểm tra không có lỗi khi mở Modal Ôn Tập", async ({ page }) => {
  // 1. Tạo biến để bắt các lỗi console.error hoặc lỗi văng ra trên page
  let hasError = false;
  let errorMessage = "";

  page.on("pageerror", (error) => {
    hasError = true;
    errorMessage = error.message;
  });

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      hasError = true;
      errorMessage = msg.text();
    }
  });

  // 2. Mở file index.html cục bộ
  const filePath = `file://${path.resolve(__dirname, "../index.html")}`;
  await page.goto(filePath);

  // 3. Click vào nút Ôn Tập (dùng text hoặc ID)
  await page.click("#tab-quiz");

  // 4. Kiểm tra Modal Ôn tập có hiện lên không
  const quizModal = page.locator("#quizSetupModal");
  await expect(quizModal).toBeVisible();

  // 5. Khẳng định (Assert) rằng không có lỗi nào văng ra
  expect(hasError, `Phát hiện lỗi Javascript: ${errorMessage}`).toBe(false);
});
