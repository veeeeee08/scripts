// @ts-check
/** @typedef {import('driver-lib').Driver} Driver */

export const metadata = {
  displayName: 'Figma Invite User to Team',
  version: '1',
};

export const inputsSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
      providers: ['read_from_vault']
    },
    password: {
      type: 'string',
      providers: ['read_from_vault']
    },
    inviteEmail: {
      type: 'string',
      providers: ['action_input']
    }
  },
  required: ['email', 'password', 'inviteEmail'],
  additionalProperties: false
};

/**
 * @typedef {Object} Inputs
 * @property {string} email
 * @property {string} password
 * @property {string} inviteEmail
 */

/**
 * @param {{ driver: Driver, logger: (...args: any[]) => void, inputs: Inputs }} context
 */
export default async function main({ driver, logger, inputs }) {
  logger('🚀 Navigating to Figma login...');
  await driver.goto('https://www.figma.com/login');

  logger('✏️ Typing email...');
  await driver.click('xpath=/html/body/div[1]/div/div/div/div/form/div[2]/input');
  await driver.type('xpath=/html/body/div[1]/div/div/div/div/form/div[2]/input', inputs.email);

  logger('🔒 Typing password...');
  await driver.click('xpath=/html/body/div[1]/div/div/div/div/form/div[4]/input');
  await driver.type('xpath=/html/body/div[1]/div/div/div/div/form/div[4]/input', inputs.password);

  logger('➡️ Submitting login form...');
  await driver.click('xpath=/html/body/div[1]/div/div/div/div/form/button[2]');

  logger('🧭 Navigating to "New Team"...');
  await driver.waitForSelector('xpath=/html/body/div[2]/div/div/div/div/div/nav/div/div/div[2]/div/div/div/div[2]/div/div[4]/div/button');
  await driver.click('xpath=/html/body/div[2]/div/div/div/div/div/nav/div/div/div[2]/div/div/div/div[2]/div/div[4]/div/button');

  logger('📤 Opening Share dialog...');
  await driver.click('xpath=/html/body/div[2]/div/div/div/div[1]/div/div/div[4]/div/div[2]/div[2]/button');

  logger(`📨 Inviting user: ${inputs.inviteEmail}`);
  await driver.click('xpath=/html/body/div[2]/div/div/div/div[3]/div/div[2]/section/div/div[2]/div/div/div[4]/form/div/div/div/div/input');
  await driver.type('xpath=/html/body/div[2]/div/div/div/div[3]/div/div[2]/section/div/div[2]/div/div/div[4]/form/div/div/div/div/input', inputs.inviteEmail);

  logger('✅ Clicking Invite button...');
  await driver.click('xpath=/html/body/div[2]/div/div/div/div[3]/div/div[2]/section/div/div[2]/div/div/div[4]/form/div/button');

  logger('🎉 Invite flow completed.');
  return { success: true };
}
