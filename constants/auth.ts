/** Default password for all seeded demo accounts (local app storage only). */
export const DEFAULT_LOGIN_PASSWORD = 'password123';

export const DEMO_CREDENTIALS = {
  employer: {
    email: 'Hardik@company.com',
    password: DEFAULT_LOGIN_PASSWORD,
    label: 'HARDIK (HR Director / Admin)',
  },
  // employee: {
  //   email: 'alex.morgan@company.com',
  //   password: DEFAULT_LOGIN_PASSWORD,
  //   label: 'Alex Morgan (Senior Engineer)',
  // },
} as const;
