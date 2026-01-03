const createObjectIfValueExists = (key: string, value: any) =>
  value !== undefined && value !== null && value !== '' ? { [key]: value } : {}

export default createObjectIfValueExists
