const roles = ['janitor', 'admin', 'mod', 'guest', 'mod+', 'prog'];

const JANITOR = 0;
const ADMIN = 1;
const MOD = 2;
const GUEST = 3;
const MODPLUS = 4;

const roleRights = new Map();
roleRights.set(roles[JANITOR], ['panel']);
roleRights.set(roles[ADMIN], ['panel', 'manageUsers', 'manageBoards', 'managePosts', 'bans']);
roleRights.set(roles[MOD], ['panel', 'managePosts', 'bans']);
roleRights.set(roles[GUEST], ['panel']);
roleRights.set(roles[MODPLUS], ['panel', 'managePosts', 'bans']);

module.exports = {
  roles,
  roleRights,
};
