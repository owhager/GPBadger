//using jest for junit testing and mocking

const ratings = require('@mtucourses/rate-my-professors').default;
import { getRateMyProfData } from '../src/RateMyProf';

//mocking mtu RMP graphql wrapper so that we don't actually make calls
jest.mock('@mtucourses/rate-my-professors', () => ({
  default: {
    searchTeacher: jest.fn(),
    getTeacher: jest.fn(),
  },
}));

//keeping things fresh and clean
describe('getRateMyProfData', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  //fake prof data based on TAs because I'm not creative lol
  it('should return RMP data when prof exists', async () => {
    const mockProfs = [
      { id: 123, firstName: 'Manaswini', lastName: 'Gogineni' },
    ];
    
    //fake prof RMP stats
    const mockProfData = {
      averageDifficulty: 3.5,
      averageRating: 4.2,
      wouldTakeAgainPercent: 90,
    };

    //using mockResolvedValue because we want async function to mock return
    ratings.searchTeacher.mockResolvedValue(mockProfs);
    ratings.getTeacher.mockResolvedValue(mockProfData);

    const result = await getRateMyProfData('Manaswini', 'Gogineni');

    expect(ratings.searchTeacher).toHaveBeenCalledWith('gogineni', 'U2Nob29sLTE4NDE4');
    expect(ratings.getTeacher).toHaveBeenCalledWith(123);
    expect(result).toEqual(mockProfData);
  });

  it('should return null if professor DNE', async () => {
    //blank search teacher retun
    ratings.searchTeacher.mockResolvedValue([]);

    //fake prof name
    const result = await getRateMyProfData('poop', 'pee');

    //should not be called because last name is never found which is first step of function
    expect(ratings.searchTeacher).toHaveBeenCalledWith('pee', 'U2Nob29sLTE4NDE4');
    expect(ratings.getTeacher).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('should return null if prof ID is not found with first name', async () => {
    //fake prof name to search
    const mockSearchResults = [
      { id: 123, firstName: 'Micahel', lastName: 'Yu' },
    ];

    ratings.searchTeacher.mockResolvedValue(mockSearchResults);

    //search with correct last name but incorrect first name
    const result = await getRateMyProfData('Poop', 'Yu');

    expect(ratings.searchTeacher).toHaveBeenCalledWith('yu', 'U2Nob29sLTE4NDE4');
    
    //should not be called because first name is never found which is second step of function
    expect(ratings.getTeacher).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
