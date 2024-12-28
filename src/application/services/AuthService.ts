import {v4 as uuidv4} from 'uuid';
import jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';

export class AuthService {
    static generateTokens = (email: string, ip_address: string, user_id: number) => {
        let jti = uuidv4();

        const data = {
            jti: jti,
            user_id: user_id,
            ip_address: ip_address,
            email: email
        };
        const signature =  process.env.JWT_SECRET || 'secret';

        return {
            access_token: jwt.sign(data, signature, {expiresIn: '15m'}),
            refresh_token: jwt.sign(data, signature, {expiresIn: '7d'}),
            jti: jti
        }
    }

    static hashPassword = async (password: string) => {
        return await argon2.hash(password);
    }

    static verifyPassword = async (hash: string, password: string) => {
        return await argon2.verify(hash, password);
    }
}