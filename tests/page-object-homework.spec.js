import { test, expect } from '@playwright/test';
import { App } from '../pages/app';
import { ArticleBuilder, UserBuilder } from '../src/helpers/builders';
import { EMAIL, PASSWORD } from '../src/constants';
import { faker } from '@faker-js/faker';

test.describe('Тесты на функциональность, доступную авторизованным пользователям', () => { 
  test.describe.configure({ mode: 'serial' });
  
  test.beforeEach(async ({ page }) => {
    const app = new App({ page });

    await app.mainPage.goToMainPage();
    await app.mainPage.goToLogin();
    await app.loginPage.signIn({ email: EMAIL, password: PASSWORD });
  });

  // FIXME: На сайте при редактировании профиля поле с паролем по умолчанию пустое и его разрешается сохранить, 
  // но при авторизации пустой пароль запрещен
  test('1. Авторизованный пользователь может изменить данные своего профиля', async ({ page }) => {
    const user = new UserBuilder()
      .withUsername()
      .withBio()
      .withImageUrl()
      .build();

    const app = new App({ page });
    
    try {
      await app.authenticatedMainPage.clickDropdownSettingsLink();
      await app.userProfileSettingsPage.updateUserProfileSettings(user);

      await expect(app.authenticatedMainPage.getProfileDropdown()).toContainText(user.username);

      await app.authenticatedMainPage.clickDropdownProfileLink();

      await expect(app.userProfilePage.getUserHeading()).toContainText(user.username);
      await expect(app.userProfilePage.getUserBio()).toContainText(user.bio);
      await expect(app.userProfilePage.getUserImage()).toHaveAttribute('src', user.imageUrl);
    } finally {
      await app.authenticatedMainPage.clickDropdownSettingsLink();
      await app.userProfileSettingsPage.resetUserProfileSettings();
    }
  });

  test('2. Авторизованный пользователь может создать статью', async ({ page }) => {
    const article = new ArticleBuilder().withTitle().withDescription().withContent().withTags().build();

    const app = new App({ page });

    const newArticlePath = await app.authenticatedMainPage.getNewArticlePagePath();

    await app.authenticatedMainPage.clickNewArticlePageLink();

    await expect(page).toHaveURL(app.authenticatedMainPage.getBaseUrl() + newArticlePath);

    await app.newArticlePage.createNewArticle(article);

    await expect(app.articlePage.getArticleHeading()).toContainText(article.title);
    await expect(app.articlePage.getArticleContent()).toContainText(article.content);
    
    for (const tag of article.tags.split(',')) {
      await expect(app.articlePage.getTagList()).toContainText(tag);
    }
  });

  test.describe('Тесты на функциональность статей', () => {
    let initialArticle;

    test.beforeEach(async ({ page }) => {
      initialArticle = new ArticleBuilder().withTitle().withDescription().withContent().withTags().build();

      const app = new App({ page });

      await app.authenticatedMainPage.clickNewArticlePageLink();

      await app.newArticlePage.createNewArticle(initialArticle);
    });

    // FIXME: На сайте не работает редактирование тегов
    test('3. Авторизованный пользователь может отредактировать статью', async ({ page }) => {
      const article = new ArticleBuilder().withTitle().withDescription().withContent().build();

      const app = new App({ page });

      await expect(app.articlePage.getArticleHeading()).toContainText(initialArticle.title);

      await app.articlePage.clickEditArticleButton();

      await app.editArticlePage.updateArticle(article);

      await expect(app.articlePage.getArticleHeading()).toContainText(article.title);
      await expect(app.articlePage.getArticleContent()).toContainText(article.content);
    });

    test('4. Авторизованный пользователь может добавить и удалить статью из Избранного', async ({ page }) => { 
      const app = new App({ page });

      await expect(app.articlePage.getArticleHeading()).toContainText(initialArticle.title);

      await app.authenticatedMainPage.clickDropdownProfileLink();

      await expect(app.userProfilePage.getFirstArticleHeading()).toContainText(initialArticle.title);
      await expect(app.userProfilePage.getFirstAddToFavoritesButton()).toBeVisible();

      const initialText = await app.userProfilePage.getFirstAddToFavoritesButtonText();
      const initialCount = await app.userProfilePage.getFirstAddToFavoritesButtonCount();

      await app.userProfilePage.clickFirstAddToFavoritesButton();
    
      await expect(app.userProfilePage.getFirstAddToFavoritesButton()).toContainClass('active');
      await expect(app.userProfilePage.getFirstAddToFavoritesButton()).toHaveText(initialText.replace(/\d+/, initialCount + 1));

      await app.userProfilePage.clickFirstAddToFavoritesButton();

      await expect(app.userProfilePage.getFirstAddToFavoritesButton()).not.toContainClass('active');
      await expect(app.userProfilePage.getFirstAddToFavoritesButton()).toHaveText(initialText.replace(/\d+/, initialCount));
    });

    test('5. Авторизованный пользователь может оставить комментарий к своей статье', async ({ page }) => {
      const comment = faker.lorem.paragraphs(1);

      const app = new App({ page });

      await expect(app.articlePage.getArticleHeading()).toContainText(initialArticle.title);

      await app.articlePage.postComment(comment);

      await expect(app.articlePage.getLastCommentCard()).toContainText(comment);
    });
  });
});
