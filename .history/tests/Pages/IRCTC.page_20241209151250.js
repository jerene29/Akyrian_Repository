// homePage.js
class IRCTCPage {
    constructor(page) {
        this.page = page;
        this.menuButton = '[class="h_menu_drop_button hidden-xs"]';
        this.loginLink = 'text=LOGIN'.nth(0);
        this.irctcExclusiveLink = 'text=IRCTC EXCLUSIVE'.nth(0);
        this.TrainsLink = 'text=TRAINS'.nth(0);
        this.LoyaltyLink = 'text=LOYALTY'.nth(0);
        this.Irtctewallet = 'text=IRCTC eWallet'.nth(0);
        this.BusesLink = 'text=BUSES'.nth(0);
        this.FlightsLink = 'text=FLIGHTS'.nth(0);
        this.HotelsLink = 'text=HOTELS'.nth(0);
        this.HolidaysLink = 'text=HOLIDAYS'.nth(0);
        this.MealsLink = 'text=MEALS'.nth(0);
        this.PromotionsLink = 'text=PROMOTIONS'.nth(0);
        this.AlertsLink = 'text=ALERTS'.nth(0);
        this.MoreLink = 'text=MORE'.nth(0);
        this.ContactLink = 'text=CONTACT US'.nth(0);
        this.HelpSupportLink = 'text=HELP & SUPPORT'.nth(0);
        this.DealsLink = 'text=DAILY DEALS'.nth(0);
        this.LangLink = 'text=हिंदी'.nth(0);

        this.AgentLink = 'text=AGENT LOGIN'.nth(0);
        this.pnrStatusLink = 'text=PNR STATUS'.nth(0);
        this.Easybook = 'text=EASY BOOKING ON ASK DISHA'.nth(0);

        this.chartVacancyLink = 'text=CHARTS/VACANCY'.nth(0);
        this.bookTicketLink = 'text=BOOK TICKET'.nth(0);
        this.searchLink = 'text=SEARCH'.nth(0);
        this.logo = 'img[alt="IRCTC Logo"]'.nth(0);
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
