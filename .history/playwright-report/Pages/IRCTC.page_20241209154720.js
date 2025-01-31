const { expect } = require('@playwright/test');  
// Import expect from Playwright
class IRCTCPage {
    constructor(page) {
        this.page = page;
        this.menuButton = '[class="h_menu_drop_button hidden-xs"]';
        this.loginLink = 'text=LOGIN';
        this.irctcExclusiveLink = 'text=IRCTC EXCLUSIVE';
        this.TrainsLink = 'text=TRAINS';
        this.LoyaltyLink = 'text=LOYALTY';
        this.Irtctewallet = 'text=IRCTC eWallet';
        this.BusesLink = 'text=BUSES';
        this.FlightsLink = 'text=FLIGHTS';
        this.HotelsLink = 'text=HOTELS';
        this.HolidaysLink = 'text=HOLIDAYS';
        this.MealsLink = 'text=MEALS';
        this.PromotionsLink = 'text=PROMOTIONS';
        this.AlertsLink = 'text=ALERTS';
        this.MoreLink = 'text=MORE';
        this.ContactLink = 'text=CONTACT US';
        this.HelpSupportLink = 'text=HELP & SUPPORT';
        this.DealsLink = 'text=DAILY DEALS';
        this.LangLink = 'text=हिंदी';

        this.AgentLink = 'text=AGENT LOGIN';
        this.pnrStatusLink = 'text=PNR STATUS';
        this.Easybook = 'text=EASY BOOKING ON ASK DISHA';

        this.chartVacancyLink = 'text=CHARTS/VACANCY';
        this.bookTicketLink = 'text=BOOK TICKET';
        this.searchLink = 'text=SEARCH';
        this.logo = 'img[alt="IRCTC Logo"]';
    }

    async open() {
        await this.page.goto('https://www.irctc.co.in/nget/train-search', { timeout: 30000 });
        await this.page.waitForTimeout(10000);
    }

    async clickMenu() {
        await this.page.locator(this.menuButton).click();
    }

    async checkLoginPageElements() {
        await expect(this.page.locator(this.loginLink)).toBeVisible();
        await expect(this.page.locator(this.irctcExclusiveLink)).toBeVisible();
        await expect(this.page.locator(this.TrainsLink)).toBeVisible();
        await expect(this.page.locator(this.LoyaltyLink)).toBeVisible();
        await expect(this.page.locator(this.Irtctewallet)).toBeVisible();
        await expect(this.page.locator(this.BusesLink)).toBeVisible();
        await expect(this.page.locator(this.FlightsLink)).toBeVisible();
        await expect(this.page.locator(this.HotelsLink)).toBeVisible();
        await expect(this.page.locator(this.HolidaysLink)).toBeVisible();
        await expect(this.page.locator(this.MealsLink)).toBeVisible();
        await expect(this.page.locator(this.PromotionsLink)).toBeVisible();
        await expect(this.page.locator(this.AlertsLink)).toBeVisible();
        await expect(this.page.locator(this.MoreLink)).toBeVisible();
        await expect(this.page.locator(this.ContactLink)).toBeVisible();
        await expect(this.page.locator(this.HelpSupportLink)).toBeVisible();
        await expect(this.page.locator(this.DealsLink)).toBeVisible();
        await expect(this.page.locator(this.LangLink)).toBeVisible();
        await expect(this.page.locator(this.AgentLink)).toBeVisible();

        await expect(this.page.locator(this.pnrStatusLink)).toBeVisible();
        await expect(this.page.locator(this.Easybook)).toBeVisible();

        await expect(this.page.locator(this.chartVacancyLink)).toBeVisible();
        await expect(this.page.locator(this.bookTicketLink)).toBeVisible();
        await expect(this.page.locator(this.searchLink)).toBeVisible();
        await expect(this.page.locator(this.logo)).toBeVisible();
    }
}

module.exports = { IRCTCPage };
