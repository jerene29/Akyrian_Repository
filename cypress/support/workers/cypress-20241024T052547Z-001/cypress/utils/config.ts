interface Config {
  url: any;
  name: string;
  imageUrl: any;
  mockOtp?: string;
}

// converts "staging-2" to "Staging 2"
const toTitle = (slug: string) =>
  slug
    .toLowerCase()
    .split(/[-_.\s]/)
    .map((w) => `${w.charAt(0).toUpperCase()}${w.substr(1)}`)
    .join(' ');

const releaseEnv = process.env.VITE_RELEASE_ENV || '';
const apiUrl = process.env.VITE_API_URL || '';
const mockOtp =
  releaseEnv === 'testing'
    ? `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_MOCK_OTP}`
    : '';

const config: Config = {
  name: toTitle(releaseEnv) || 'Development',
  url: apiUrl,
  imageUrl: apiUrl,
  mockOtp,
};

export default config;
