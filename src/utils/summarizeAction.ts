type Action = {
  type: string;
  [key: string]: any;
};

function getNestedKeys(obj: any, prefix = ''): string[] {
  return Object.entries(obj).reduce((acc: string[], [key, value]) => {
    const currentPath = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return [...acc, ...getNestedKeys(value, currentPath)];
    }
    return [...acc, currentPath];
  }, []);
}

export function summarizeAction(action: Action): string {
  const stringified = JSON.stringify(action, null, 2);

  if (stringified.length <= 100) {
    return stringified;
  }

  const keys = getNestedKeys(action);
  return `Action ${action.type} with keys: ${keys.join(', ')}`;
}

// Example usage:
const smallAction = {
  type: 'FETCH_USER',
  payload: { id: 123 },
};

const largeAction = {
  type: 'UPDATE_USER_SETTINGS',
  payload: {
    userId: 123,
    settings: {
      notifications: {
        email: true,
        push: false,
        frequency: 'daily',
      },
      theme: {
        mode: 'dark',
        colors: {
          primary: '#000',
          secondary: '#fff',
        },
      },
    },
  },
};

// console.log(summarizeAction(smallAction));
// {"type":"FETCH_USER","payload":{"id":123}}

// console.log(summarizeAction(largeAction));
// Action UPDATE_USER_SETTINGS with keys: type, payload.userId, payload.settings.notifications.email, payload.settings.notifications.push, payload.settings.notifications.frequency, payload.settings.theme.mode, payload.settings.theme.colors.primary, payload.settings.theme.colors.secondary
