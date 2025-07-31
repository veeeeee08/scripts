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
      providers: ['action_input', 'read_from_vault']
    },
    userName: {
      type: 'string',
      providers: ['user_input', 'read_from_vault']
    },
    password: {
      type: 'string',
      providers: ['user_input', 'read_from_vault']
    }
  },
  required: ['email', 'userName', 'password'],
  additionalProperties: false
};

/**
 * @typedef {Object} Inputs
 * @property {string} email
 * @property {string} userName
 * @property {string} password
 */

/**
 * @param {{ 
 *   driver: Driver, 
 *   logger: (...args: any[]) => void, 
 *   inputs: Inputs
 * }} context
 */
export default async function main({ driver, logger, inputs }) {
  logger('🚀 Starting Figma Invite Script');

  await loginToFigma({ driver, logger, inputs });
  await inviteUserToTeam({ driver, logger, inviteEmail: inputs.email });

  logger('✅ Script completed');
  return { success: true };
}

/**
 * @param {{ driver: Driver, logger: (...args: any[]) => void, inputs: Inputs }} ctx
 */
async function loginToFigma({ driver, logger, inputs }) {
  logger('🔐 Navigating to Figma login page...');
  await driver.goto('https://www.figma.com/login');

  logger('✏️ Filling email...');
  await driver.click('xpath=/html/body/div[1]/div/div/div/div/form/div[2]/input');
  await driver.type('xpath=/html/body/div[1]/div/div/div/div/form/div[2]/input', inputs.userName);

  logger('✏️ Filling password...');
  await driver.click('xpath=/html/body/div[1]/div/div/div/div/form/div[4]/input');
  await driver.type('xpath=/html/body/div[1]/div/div/div/div/form/div[4]/input', inputs.password);

  logger('➡️ Clicking login...');
  await driver.click('xpath=/html/body/div[1]/div/div/div/div/form/button[2]');
}

/**
 * @param {{ driver: Driver, logger: (...args: any[]) => void, inviteEmail: string }} ctx
 */
async function inviteUserToTeam({ driver, logger, inviteEmail }) {
  logger('🧭 Navigating to New Team...');
  await driver.waitForSelector('xpath=/html/body/div[2]/div/div/div/div/div/nav/div/div/div[2]/div/div/div/div[2]/div/div[4]/div/button');
  await driver.click('xpath=/html/body/div[2]/div/div/div/div/div/nav/div/div/div[2]/div/div/div/div[2]/div/div[4]/div/button');

  logger('📤 Clicking Share...');
  await driver.click('xpath=/html/body/div[2]/div/div/div/div[1]/div/div/div[4]/div/div[2]/div[2]/button');

  logger('📝 Entering invitee email...');
  await driver.click('xpath=/html/body/div[2]/div/div/div/div[3]/div/div[2]/section/div/div[2]/div/div/div[4]/form/div/div/div/div/input');
  await driver.type('xpath=/html/body/div[2]/div/div/div/div[3]/div/div[2]/section/div/div[2]/div/div/div[4]/form/div/div/div/div/input', inviteEmail);

  logger('📨 Clicking Invite...');
  await driver.click('xpath=/html/body/div[2]/div/div/div/div[3]/div/div[2]/section/div/div[2]/div/div/div[4]/form/div/button');
}
