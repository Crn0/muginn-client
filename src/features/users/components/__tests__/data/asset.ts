import { faker } from "@faker-js/faker";

export const asssets = Array.from({ length: 20 }, (_, i) => i).map((v) => ({
  key: v,
  asset: {
    url: faker.image.avatar(),
    images: [
      {
        url: faker.image.url({ height: 64, width: 64 }),
        size: 64,
      },
    ],
  },
}));
