import { randomUUID } from 'crypto';

export class UserModelView {
  constructor(
    public id: string = randomUUID(),
    public login: string,
    public email: string,
    public createdAt: string = new Date().toISOString(),
    public password: string,
    public codeConfirmation: string = randomUUID(),
    public isConfirmed: boolean,
  ) {}
}

export class UserModelResult {
  constructor(
    public id: string = randomUUID(),
    public login: string,
    public email: string,
    public createdAt: string = new Date().toISOString(),
  ) {}
}