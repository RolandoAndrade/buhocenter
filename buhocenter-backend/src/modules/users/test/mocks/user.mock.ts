import { User } from '../../entities/user.entity';

function createUser(
    id: number,
    name: string,
    lastName: string,
    birthdate: Date,
    email: string,
    is_federate: boolean,
    uid: string,
    token: string,
    language: string,
): User {
    return {
        id,
        name,
        language,
        lastName,
        birthdate,
        email,
        is_federate,
        uid,
        token,
    } as User;
}

export const userMockDB = [
    createUser(1, 'A', 'AA', new Date(), 'a@a.com', true, '1', 'aaa', 'ES'),
    createUser(2, 'B', 'BB', new Date(), 'b@b.com', true, '1', 'aaa', 'ES'),
    createUser(3, 'C', 'CC', new Date(), 'c@c.com', true, '1', 'aaa', 'ES'),
];
