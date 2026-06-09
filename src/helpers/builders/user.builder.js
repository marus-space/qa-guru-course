import { faker } from '@faker-js/faker';

export class UserBuilder {
  withEmail() {
    this.email = faker.internet.email({ provider: 'example.com' });
    return this;
  }
  withUsername(username) {
    this.username = username ?? faker.person.fullName();
    return this;
  }
  withPassword(length = 10) {
    this.password = faker.internet.password({ length });
    return this;
  }
  withImageUrl() {
    this.imageUrl = faker.image.url();
    return this;
  }
  withBio() {
    this.bio = faker.lorem.paragraphs(2);
    return this;
  }
  build() {
    return { ...this };
  }
}