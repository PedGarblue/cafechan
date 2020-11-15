import Roles from '../../../config/roles';

const sections = () => {
  return [
    {
      name: 'MODERACION',
      pages: [
        {
          name: 'recent-posts',
          title: 'Posts Recientes',
          authorize: [Roles.admin],
        },
      ],
    },
    {
      name: 'STAFF',
      pages: [
        {
          name: 'staff-view',
          title: 'Staff Management',
          authorize: [Roles.admin],
        },
      ],
    },
    {
      name: 'SITIO',
      pages: [
        {
          name: 'board-view',
          title: 'Board Management',
          authorize: [Roles.admin],
        },
      ],
    },
  ];
};

export default {
  sections,
};
