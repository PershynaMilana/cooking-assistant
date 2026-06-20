// a name part (first or last): a capital first letter then lowercase letters
const NAME_PATTERN = /^[A-ZА-Я][a-zа-я]+$/;
const MIN_LOGIN_LENGTH = 2;
const MIN_PASSWORD_LENGTH = 6;

export const isValidNamePart = (value: string): boolean =>
    NAME_PATTERN.test(value);

export const isValidLogin = (value: string): boolean =>
    value.length >= MIN_LOGIN_LENGTH;

export const isValidPassword = (value: string): boolean =>
    value.length >= MIN_PASSWORD_LENGTH;
