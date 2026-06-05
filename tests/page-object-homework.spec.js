import { test, expect } from '@playwright/test';
import { App } from '../pages/app';
import { ArticleBuilder } from '../src/helpers/builders';

const username = 'Test User';
const email = 'test_user@example.com';
const password = 'test_password';

test('1. Пользователь может перейти на страницу просмотра статьи', async ({ page }) => {
  const app = new App({ page });

  await app.mainPage.goToMainPage();

  const articlePath = await app.mainPage.getFirstArticlePath();
  const articleName = await app.mainPage.getFirstArticleName();

  await app.mainPage.clickFirstArticlePreviewLink();

  await expect(page).toHaveURL(app.mainPage.getBaseUrl() + articlePath);
  await expect(await app.articlePage.getArticleHeading()).toContainText(articleName);
});

test('2. Пользователь может перейти в профиль автора статьи', async ({ page }) => {
  const app = new App({ page });

  await app.mainPage.goToMainPage();

  const authorPath = await app.mainPage.getFirstArticleAuthorPath();
  const authorName = await app.mainPage.getFirstArticleAuthorName();

  await app.mainPage.clickFirstArticleAuthorLink();

  await expect(page).toHaveURL(app.mainPage.getBaseUrl() + authorPath);
  await expect(await app.userProfilePage.getUserHeading()).toContainText(authorName);
  await expect(await app.userProfilePage.getUserImage()).toBeVisible();
});

test.describe('Тесты на функциональность, доступную авторизованным пользователям', () => { 
  test.beforeEach(async ({ page }) => {
    const app = new App({ page });

    await app.mainPage.goToMainPage();
    await app.mainPage.goToLogin();
    await app.loginPage.signIn({ email, password });

    await expect(app.authenticatedMainPage.getProfileDropdown()).toContainText(username);
  });

  test('3. Авторизованный пользователь может добавить и удалить статью из Избранного', async ({ page }) => {
    const app = new App({ page });

    await app.authenticatedMainPage.openGlobalFeed();

    const initialCount = await app.authenticatedMainPage.getFirstAddToFavoritesButtonCount();
    const isInitialActive = await app.authenticatedMainPage.getIsFirstAddToFavoritesButtonActive();

    const addArticleToFavorites = async () => {
      await app.authenticatedMainPage.clickFirstAddToFavoritesButton();
    
      await expect(await app.authenticatedMainPage.getFirstAddToFavoritesButton()).toContainClass('active');
      expect(await app.authenticatedMainPage.getFirstAddToFavoritesButtonCount()).toBe(initialCount + (isInitialActive ? 0 : 1));
    };

    const deleteArticleFromFavorites = async () => {
      await app.authenticatedMainPage.clickFirstAddToFavoritesButton();

      await expect(await app.authenticatedMainPage.getFirstAddToFavoritesButton()).not.toContainClass('active');
      expect(await app.authenticatedMainPage.getFirstAddToFavoritesButtonCount()).toBe(initialCount - (isInitialActive ? 1 : 0));
    };

    if (isInitialActive) {
      await deleteArticleFromFavorites();
      await addArticleToFavorites();
    } else {
      await addArticleToFavorites();
      await deleteArticleFromFavorites();
    }
  });

  test('4. Авторизованный пользователь может перейти в свой профиль', async ({ page }) => {
    const app = new App({ page });

    await app.authenticatedMainPage.clickProfileDropdown();
    await app.authenticatedMainPage.clickProfileLink();

    const userPath = await app.authenticatedMainPage.getProfilePath();
    const userName = await app.authenticatedMainPage.getProfileName();

    await expect(page).toHaveURL(app.authenticatedMainPage.getBaseUrl() + userPath);
    await expect(await app.userProfilePage.getUserHeading()).toContainText(userName);
    await expect(await app.userProfilePage.getUserImage()).toBeVisible();
  });

  test('5. Авторизованный пользователь может создать статью', async ({ page }) => {
    const article = new ArticleBuilder().withTitle().withDescription().withContent().withTags().build();

    const app = new App({ page });

    const newArticlePath = await app.authenticatedMainPage.getNewArticlePath();

    await app.authenticatedMainPage.clickNewArticleLink();

    await expect(page).toHaveURL(app.authenticatedMainPage.getBaseUrl() + newArticlePath);

    await app.newArticlePage.createNewArticle(article);

    await expect(await app.articlePage.getArticleHeading()).toContainText(article.title);
    await expect(await app.articlePage.getArticleContent()).toContainText(article.content);
    
    for (const tag of article.tags.split(',')) {
      await expect(await app.articlePage.getTagList()).toContainText(tag);
    }
  });
});
