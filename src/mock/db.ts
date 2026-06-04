import { User } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'u-1',
    name: 'Aditya Sharma',
    email: 'superadmin@popli.com',
    role: 'super_admin',
    status: 'active',
    phone: '+91 98765 43210',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 'u-2',
    name: 'Shalini Nair',
    email: 'moderator@popli.com',
    role: 'moderator',
    status: 'active',
    phone: '+91 98234 56789',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 'u-3',
    name: 'Sunita Patil',
    email: 'finance@popli.com',
    role: 'finance_admin',
    status: 'active',
    phone: '+91 99887 76655',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 'u-4',
    name: 'Vikram Rao',
    email: 'support@popli.com',
    role: 'support_admin',
    status: 'active',
    phone: '+91 97654 32109',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 'u-5',
    name: 'Manish Sen',
    email: 'marketing@popli.com',
    role: 'marketing_admin',
    status: 'active',
    phone: '+91 96543 21098',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
];
