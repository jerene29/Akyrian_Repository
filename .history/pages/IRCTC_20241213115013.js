const { test, expect } = require('@playwright/test');

exports.IRCTCPage=
class IRCTCPage {
    constructor(page) {
        this.page = page;

        // Locators
        this.menuButton = '[class="h_menu_drop_button hidden-xs"]';
        this.loginLink = 'text=LOGIN';
        this.irctcExclusiveLink = 'text=IRCTC EXCLUSIVE';
        this.trainsLink = 'text=TRAINS';
        this.loyaltyLink = 'text=LOYALTY';
        this.irctcEwalletLink = 'text=IRCTC eWallet';
        this.busesLink = 'text=BUSES';
        this.flightsLink = 'text=FLIGHTS';
        this.hotelsLink = 'text=HOTELS';
        this.holidaysLink = 'text=HOLIDAYS';
        this.mealsLink = 'text=MEALS';
        this.promotionsLink = 'text=PROMOTIONS';
        this.alertsLink = 'text=ALERTS';
        this.moreLink = 'text=MORE';
        this.contactLink = 'text=CONTACT US';
        this.helpSupportLink = 'text=HELP & SUPPORT';
        this.agentLink = 'text=AGENT LOGIN';
        this.dailyDealsLink = 'text=DAILY DEALS';
        this.hindiLink = 'text=हिंदी';
        this.logo = 'img[alt="IRCTC Logo"]';
        this.pnrStatusLink = 'text=PNR STATUS';
        this.chartsVacancyLink = 'text=CHARTS/VACANCY';
        this.bookTicketLink = 'text=BOOK TICKET';
        this.searchLink = 'text=SEARCH';
        this.easyBookingLink = 'text=EASY BOOKING ON ASK DISHA';
    }

    // Method to open the IRCTC portal
    async open() {
        await this.page.goto('https://www.irctc.co.in/nget/train-search', { timeout: 30000 });
        await this.page.waitForTimeout(10000);
    }

    // Method to click on the menu button
    async clickMenu() {
        await this.page.locator(this.menuButton).click();
    }

    // Method to check visibility of elements
    async checkVisibilityOfElements() {
        await this.page.locator(this.loginLink).nth(0).isVisible();
        await this.page.locator(this.irctcExclusiveLink).nth(0).isVisible();
        await this.page.locator(this.trainsLink).nth(0).isVisible();
        await this.page.locator(this.loyaltyLink).nth(0).isVisible();
        await this.page.locator(this.irctcEwalletLink).nth(0).isVisible();
        await this.page.locator(this.busesLink).nth(0).isVisible();
        await this.page.locator(this.flightsLink).nth(0).isVisible();
        await this.page.locator(this.hotelsLink).nth(0).isVisible();
        await this.page.locator(this.holidaysLink).nth(0).isVisible();
        await this.page.locator(this.mealsLink).nth(0).isVisible();
        await this.page.locator(this.promotionsLink).nth(0).isVisible();
        await this.page.locator(this.alertsLink).nth(0).isVisible();
        await this.page.locator(this.moreLink).nth(0).isVisible();
        await this.page.locator(this.contactLink).nth(0).isVisible();
        await this.page.locator(this.helpSupportLink).nth(0).isVisible();
        await this.page.locator(this.agentLink).nth(0).isVisible();
        await this.page.locator(this.dailyDealsLink).nth(0).isVisible();
        await this.page.locator(this.hindiLink).nth(0).isVisible();
        await this.page.locator(this.logo).nth(0).isVisible();
        await this.page.locator(this.pnrStatusLink).nth(0).isVisible();
        await this.page.locator(this.chartsVacancyLink).nth(0).isVisible();
        await this.page.locator(this.bookTicketLink).nth(0).isVisible();
        await this.page.locator(this.searchLink).nth(0).isVisible();
        await this.page.locator(this.easyBookingLink).nth(0).isVisible();
    }
}

module.exports = IRCTCPage;
