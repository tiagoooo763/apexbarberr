import { test, expect } from "@playwright/test";

test.describe("Navegação e responsividade", () => {
  test("home carrega sem scroll horizontal e sem erros de console", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
    page.on("pageerror", (e) => errors.push(String(e)));

    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const hasHScroll = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(hasHScroll).toBe(false);
    expect(errors).toEqual([]);
  });

  test("menu mobile abre, prende foco e fecha com Esc", async ({ page, isMobile }) => {
    test.skip(!isMobile, "menu mobile só existe em telas pequenas");
    await page.goto("/");
    await page.getByLabel("Abrir menu").click();
    await expect(page.locator("#mobile-menu")).toBeVisible();
    await expect(page.getByLabel("Fechar menu")).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.locator("#mobile-menu")).toHaveCount(0);
  });

  test("rota inexistente mostra página 404 com navegação de volta", async ({ page }) => {
    const res = await page.goto("/pagina-que-nao-existe");
    expect(res?.status()).toBe(404);
    await expect(page.getByText("Esta página não existe")).toBeVisible();
    await page.getByRole("link", { name: "Página inicial", exact: true }).click();
    await expect(page).toHaveURL("/");
  });
});

test.describe("Checkout: casos de borda", () => {
  test("acessar /checkout sem parâmetros mostra mensagem honesta, não quebra", async ({ page }) => {
    await page.goto("/checkout");
    await expect(page.getByText("Não encontramos os dados")).toBeVisible();
    await page.getByRole("link", { name: "Voltar para o agendamento" }).click();
    await expect(page).toHaveURL(/\/agendar/);
  });

  test("acessar /sucesso sem pedido mostra mensagem honesta, não quebra", async ({ page }) => {
    await page.goto("/sucesso");
    await expect(page.getByText("Pedido não encontrado")).toBeVisible();
  });
});

test.describe("Fluxo completo de agendamento e checkout (modo demonstração)", () => {
  test("do agendamento à confirmação, com validação e .ics", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Agendar meu horário" }).first().click();
    await expect(page).toHaveURL(/\/agendar/);

    await page.getByRole("radiogroup", { name: "Escolha o serviço" }).getByText("Corte + Barba").click();
    await page.getByRole("radiogroup", { name: "Escolha o profissional" }).getByText("Sem preferência").click();

    const days = page.getByRole("radiogroup", { name: "Escolha a data" }).getByRole("radio");
    await days.nth(2).click();

    const timeGroup = page.getByRole("radiogroup", { name: "Escolha o horário" });
    await expect(timeGroup.getByRole("radio").first()).toBeVisible({ timeout: 10_000 });
    await timeGroup.getByRole("radio").first().click();

    await page.getByRole("button", { name: "Continuar para pagamento" }).click();
    await expect(page).toHaveURL(/\/checkout/);
    await expect(page.getByText("Resumo do pedido")).toBeVisible();

    // envio vazio deve mostrar erros de validação, não travar nem enviar
    await page.getByRole("button", { name: "Confirmar e pagar" }).click();
    await expect(page.locator("#name-error")).toBeVisible();
    await expect(page.locator("#phone-error")).toBeVisible();

    await page.fill("#name", "Cliente de Teste");
    await page.fill("#phone", "(38) 99999-0000");

    const submit = page.locator("form button[type=submit]");
    await submit.click();
    await expect(submit).toBeDisabled();

    await expect(page).toHaveURL(/\/sucesso/, { timeout: 10_000 });
    await expect(page.getByRole("heading", { name: "Agendamento confirmado!" })).toBeVisible();

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Adicionar ao calendário" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^apex-barber-.*\.ics$/);
  });
});
