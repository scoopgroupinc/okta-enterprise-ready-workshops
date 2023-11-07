import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const org = await prisma.org.create({
    data: {
      domain: 'portal.example',
      apikey: '131313',
      issuer: 'https://dev-21285087.okta.com/oauth2/default',
      authorization_endpoint:
        'https://dev-21285087.okta.com/oauth2/default/v1/authorize',
      token_endpoint: 'https://dev-21285087.okta.com/oauth2/default/v1/token',
      userinfo_endpoint:
        'https://dev-21285087.okta.com/oauth2/default/v1/userinfo',
      client_id: '0oad3mewj7nVTM5mL5d7',
      client_secret:
        '4LJCCNz5WfrIgKHg_PLPxN2Meo0cLfhpgoF28-jKWYiHF7xWT42ZRN8SLopri8DA',
    },
  });
  console.log('Created org Portal', org);

  const somnusUser = await prisma.user.create({
    data: {
      name: 'Somnus Pan',
      email: 'somnus@portal.example',
      password: 'correct horse battery staple',
      orgId: org.id,
      externalId: '22',
      active: true,
    },
  });
  console.log('Created user Somnus', somnusUser);

  const trinityUser = await prisma.user.create({
    data: {
      name: 'Trinity Moore',
      email: 'trinity@portal.example',
      password: 'Zion',
      orgId: org.id,
      externalId: '23',
      active: true,
    },
  });
  console.log('Created user Trinity', trinityUser);

  const maxUser = await prisma.user.create({
    data: {
      name: 'Max Katz',
      email: 'max@okta.com',
      password: 'okta',
    },
  });
  console.log('Created user Max', maxUser);

  
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
