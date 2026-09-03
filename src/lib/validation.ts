export function validateRequiredFields(payload: Record<string, any>, required: string[]): string | null {
  for (const field of required) {
    if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
      return `Missing required field: '${field}'`;
    }
  }
  return null;
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validateEnum(val: string, allowed: string[], fieldName: string): string | null {
  if (!allowed.includes(val)) {
    return `Invalid ${fieldName}: '${val}'. Must be one of [${allowed.join(', ')}]`;
  }
  return null;
}

export function validateCoordinates(lat: number, lng: number): string | null {
  if (typeof lat !== 'number' || isNaN(lat) || lat < -90 || lat > 90) {
    return `Invalid latitude: '${lat}'`;
  }
  if (typeof lng !== 'number' || isNaN(lng) || lng < -180 || lng > 180) {
    return `Invalid longitude: '${lng}'`;
  }
  return null;
}
