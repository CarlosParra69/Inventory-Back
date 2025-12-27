import { Request, Response, NextFunction} from 'express';

export function authorize(...allowedRoles: string[]){
    return (req: Request, res: Response, next: NextFunction) => {
        
        if (!req.user) {
            return res.status(401).json({ message: 'No autenticado' });
        }

        if (!req.user.role) {
            return res.status(403).json({ message: 'Rol no definido'});
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Acceso denegado'});
        }

        next();
    };
}