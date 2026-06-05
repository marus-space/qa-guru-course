import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

import { MainPage } from '../pages/main.page';
import { LoginPage } from '../pages/login.page';
import { AuthenticatedMainPage } from '../pages/authenticated-main.page';
import { ArticlePage } from '../pages/article.page';
import { UserProfilePage } from '../pages/user-profile.page';
import { NewArticlePage } from '../pages/new-article.page';

const username = 'Test User';
const email = 'test_user@example.com';
const password = 'test_password';

test('1. Пользователь может перейти на страницу просмотра статьи', async ({ page }) => {
  const mainPage = new MainPage({ page });
  const articlePage = new ArticlePage({ page });

  await mainPage.goToMainPage();

  const articlePath = await mainPage.getFirstArticlePath();
  const articleName = await mainPage.getFirstArticleName();

  await mainPage.clickFirstArticlePreviewLink();

  await expect(page).toHaveURL(mainPage.getBaseUrl() + articlePath);
  await expect(await articlePage.getArticleHeading()).toContainText(articleName);
});

test('2. Пользователь может перейти в профиль автора статьи', async ({ page }) => {
  const mainPage = new MainPage({ page });
  const userProfilePage = new UserProfilePage({ page });

  await mainPage.goToMainPage();

  const authorPath = await mainPage.getFirstArticleAuthorPath();
  const authorName = await mainPage.getFirstArticleAuthorName();

  await mainPage.clickFirstArticleAuthorLink();

  await expect(page).toHaveURL(mainPage.getBaseUrl() + authorPath);
  await expect(await userProfilePage.getUserHeading()).toContainText(authorName);
  await expect(await userProfilePage.getUserImage()).toBeVisible();
});

test.describe('Тесты на функциональность, доступную авторизованным пользователям', () => { 
  test.beforeEach(async ({ page }) => {
    const mainPage = new MainPage({ page });
    const loginPage = new LoginPage({ page });
    const authenticatedMainPage = new AuthenticatedMainPage({ page });

    await mainPage.goToMainPage();
    await mainPage.goToLogin();
    await loginPage.signIn({ email, password });

    await expect(authenticatedMainPage.getProfileDropdown()).toContainText(username);
  });

  test('3. Авторизованный пользователь может добавить и удалить статью из Избранного', async ({ page }) => {
    const authenticatedMainPage = new AuthenticatedMainPage({ page });

    await authenticatedMainPage.openGlobalFeed();

    const initialCount = await authenticatedMainPage.getFirstAddToFavoritesButtonCount();
    const isInitialActive = await authenticatedMainPage.getIsFirstAddToFavoritesButtonActive();

    const addArticleToFavorites = async () => {
      await authenticatedMainPage.clickFirstAddToFavoritesButton();
    
      await expect(await authenticatedMainPage.getFirstAddToFavoritesButton()).toContainClass('active');
      expect(await authenticatedMainPage.getFirstAddToFavoritesButtonCount()).toBe(initialCount + (isInitialActive ? 0 : 1));
    };

    const deleteArticleFromFavorites = async () => {
      await authenticatedMainPage.clickFirstAddToFavoritesButton();

      await expect(await authenticatedMainPage.getFirstAddToFavoritesButton()).not.toContainClass('active');
      expect(await authenticatedMainPage.getFirstAddToFavoritesButtonCount()).toBe(initialCount - (isInitialActive ? 1 : 0));
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
    const authenticatedMainPage = new AuthenticatedMainPage({ page });
    const userProfilePage = new UserProfilePage({ page });

    await authenticatedMainPage.clickProfileDropdown();
    await authenticatedMainPage.clickProfileLink();

    const userPath = await authenticatedMainPage.getProfilePath();
    const userName = await authenticatedMainPage.getProfileName();

    await expect(page).toHaveURL(authenticatedMainPage.getBaseUrl() + userPath);
    await expect(await userProfilePage.getUserHeading()).toContainText(userName);
    await expect(await userProfilePage.getUserImage()).toBeVisible();
  });

  test('5. Авторизованный пользователь может создать статью', async ({ page }) => {
    const authenticatedMainPage = new AuthenticatedMainPage({ page });
    const newArticlePage = new NewArticlePage({ page });
    const articlePage = new ArticlePage({ page });

    const newArticlePath = await authenticatedMainPage.getNewArticlePath();

    await authenticatedMainPage.clickNewArticleLink();

    await expect(page).toHaveURL(authenticatedMainPage.getBaseUrl() + newArticlePath);

    const article = {
      title: faker.lorem.sentence(5),
      description: faker.lorem.sentence(10),
      content: faker.lorem.paragraphs(3),
      tags: Array.from({ length: 3 }).map(() => faker.word.noun()).join(' '),
    };

    await newArticlePage.createNewArticle(article);

    await expect(await articlePage.getArticleHeading()).toContainText(article.title);
    await expect(await articlePage.getArticleContent()).toContainText(article.content);
    
    for (const tag of article.tags.split(' ')) {
      await expect(await articlePage.getTagList()).toContainText(tag);
    }
  });
});
