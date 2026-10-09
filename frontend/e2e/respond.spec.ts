import { expect, test, type Page } from "@playwright/test";
import { deleteForm, seedForm } from "./helpers";

const current = (page: Page) => page.locator("[data-question]").last();

async function expectQuestion(page: Page, title: RegExp) {
  await expect(current(page).getByRole("heading")).toHaveText(title);
}

test("every question type can be answered and shows up in results", async ({ page, request }) => {
  const form = await seedForm(request, `Respond ${Date.now()}`);
  await page.goto(`/to/${form.public_id}`);

  await current(page).getByPlaceholder("Type your answer here...").fill("Sam");
  await page.keyboard.press("Enter");

  await expectQuestion(page, /Tell us more/);
  await current(page).getByPlaceholder("Type your answer here...").fill("Line one");
  await page.keyboard.press("Shift+Enter");
  await page.keyboard.type("Line two");
  await page.keyboard.press("Enter");

  await expectQuestion(page, /Your email\?/);
  await current(page).getByPlaceholder("name@example.com").fill("not-an-email");
  await page.keyboard.press("Enter");
  await expect(current(page).getByText("Hmm... that email doesn't look right")).toBeVisible();
  await current(page).getByPlaceholder("name@example.com").fill("sam@example.com");
  await page.keyboard.press("Enter");

  await expectQuestion(page, /How many\?/);
  await current(page).getByPlaceholder("Type your answer here...").fill("3");
  await current(page).getByRole("button", { name: "OK" }).click();

  await expectQuestion(page, /Pick a color/);
  await current(page).getByRole("button", { name: /Blue/ }).click();

  await expectQuestion(page, /Pick a size/);
  await current(page).getByPlaceholder("Type or select an option").fill("lar");
  await current(page).getByRole("button", { name: "Large" }).click();

  await expectQuestion(page, /Happy\?/);
  await current(page).getByRole("button", { name: /Yes/ }).click();

  await expectQuestion(page, /Rate us/);
  await page.getByRole("button", { name: "Previous question" }).click();
  await expectQuestion(page, /Happy\?/);
  await page.getByRole("button", { name: "Next question" }).click();
  await expectQuestion(page, /Rate us/);
  await current(page).getByRole("button", { name: "4 star" }).click();

  await expect(page.getByRole("heading", { name: "Thanks for completing this typeform" })).toBeVisible();

  const responses = await (await request.get(`http://localhost:8000/api/forms/${form.id}/responses`)).json();
  expect(responses).toHaveLength(1);
  expect(responses[0].answers.map((answer: { value: string }) => answer.value)).toEqual([
    "Sam",
    "Line one\nLine two",
    "sam@example.com",
    "3",
    "Blue",
    "Large",
    "Yes",
    "4",
  ]);

  await deleteForm(request, form.id);
});

test("required questions block, optional ones can be skipped", async ({ page, request }) => {
  const form = await seedForm(request, `Required ${Date.now()}`);
  await page.goto(`/to/${form.public_id}`);
  await current(page).getByRole("button", { name: "OK" }).click();
  await expect(current(page).getByText("Please fill this in")).toBeVisible();
  await current(page).getByPlaceholder("Type your answer here...").fill("Sam");
  await page.keyboard.press("Enter");
  await expectQuestion(page, /Tell us more/);
  await current(page).getByRole("button", { name: "OK" }).click();
  await expectQuestion(page, /Your email\?/);
  await deleteForm(request, form.id);
});

test("unpublished forms are not reachable publicly", async ({ page, request }) => {
  const form = await seedForm(request, `Draft ${Date.now()}`, false);
  await page.goto(`/to/${form.public_id}`);
  await expect(page.getByText("This form isn't available")).toBeVisible();
  await deleteForm(request, form.id);
});
