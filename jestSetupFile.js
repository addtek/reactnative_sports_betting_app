import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';
import mockNetInfo from '@react-native-community/netinfo/jest/netinfo-mock';
jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);
jest.mock('@react-native-community/netinfo', () => mockNetInfo);