const { test, expect } = require("@playwright/test");
const path = require("path");

test("Kiểm tra không có lỗi khi mở Modal Ôn Tập", async ({ page }) => {
  let hasFatalError = false;
  let errorMessage = "";

  // 1. Tự động bấm "OK" để đóng mọi bảng thông báo (alert) xuất hiện để test không bị treo
  page.on("dialog", async (dialog) => {
    await dialog.dismiss();
  });

  // 2. Chỉ bắt các lỗi sập trang thực sự (bỏ qua console.error do Firebase cảnh báo mạng)
  page.on("pageerror", (error) => {
    hasFatalError = true;
    errorMessage = error.message;
  });

  // 3. Mở file index.html
  const filePath = `file://${path.resolve(__dirname, "../index.html")}`;
  await page.goto(filePath);

  // 4. Chờ cho giao diện tải xong (Đợi nút tab-quiz xuất hiện)
  await page.waitForSelector("#tab-quiz");

  // 5. Click vào nút Ôn Tập
  await page.click("#tab-quiz");

  // 6. Kiểm tra xem Modal Ôn tập có thực sự hiển thị lên màn hình không
  const quizModal = page.locator("#quizSetupModal");
  await expect(quizModal).toBeVisible();

  // 7. Khẳng định không có lỗi sập JS nào cản trở quá trình
  expect(
    hasFatalError,
    `Phát hiện lỗi sập trang Javascript: ${errorMessage}`,
  ).toBe(false);
});
