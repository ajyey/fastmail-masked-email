import axios from 'axios';

const mockAxios = jest.genMockFromModule<typeof axios>('axios') as jest.Mocked<
  typeof axios
>;

export default mockAxios;
