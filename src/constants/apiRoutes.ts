export const BASE_URL = 'http://localhost:5000'
export const API_ROUTES = {
  ROOT: '/',

  USERS: {
    GET_PROFILE: '/users',
    UPDATE: '/users',

    ACCESS: {
      SIGNUP: '/signup',
      LOGIN: '/login',
      REFRESH_TOKEN: '/refresh-token',
      CHANGE_PASSWORD: '/change-pass',
    },

    NOTES: {
      GET_NOTES: '/user/notes', // TODO: Implement
      CREATE_NOTE: '/users/notes',
      UPDATE_NOTE: '/users/notes/:userNoteId',
      DELETE_NOTE: '/users/notes/:userNoteId',
    },

    TASKS: {
      GET_TASKS: '/users/tasks', // TODO: Implement
      CREATE_TASK: '/users/tasks',
      UPDATE_TASK: '/users/tasks/:taskId',
      DELETE_TASK: '/users/tasks/:taskId',
    },
  },

  GROUPS: {
    CREATE: '/groups',
    GET: '/groups/:groupId', // TODO: Implement
    UPDATE: '/groups/:groupId',
    DELETE: '/groups/:groupId', // TODO: Implement

    ACCESS: {
      JOIN: '/groups/memberships',
      JOIN_REQUEST: '/groups/memberships',
      LEAVE: '/groups/memberships',
    },

    NOTES: {
      GET_NOTES: '/groups/:groupId/notes', // TODO: Implement
      CREATE_NOTE: '/groups/:groupId/notes',
      UPDATE_NOTE: '/groups/:groupId/notes/:groupNoteId',
      DELETE_NOTE: '/groups/:groupId/notes/:groupNoteId',
    },
  },
}
