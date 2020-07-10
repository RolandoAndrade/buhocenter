import { Repository } from 'typeorm';

export interface MockFunctionInterface {
    find: jest.Mock<any, any>;
    findOne: jest.Mock<any, any>;
    save: jest.Mock<any, any>;
    update: jest.Mock<any, any>;
}

export const repositoryMockFactory: jest.Mock<MockFunctionInterface> = jest.fn(() => ({
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    save: jest.fn(),
}));
export type MockType<T> = {
    [P in keyof T]: jest.Mock<{}>;
};
