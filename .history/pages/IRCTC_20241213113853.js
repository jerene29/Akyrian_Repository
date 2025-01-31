const { test, expect } = require('@playwright/test');

exports.IRCTCPage=
class IRCTCPage {
    constructor(page) {
        this.page = page;
        this.menuButton = '[class="h_menu_drop_button hidden-xs"]';
        this.loginLink = 'text=LOGIN', { state: 'visible', timeout: 10000 };
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
        await expect(this.page.locator(this.loginLink).first()).toBeVisible();
        await expect(this.page.locator(this.irctcExclusiveLink).first()).toBeVisible();
        await expect(this.page.locator(this.TrainsLink).nth(0)).toBeVisible();
        await expect(this.page.locator(this.LoyaltyLink).nth(0)).toBeVisible();
        await expect(this.page.locator(this.Irtctewallet).nth(0)).toBeVisible();
        await expect(this.page.locator(this.BusesLink).nth(0)).toBeVisible();
        await expect(this.page.locator(this.FlightsLink).nth(0)).toBeVisible();
        await expect(this.page.locator(this.HotelsLink).nth(0)).toBeVisible();
        await expect(this.page.locator(this.HolidaysLink).nth(0)).toBeVisible();
        await expect(this.page.locator(this.MealsLink).nth(0)).toBeVisible();
        await expect(this.page.locator(this.PromotionsLink).nth(0)).toBeVisible();
        await expect(this.page.locator(this.AlertsLink).nth(0)).toBeVisible();
        await expect(this.page.locator(this.MoreLink).nth(0)).toBeVisible();
        await expect(this.page.locator(this.ContactLink).nth(0)).toBeVisible();
        await expect(this.page.locator(this.HelpSupportLink).nth(0)).toBeVisible();
        await expect(this.page.locator(this.DealsLink).nth(0)).toBeVisible();
        await expect(this.page.locator(this.LangLink).nth(0)).toBeVisible();
        await expect(this.page.locator(this.AgentLink).nth(0)).toBeVisible();

        await expect(this.page.locator(this.pnrStatusLink).nth(0)).toBeVisible();
        await expect(this.page.locator(this.Easybook).nth(0)).toBeVisible();

        await expect(this.page.locator(this.chartVacancyLink).nth(0)).toBeVisible();
        await expect(this.page.locator(this.bookTicketLink).nth(0)).toBeVisible();
        await expect(this.page.locator(this.searchLink).nth(0)).toBeVisible();
        await expect(this.page.locator(this.logo).nth(0)).toBeVisible();
    }
}

