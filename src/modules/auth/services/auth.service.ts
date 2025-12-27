import bcrypt from 'bcrypt';
import { AuthRepository } from '../repositories/auth.repository';
import { verifyRefreshToken } from '../../../shared/utils/token';

import {
    generateAccessToken,
    generateRefreshToken
} from '../../../shared/utils/token';
import { JwtPayload } from '../interfaces/jwt.interface';

export class AuthService {
    private repository = new AuthRepository();

    // Iniciar Sesion
    async login(email: string, password: string) {
        const user = await this.repository.findByEmail(email);

        if (!user) {
            throw new Error('Credenciales inválidas');
        }

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            throw new Error('Credenciales inválidas');
        }

        const accessToken = generateAccessToken({
            sub: user.id,
            email: user.email,
            role: user.role
        });

        const refreshToken = generateRefreshToken({
            sub: user.id
        });

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await this.repository.saveRefreshToken(
            user.id,
            refreshToken,
            expiresAt
        );

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    }

    // Registro de Nuevo Usuario
    async register(name: string, email: string, password: string) {
        const existingUser = await this.repository.findByEmail(email);

        if (existingUser) {
            throw new Error('El correo ya está en uso');
        }

        if (password.length < 6) {
            throw new Error('La contraseña debe tener al menos 6 caracteres');
        }

        const password_hash = await bcrypt.hash(password, 10);

        return this.repository.createUser(
            name,
            email,
            password_hash
        );
    }

    // Refresh Token con Rotacion
    async refreshToken(refreshToken: string) {
    if (!refreshToken) {
        throw new Error('Refresh token requerido');
    }

    const stored = await this.repository.findRefreshToken(refreshToken);
    if (!stored) {
        throw new Error('Refresh token reutilizado o inválido');
    }

    let payload: JwtPayload;
    try {
        payload = verifyRefreshToken(refreshToken) as JwtPayload;
    } catch {
        await this.repository.deleteRefreshToken(refreshToken);
        throw new Error('Refresh token expirado');
    }

    const user = await this.repository.findUserById(payload.sub);
    if (!user) {
        throw new Error('Usuario no existe');
    }

    const newAccessToken = generateAccessToken({
        sub: user.id,
        email: user.email,
        role: user.role,
    });

    const newRefreshToken = generateRefreshToken({ sub: user.id });
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.repository.rotateRefreshToken(
        refreshToken,
        user.id,
        newRefreshToken,
        expiresAt
    );

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    };
}


    // Cerrar Sesion
    async logout(refreshToken: string) {
        if (!refreshToken) return;
        await this.repository.deleteRefreshToken(refreshToken);
    }
}
