import { expect, test } from "@playwright/test";

test("landing page works on a phone", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("button", { name: "Platform" }).click();
  await expect(page.getByRole("link", { name: "Form builder", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.getByLabel("Email").fill("kanav@example.com");
  await page.getByLabel("Password").fill("secret");
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page).toHaveURL(/\/forms$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("workspace and form pages fit a phone screen", async ({ page, request }) => {
  await page.goto("/forms");
  await expect(page.getByRole("button", { name: /Create form/ })).toBeVisible();
  await expect(page.getByText("Customer Feedback Survey")).toBeVisible();
  const forms = await (await request.get("http://localhost:8000/api/forms")).json();
  const feedback = forms.find((form: { title: string }) => form.title === "Customer Feedback Survey");
  await page.goto(`/forms/${feedback.id}/create`);
  await expect(page.getByText("The builder needs a bigger screen")).toBeVisible();
  await page.getByRole("link", { name: "Results" }).click();
  await expect(page.getByText("Search engine")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
