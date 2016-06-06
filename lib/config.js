const env = process.env;

module.exports = {
	github_token: env.GITHUB_TOKEN,
	travis_token: env.TRAVIS_TOKEN,
	organization: env.GITHUB_ORGANIZATION
};