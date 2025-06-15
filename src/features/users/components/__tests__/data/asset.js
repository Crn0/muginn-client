import { faker } from "@faker-js/faker";

export default Array.from({ length: 20 }, (_, i) => i).map((v) => ({
  key: v,
  asset: {
    url: faker.image.avatar({ height: 250, width: 250 }),
    images: [
      {
        url: faker.image.url({ height: 64, width: 64 }),
        size: 64,
      },
    ],
  },
}));
