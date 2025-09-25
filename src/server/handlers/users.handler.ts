import type { User } from '../../shared/types/user';

export const mockUsers: User[] = [
  { id: 'u1', username: 'alice', email: 'alice@example.com', age: 28 },
  { id: 'u2', username: 'bob', email: 'bob@example.com', age: 34 },
  { id: 'u3', username: 'carol', email: 'carol@example.com' },
  { id: 'u4', username: 'dan', email: 'dan@example.com', age: 41 },
  { id: 'u5', username: 'erin', email: 'erin@example.com', age: 22 },
];

export async function listUsers(): Promise<User[]> {
  return Promise.resolve(mockUsers);
}
