export class ArticlePage {
  constructor({ page }) {
    this.page;
    this.articleHeading = page.locator('.article-page').locator('h1');
    this.articleContent = page.locator('.article-page').locator('.article-content');
    this.tagList = page.getByRole('list').and(page.locator('.tag-list'));
  }

  getArticleHeading() { 
    return this.articleHeading;
  }

  getArticleContent() {
    return this.articleContent;
  }

  getTagList() {
    return this.tagList;
  }
}
