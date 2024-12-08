// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { CognitoJwtVerifier } from 'aws-jwt-verify';

@Injectable()
export class AuthService {
  private readonly verifier: any;

  constructor() {
    // Initialize the Cognito JWT verifier
    this.verifier = CognitoJwtVerifier.create({
      userPoolId: process.env.USER_POOL_ID,
    });
  }

  async validateToken(token: string): Promise<any> {
    try {
      const payload = await this.verifier.verify(token, {
        clientId: null,
        tokenUse: 'access',
      });
      return payload; // Return the decoded JWT payload
    } catch (err) {
      throw new Error(`Token validation failed: ${err.message}`);
    }
  }
}
