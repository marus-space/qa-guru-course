import { PASSWORD, USERNAME } from "../src/constants";

export class UserProfileSettingsPage {
  constructor({ page }) {
    this.page = page;
    this.imageUrlInputName = 'URL of profile picture';
    this.usernameInputName = 'Your Name';
    this.bioInputName = 'Short bio about you';
    this.passwordInputName = 'Password';
    this.updateSettingsButton = page.getByRole('button', { name: 'Update Settings' });
  }

  async updateUserProfileSettings({ imageUrl, username, bio, password = PASSWORD }) {
    await this.#clickAndFill(this.imageUrlInputName, imageUrl);
    await this.#clickAndFill(this.usernameInputName, username);
    await this.#clickAndFill(this.bioInputName, bio);
    await this.#clickAndFill(this.passwordInputName, password);

    await this.updateSettingsButton.click();
  }

  async resetUserProfileSettings() {
    await this.#clickAndFill(this.imageUrlInputName, '');
    await this.#clickAndFill(this.usernameInputName, USERNAME);
    await this.#clickAndFill(this.bioInputName, '');
    await this.#clickAndFill(this.passwordInputName, PASSWORD);

    await this.updateSettingsButton.click();
  };

  async #clickAndFill(name, value) {
    await this.page.getByRole('textbox', { name }).click();
    await this.page.getByRole('textbox', { name }).fill(value);
  }
}